import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { generateSubscriptionId } from "./utils";

/* ------------------------------------------------------------------ */
/* CURRENT AUTHENTICATED USER                                         */
/* ------------------------------------------------------------------ */

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) return null;

    const user = await ctx.db.get(authUserId);
    if (!user) return null;

    return {
      id: user._id,
      name: user.name ?? null,
      email: user.email,
      createdAt: user.createdAt ?? null,

      coffeeName: user.coffeeName ?? null,
      subscriptionId: user.subscriptionId ?? null,
      drinksCount: user.drinksCount ?? 0,
      subDate: user.subDate ?? null,
    };
  },
});

/* ------------------------------------------------------------------ */
/* CREATE SUBSCRIPTION                                                 */
/* ------------------------------------------------------------------ */

export const createSubscription = mutation({
  args: {
    coffeeName: v.string(),
  },
  handler: async (ctx, { coffeeName }) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) throw new Error("Unauthorized");

    const user = await ctx.db.get(authUserId);
    if (!user) throw new Error("User not found");

    if (user.subscriptionId) {
      throw new Error("User already has a subscription");
    }

    const subscriptionId = generateSubscriptionId(coffeeName);

    await ctx.db.patch(authUserId, {
      coffeeName,
      subscriptionId,
      drinksCount: 0,
      subDate: Date.now(), // ✅ number
      updatedAt: Date.now(),
    });

    return subscriptionId;
  },
});

/* ------------------------------------------------------------------ */
/* DRINK COFFEE                                                        */
/* ------------------------------------------------------------------ */

export const drinkCoffee = mutation({
  args: {},
  handler: async (ctx) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) throw new Error("Unauthorized");

    const user = await ctx.db.get(authUserId);
    if (!user) throw new Error("User not found");

    if (!user.subscriptionId) {
      throw new Error("No active subscription");
    }

    await ctx.db.patch(authUserId, {
      drinksCount: (user.drinksCount ?? 0) + 1,
      updatedAt: Date.now(),
    });
  },
});
