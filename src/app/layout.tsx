import "./globals.css";
import type { Metadata } from "next";
import { Wallet } from "../Wallet";
import Topbar from "./components/Topbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "SNS Links",
  description: "All your web3 links under one roof",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-t to-[#03001A] from-[#000a1a]">
        <Wallet>
          <Topbar />
          {children}
        </Wallet>
        <Footer />
      </body>
    </html>
  );
}
