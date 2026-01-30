"use client";
import { useApp } from "../providers";
import Header from "../_components/Header";
import { formatCamelName } from "../lib/formateCamelName";
import { CoffeeIcon } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const Page = () => {
  const { subscriptions, isLoading, userId } = useApp();

  const drinkCoffee = useMutation(api.user.drinkCoffee);

  const handleDrinkCoffee = async () => {
    await drinkCoffee({ userId });
  };

  return (
    <main>
      <Header />
      <section className="bg-amber-50 w-full p-4 h-screen flex gap-2 flex-col">
        <h2 className="text-xl font-bold text-amber-900">
          Subscription Details
        </h2>
        <ul
          key={userId}
          className="bg-white p-4 rounded-lg shadow flex flex-col gap-2"
        >
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            subscriptions.map((e) => {
              return (
                <div key={e.userId} className="mb-4 border p-4 rounded-2xl">
                  <li
                    key={e.userId}
                    className="mb-2 font-bold bg-amber-50 rounded-2xl"
                  >
                    {formatCamelName(e.coffeeName)}
                  </li>
                  <li key={e.drinksCount} className="mb-2">
                    {e.drinksCount}
                  </li>
                  <li key={e.subDate} className="mb-2">
                    Joined:{" "}
                    {e.subDate
                      ? new Date(e.subDate).toLocaleDateString()
                      : "N/A"}
                  </li>
                  <li key={e.coffeeName} className="mb-2">
                    {e.email}
                  </li>
                </div>
              );
            })
          )}
        </ul>
        <div className="bg-white  h-16 flex w-1/3 ">
          <button
            onClick={handleDrinkCoffee}
            className="flex items-center gap-2 w-full hover:shadow-2xl shadow z-4 h-full transition-all  justify-center border rounded-lg border-brand-brown-tertiary hover:cursor-pointer bg-brand-brown-secondary text-white font-bold"
          >
            <CoffeeIcon /> Drink Coffee
          </button>
        </div>
      </section>
    </main>
  );
};

export default Page;
