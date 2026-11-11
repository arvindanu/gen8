
import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { WishlistProvider } from "@/components/wishlist/wishlist-provider";

export const metadata: Metadata = {
  title: "GEN8 — Discover. Explore. Play.",
  description: "Discover your next gaming obsession with GEN8.",
  applicationName: "GEN8",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <WishlistProvider>
          <AppShell>{children}</AppShell>
        </WishlistProvider>
      </body>
    </html>
  );
}
