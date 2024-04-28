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
      <body className="dark">
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
