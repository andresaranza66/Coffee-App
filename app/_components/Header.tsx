"use client";
import Link from "next/link";
import { Coffee } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-brown-primary shadow-[0_4px_6px_-4px_rgba(0,0,0,1)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href={"/"}
          className="flex group text-2xl font-bold tracking-wide text-amber-400 transition-all duration-300 hover:text-amber-200"
        >
          <Coffee
            size={28}
            className="transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
          />
          <span className="relative transition-transform group-hover:translate-x-1">
            AromaCafetero
            <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-yellow-secundary transition-all duration-300 group-hover:w-full" />
          </span>
        </Link>

        <nav className="flex  items-center gap-8">
          <Link
            href={"/account"}
            className="text-sm font-medium text-amber-100 hover:text-amber-400 hover:scale-110 transition-transform"
          >
            My account
          </Link>
          <Link
            href={"/getCoffee"}
            className="text-sm font-medium text-amber-100 hover:text-amber-400 hover:scale-110 transition-transform"
          >
            Get Your coffee
          </Link>
        </nav>
      </div>
    </header>
  );
}
