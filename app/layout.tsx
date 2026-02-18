import "@/app/_styles/globals.css";
import { AppProviders } from "./providers";
import { ConvexClientProvider } from "./_components/ConvexClientProvider";
import { Toaster } from "sonner";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>
          <AppProviders>
            {children}
            <Toaster position="top-right" richColors />
          </AppProviders>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
