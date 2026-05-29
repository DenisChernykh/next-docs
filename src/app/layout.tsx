import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Aggregator Component Library",
  description: "Blocks and foundation components from the aggregator templates.",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
