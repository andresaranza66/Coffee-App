"use client";

import { api } from "@/convex/_generated/api";
import { ConvexReactClient, ConvexProvider, useQuery } from "convex/react";
import { createContext, ReactNode, useContext } from "react";

type AppContextType = {
  coffeeName: string;
  drinksCount: number;
  subDate: Date | null;
  isLoading: boolean;
  userId: string;
  subscriptions: any[];
};

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = {
  children: ReactNode;
};

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function AppDataLayer({ children }: AppProviderProps) {
  const subscriptions = useQuery(api.user.getAllSubscriptions);
  const isLoading = subscriptions === undefined;
  // Static user ID for demonstration
  const activeUser = subscriptions?.[0];

  const drinksCount = activeUser?.drinksCount ?? 0;
  const userId = activeUser?.userId ?? "";
  const coffeeName = activeUser?.coffeeName ?? "No Active Subscription";

  const safeSubscriptions = subscriptions ?? [];

  return (
    <AppContext.Provider
      value={{
        drinksCount,
        subDate: activeUser?.subDate ? new Date(activeUser.subDate) : null,
        isLoading,
        subscriptions: safeSubscriptions,
        userId,
        coffeeName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <AppDataLayer>{children}</AppDataLayer>
    </ConvexProvider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("UseApp must be inside the AppProvider");
  }
  return context;
}
