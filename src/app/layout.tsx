import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SparkPicks — Handpicked Gear, Verified Savings",
  description: "Join the SparkPicks vanguard. Unlock exclusive drops, priority shipping, and inventory-only pricing on our tightest curations.",
  keywords: ["SparkPicks", "curated products", "gear", "premium", "deals"],
  openGraph: {
    title: "SparkPicks — Handpicked Gear, Verified Savings",
    description: "Curated exclusively for the SparkPicks vanguard.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
