import "../globals.css";
import { Providers } from "@/Providers";
import Footer from "../components/Navigation/Footer";
import Topbar from "../components/Navigation/Topbar";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Topbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
