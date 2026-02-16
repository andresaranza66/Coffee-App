import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const seedCoffees = mutation({
  args: {},
  handler: async (ctx) => {
    const coffees = [
      {
        name: "Americano",
        price: 3,
        stock: 100,
        description: "Classic americano coffee",
      },
      {
        name: "Doble Americano",
        price: 4,
        stock: 100,
        description: "Double shot americano",
      },
      {
        name: "Latte",
        price: 4.5,
        stock: 100,
        description: "Espresso with milk",
      },
      {
        name: "Capuccino",
        price: 4.5,
        stock: 100,
        description: "Espresso with steamed milk foam",
      },
      {
        name: "Regular Coffee",
        price: 2.5,
        stock: 100,
        description: "House brewed coffee",
      },
      {
        name: "Seasonal Special",
        price: 5,
        stock: 100,
        description: "Limited seasonal coffee",
      },
    ];

    for (const coffee of coffees) {
      console.log(coffee);
      await ctx.db.insert("coffees", coffee);
    }
  },
});

// To get to use the info on my app
export const getMenu = query({
  args: {},
  handler: async (ctx) => {
    // This fetches every single item in the "coffees" table
    return await ctx.db.query("coffees").collect();
  },
});

// This line is going to be for the part that peoople mutate the state of the
export const orderCoffee = mutation({
  args: {
    coffeeId: v.id("coffees"),
  },
  handler: async (ctx, args) => {
    const coffee = await ctx.db.get(args.coffeeId);

    if (!coffee) {
      throw new Error("Coffee not found");
    }

    if (coffee.stock <= 0) {
      throw new Error("Out of stock");
    }

    await ctx.db.patch(args.coffeeId, {
      stock: coffee.stock - 1,
    });

    return { success: true };
  },
});
