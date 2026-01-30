import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { generateSubscriptionId } from "./utils";

// ...existing code...
export const createSubscription = mutation({
  args: {
    coffeeName: v.string(),
    email: v.string(),
  },
  handler: async (ctx, { coffeeName, email }) => {
    // Prevent duplicate subscriptions
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      throw new Error("Subscription already exists for this email");
    }

    const userId = crypto.randomUUID();
    const subscriptionId = generateSubscriptionId(coffeeName);

    return await ctx.db.insert("users", {
      userId,
      coffeeName,
      email,
      subscriptionId,
      drinksCount: 0,
      subDate: new Date().toISOString(),
    });
  },
});
//Query to get user by Id

export const getUser = query({
  args: { userId: v.string() }, // Pass the ID from the frontend
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
  },
});

//Getting the info dinamically with useQuery
export const getInitialUser = query({
  args: {},
  handler: async (ctx) => {
    // This fetches the very first user in your database
    const user = await ctx.db.query("users").first();
    return user;
  },
});

export const getAllSubscriptions = query({
  args: {},
  handler: async (ctx) => {
    // .collect() gets every single record in the table as an array
    return await ctx.db.query("users").collect();
  },
});

// Mutation For drinking coffee from the ui mutate the convex
export const drinkCoffee = mutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      drinksCount: user.drinksCount + 1,
    });
  },
});
