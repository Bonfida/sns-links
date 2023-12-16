import "../globals.css";
import type { Metadata } from "next";
import { Wallet } from "../../Wallet";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import Widget from "@bonfida/sns-widget";
import "@bonfida/sns-widget/style.css";

export const metadata: Metadata = {
  title: {
    default: "SNS Links",
    //@ts-ignore
    template: "%s | SNS Links",
  },
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
          <Widget endpoint={process.env.NEXT_PUBLIC_ENDPOINT!} />
          {children}
        </Wallet>
        <Footer />
      </body>
    </html>
  );
}
