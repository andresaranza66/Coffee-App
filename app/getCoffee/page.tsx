"use client";
import { useState } from "react";
import type { ComponentType } from "react";
import Header from "../_components/Header";
import { useApp } from "../providers";

const HeaderComponent = Header as ComponentType<{ drinks: number }>;

const Page = () => {
  const { drinksCount, setDrinksCount } = useApp();
  return (
    <main>
      <HeaderComponent drinks={drinksCount} />
      <section className="bg-amber-50 w-full p-4 h-screen flex gap-2 flex-col">
        <h1>Get Your Coffee</h1>
        <button
          className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition-colors cursor-pointer"
          onClick={() => setDrinksCount(drinksCount + 1)}
        >
          Get Coffee +
        </button>
        <button
          className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition-colors cursor-pointer"
          onClick={() => setDrinksCount(drinksCount + 1)}
        >
          Less Coffee -
        </button>
      </section>
    </main>
  );
};

export default Page;
