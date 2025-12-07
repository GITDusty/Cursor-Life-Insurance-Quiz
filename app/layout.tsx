import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life Insurance Calculator 2025 - See Exactly How Much You Should Pay",
  description: "Calculate your life insurance needs and get instant quotes from top carriers. Most people overpay by 2-3x. Find out your rate in 2 minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

