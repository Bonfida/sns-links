"use client";
import "../globals.css";
import { Providers } from "@/Providers";
import Footer from "../components/Navigation/Footer";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-t to-[#03001A] from-[#000a1a]">
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
