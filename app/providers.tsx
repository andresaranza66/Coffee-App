"use client";

import { api } from "@/convex/_generated/api";
import { ConvexReactClient, ConvexProvider, useQuery } from "convex/react";
import { createContext, ReactNode, useContext } from "react";

/* ------------------------------------------------------------------ */
/* CONTEXT TYPE                                                       */
/* ------------------------------------------------------------------ */

type AppContextType = {
  isLoading: boolean;
  isAuthenticated: boolean;

  name: string | null;
  email: string | null;
  createdAt: number | null;

  coffeeName: string | null;
  drinksCount: number;
  subDate: Date | null;
};

/* ------------------------------------------------------------------ */
/* CONTEXT                                                            */
/* ------------------------------------------------------------------ */

const AppContext = createContext<AppContextType | undefined>(undefined);

/* ------------------------------------------------------------------ */
/* PROVIDER                                                           */
/* ------------------------------------------------------------------ */

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function AppDataLayer({ children }: { children: ReactNode }) {
  const user = useQuery(api.user.currentUser);

  const isLoading = user === undefined;
  const isAuthenticated = user !== null;

  return (
    <AppContext.Provider
      value={{
        isLoading,
        isAuthenticated,

        name: user?.name ?? null,
        email: user?.email ?? null,
        createdAt: user?.createdAt ?? null,

        coffeeName: user?.coffeeName ?? null,
        drinksCount: user?.drinksCount ?? 0,
        subDate: user?.subDate ? new Date(user.subDate) : null,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* ROOT PROVIDERS                                                     */
/* ------------------------------------------------------------------ */

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <AppDataLayer>{children}</AppDataLayer>
    </ConvexProvider>
  );
}

/* ------------------------------------------------------------------ */
/* HOOK                                                               */
/* ------------------------------------------------------------------ */

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside AppProviders");
  }
  return context;
}
