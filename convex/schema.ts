import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    // Better Auth Fields
    name: v.optional(v.string()),
    emailVerified: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),

    // Your existing fields
    email: v.string(),
    userId: v.optional(v.string()),
    coffeeName: v.optional(v.string()),
    subscriptionId: v.optional(v.string()),
    drinksCount: v.number(),
    subDate: v.optional(v.string()),
    image: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_userId", ["userId"]), // Re-adding this index to fix your errors

  // Keep the other tables (sessions, accounts, verifications) exactly as they were
  sessions: defineTable({
    userId: v.string(),
    token: v.string(),
    expiresAt: v.number(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_token", ["token"]),

  accounts: defineTable({
    userId: v.string(),
    accountId: v.string(),
    providerId: v.string(),
    accessToken: v.optional(v.string()),
    refreshToken: v.optional(v.string()),
    idToken: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    password: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  verifications: defineTable({
    identifier: v.string(),
    value: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
});
