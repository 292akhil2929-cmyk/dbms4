import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blunder",
  description: "A reverse dating experiment that compares stated preferences to actual engagement."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
