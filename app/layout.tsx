import type { Metadata } from "next";
import Header from "@/app/_components/Header";
import "./globals.css";

export const metadata = {
  title: {
    template: "Coffee App",
    default: "Welcome / Best Coffee ",
  },
  description:
    "Luxurious coffee, made for everyone who loves coffee, and drink it every day ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
