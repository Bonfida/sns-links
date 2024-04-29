import "../globals.css";
import type { Metadata } from "next";
import { Providers } from "../../Providers";
import Topbar from "../components/Navigation/Topbar";
import Footer from "../components/Navigation/Footer";
import Widget from "@bonfida/sns-widget";
import "@bonfida/sns-widget/style.css";

export const metadata: Metadata = {
  title: {
    default: "SNS Links",
    //@ts-ignore
    template: `%s | SNS Links`,
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
      <body className="dark">
        <Providers>
          <Topbar />
          <Widget endpoint={process.env.NEXT_PUBLIC_ENDPOINT!} />
          {children}
        </Providers>
        <div className="hidden sm:inline-flex">
          <Footer />
        </div>
      </body>
    </html>
  );
}
