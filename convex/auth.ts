import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import type { GenericCtx } from "@convex-dev/better-auth/utils";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import schema from "./betterAuth/schema";
import authConfig from "./auth.config";
import { query } from "./_generated/server";

/**
 * REQUIRED EXPORT #1
 */
export const authComponent = createClient<DataModel, typeof schema>(
  components.betterAuth,
  {
    local: { schema },
    verbose: true,
  },
);

/**
 * REQUIRED EXPORT #2
 */
export const createAuthOptions = (ctx: GenericCtx<DataModel>) => ({
  appName: "My App",
  baseURL: process.env.NEXT_PUBLIC_SITE_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: authComponent.adapter(ctx),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [convex({ authConfig })],
});

console.log(process.env.NEXT_PUBLIC_SITE_URL, "Check point");

/**
 * REQUIRED EXPORT #3
 */
export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth(createAuthOptions(ctx));

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return identity;
  },
});
