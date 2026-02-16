"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { motion } from "framer-motion";
import { Coffee, ShoppingCart } from "lucide-react";
import Header from "@/app/_components/Header";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

export default function DispensaryPage() {
  // 1. Grab the live data
  const coffees = useQuery(api.coffee.getMenu);
  const orderCoffee = useMutation(api.coffee.orderCoffee);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const handleOrder = async (coffeeId: Id<"coffees">) => {
    try {
      setLoadingId(coffeeId);

      // Simulación de preparación ☕
      await new Promise((resolve) => setTimeout(resolve, 1500));

      await orderCoffee({ coffeeId });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId(null);
    }
  };

  // 2. This "if" statement clears the red lines!
  // It tells TypeScript: "If coffees is null or empty, don't try to map it yet."
  if (!coffees) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
        <p className="mt-4 text-amber-900 font-medium">Grinding beans...</p>
      </div>
    );
  }

  // Now, down here, 'coffees' is guaranteed to exist!

  // 2. Show a loading state while the data travels from the cloud
  if (coffees === undefined) {
    return (
      <div className="flex justify-center p-20 text-amber-900">
        Grinding beans...
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-amber-900 mb-8">
          The Coffee Dispensary
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coffees.map((coffee) => (
            <motion.div
              key={coffee._id}
              className="bg-white border border-amber-100 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-amber-50 rounded-2xl text-amber-700 group-hover:bg-amber-700 group-hover:text-white transition-all group-hover:cursor-pointer">
                  <Coffee size={24} />
                </div>
                <span className="text-sm font-bold bg-zinc-100 px-3 py-1 rounded-full">
                  {coffee.stock} left
                </span>
              </div>

              <h3 className="text-xl font-bold text-zinc-800">{coffee.name}</h3>
              <p className="text-zinc-500 text-sm mt-2 mb-4">
                {coffee.description}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <span className="text-2xl font-black text-amber-900">
                  ${coffee.price}
                </span>

                <button
                  onClick={() => handleOrder(coffee._id)}
                  disabled={coffee.stock === 0 || loadingId === coffee._id}
                  className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-xl hover:bg-amber-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingId === coffee._id ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      Order
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
