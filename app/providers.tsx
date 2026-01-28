"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type AppContextType = {
  coffeeName: string;
  setCoffeeName: React.Dispatch<React.SetStateAction<string>>;
  drinksCount: number;
  setDrinksCount: React.Dispatch<React.SetStateAction<number>>;
  subDate: Date | null;
  setSubDate: React.Dispatch<React.SetStateAction<Date | null>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = {
  children: ReactNode;
};

export function Appproviders({ children }: AppProviderProps) {
  const [coffeeName, setCoffeeName] = useState<string>("AromaCafetero");

  const [drinksCount, setDrinksCount] = useState<number>(0);
  const [subDate, setSubDate] = useState<Date | null>(
    new Date("January 13, 2026"),
  );

  const handleMoreCoffee = () => {
    setDrinksCount((prev) => prev + 1);
  };

  return (
    <AppContext.Provider
      value={{
        coffeeName,
        setCoffeeName,
        drinksCount,
        setDrinksCount,
        subDate,
        setSubDate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("UseApp must be inside and AppProvider");
  }
  return context;
}
