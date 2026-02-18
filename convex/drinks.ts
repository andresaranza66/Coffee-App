import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const consumeDrink = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split("T")[0];

    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    if (user.lastDrinkDate === today) {
      throw new Error("Daily drink already used");
    }

    await ctx.db.patch(args.userId, {
      lastDrinkDate: today,
    });

    return { success: true };
  },
});

export const canDrinkToday = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    const today = new Date().toISOString().split("T")[0];

    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", userId))
      .unique();
    if (!user) return { canDrink: false };

    const canDrink = user.lastDrinkDate !== today;

    return {
      canDrink,
      lastDrinkDate: user.lastDrinkDate ?? null,
    };
  },
});

// This is the file where the user would be accessing to the daily free coffee.
export const consumeFreeDailyDrink = mutation({
  args: {
    userId: v.string(),
    coffeeId: v.id("coffees"),
  },

  handler: async (ctx, { userId, coffeeId }) => {
    console.log("Attempting order for user:", userId);
    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", userId))
      .unique();
    if (!user) throw new Error("User not found");

    const today = new Date().toISOString().split("T")[0];

    if (user.lastDrinkDate === today) {
      throw new Error("Daily free drink already used");
    }

    // registrar consumo
    await ctx.db.insert("orders", {
      userId: userId,
      coffeeId,
      type: "free",
      createdAt: Date.now(),
    });

    await ctx.db.patch(user._id, {
      lastDrinkDate: today,
    });
  },
});
//Comprar el drink the times the user wants.
export const buyDrink = mutation({
  args: {
    userId: v.string(),
    coffeeId: v.id("coffees"),
  },
  handler: async (ctx, { userId, coffeeId }) => {
    await ctx.db.insert("orders", {
      userId: userId,
      coffeeId,
      type: "paid",
      createdAt: Date.now(),
    });
  },
});
