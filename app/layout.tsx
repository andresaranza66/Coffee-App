import "@/app/_styles/globals.css";
import { Appproviders } from "./providers";
import Footer from "./_components/Footer";

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
      <body className="antialiased flex flex-col min-h-screen">
        <Appproviders>{children}</Appproviders>
      </body>
    </html>
  );
}
