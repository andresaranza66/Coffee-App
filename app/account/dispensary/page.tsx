"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Coffee, Gift, CheckCircle } from "lucide-react";
import Header from "@/app/_components/Header";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client"; // Import auth

export default function DispensaryPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id; // This is a string

  // 1. Queries & Mutations from both files
  const coffees = useQuery(api.coffee.getMenu);
  const drinkStatus = useQuery(
    api.drinks.canDrinkToday,
    userId ? { userId } : "skip",
  );

  const orderFree = useMutation(api.drinks.consumeFreeDailyDrink);
  const buyPaid = useMutation(api.drinks.buyDrink);

  const [loadingId, setLoadingId] = useState<string | null>(null);

  // 2. The Logic: Decide which mutation to run
  const handleOrder = async (coffeeId: Id<"coffees">) => {
    if (!userId || !drinkStatus) {
      toast.error("Debes iniciar sesión para pedir café.");
      return;
    }

    try {
      setLoadingId(coffeeId);
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (drinkStatus.canDrink) {
        await orderFree({ userId, coffeeId });

        // Beautiful Success Toast for Free Coffee
        toast.success("¡Disfruta tu café!", {
          description: "Has reclamado tu beneficio gratuito de hoy. ✨",
        });
      } else {
        await buyPaid({ userId, coffeeId });

        // Find the coffee price to show in toast (optional)
        const coffee = coffees?.find((c) => c._id === coffeeId);

        toast.success("Pedido confirmado", {
          description: `Se ha procesado tu pago de $${coffee?.price}. ☕`,
        });
      }
    } catch (error: any) {
      console.error(error);
      toast.error("No se pudo procesar", {
        description: error.message || "Ocurrió un error inesperado.",
      });
    } finally {
      setLoadingId(null);
    }
  };

  if (!coffees || drinkStatus === undefined) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
        <p className="mt-4 text-amber-900 font-medium">Cargando menú...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto p-8">
        {/* Daily Status Banner */}
        <div className="mb-8 p-6 rounded-3xl bg-amber-50 border border-amber-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-amber-900">
              Tu beneficio diario
            </h2>
            <p className="text-amber-800/70">
              {drinkStatus.canDrink
                ? "Tienes un café gratis disponible para hoy."
                : "Ya usaste tu beneficio de hoy. ¡Vuelve mañana!"}
            </p>
          </div>
          {drinkStatus.canDrink ? (
            <Gift className="text-amber-600" />
          ) : (
            <CheckCircle className="text-green-600" />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coffees.map((coffee) => (
            <motion.div
              key={coffee._id}
              className="bg-white border border-amber-100 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-amber-50 rounded-2xl text-amber-700">
                  <Coffee size={24} />
                </div>
                <span className="text-sm font-bold bg-zinc-100 px-3 py-1 rounded-full">
                  {coffee.stock} unidades
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                    drinkStatus.canDrink
                      ? "bg-amber-600 text-white hover:bg-amber-400 hover:cursor-pointer"
                      : "bg-brown-primary text-white hover:bg-brown-secondary hover:cursor-pointer"
                  } disabled:opacity-50`}
                >
                  {loadingId === coffee._id ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : drinkStatus.canDrink ? (
                    <>Reclamar Gratis</>
                  ) : (
                    <>Comprar ahora</>
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
