import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/* ------------------------------------------------ */
/* CURRENT USER                                     */
/* ------------------------------------------------ */

export const currentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Better Auth users are usually identified by their email in Convex
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
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
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .unique();

    if (existing) {
      // If Better Auth already made the user, just link the authId if missing
      if (!existing.authId) {
        await ctx.db.patch(existing._id, { authId: identity.subject });
      }
      return existing._id;
    }

    // If user doesn't exist, create a new one
    return await ctx.db.insert("users", {
      authId: identity.subject,
      email: identity.email ?? "",
      name: identity.name ?? "",
      createdAt: Date.now(),
      drinksCount: 0,
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

    await ctx.db.patch(user._id, {
      drinksCount: (user.drinksCount ?? 0) + 1,
    });
  },
});

//CREATE SUBSCRIPTION
export const createSubscription = mutation({
  args: {
    coffeeName: v.string(),
    // Tip: If you always start at 0, you don't need this in args
  },
  handler: async (ctx, { coffeeName }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Search by email to ensure we hit the Better Auth user
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      coffeeName,
      subscriptionId: Math.random().toString(36).slice(2),
      drinksCount: 0, // Reset to 0 for new sub
      subDate: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
