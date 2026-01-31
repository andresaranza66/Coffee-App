import "@/app/_styles/globals.css";
import { AppProviders } from "./providers";
import { ConvexClientProvider } from "./_components/ConvexClientProvider";

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
        <AppProviders>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </AppProviders>
      </body>
    </html>
  );
}
