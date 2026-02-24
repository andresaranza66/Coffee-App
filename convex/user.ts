import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/* ------------------------------------------------ */
/* CURRENT USER                                     */
/* ------------------------------------------------ */

export const currentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", identity.subject))
      .unique();
  },
});

/* ------------------------------------------------ */
/* ENSURE USER (create if not exists)                */
/* ------------------------------------------------ */

export const ensureUser = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const existing = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", identity.subject))
      .unique();

    if (existing) return existing._id;

    return await ctx.db.insert("users", {
      authId: identity.subject,
      email: identity.email ?? "",
      name: identity.name ?? "",
      createdAt: Date.now(),
      drinksCount: 0,
      drinksMonth: new Date().toISOString().slice(0, 7),
    });
  },
});

// */ADD DRINKS COUNT
export const addDrink = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const currentMonth = new Date().toISOString().slice(0, 7);

    let newCount = 1;

    if (user.drinksMonth === currentMonth) {
      newCount = (user.drinksCount ?? 0) + 1;
    }

    await ctx.db.patch(user._id, {
      drinksCount: newCount,
      drinksMonth: currentMonth,
    });
  },
});

//CREATE SUBSCRIPTION
export const createSubscription = mutation({
  args: { coffeeName: v.string() },
  handler: async (ctx, { coffeeName }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    // Only update subscription info — do NOT touch drinksCount
    await ctx.db.patch(user._id, {
      coffeeName,
      subscriptionId: Math.random().toString(36).slice(2),
      subDate: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
