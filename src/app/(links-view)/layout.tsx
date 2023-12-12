"use client";
import "../globals.css";
import { Wallet } from "@/Wallet";
import Footer from "../components/Footer";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-t to-[#03001A] from-[#000a1a]">
        <Wallet>{children}</Wallet>
        <Footer />
      </body>
    </html>
  );
}
