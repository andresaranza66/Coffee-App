import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    coffeeName: v.string(),
    email: v.string(),
    subscriptionId: v.string(),
    drinksCount: v.number(),
    subDate: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"])
    .index("by_subscriptionId", ["subscriptionId"]),
});
