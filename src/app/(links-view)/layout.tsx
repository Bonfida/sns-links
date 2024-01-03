"use client";
import "../globals.css";
import { Wallet } from "@/Wallet";
import Footer from "../components/Navigation/Footer";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-t to-[#176cf4] from-[#000a1a]">
        <Wallet>{children}</Wallet>
        <Footer />
      </body>
    </html>
  );
}
