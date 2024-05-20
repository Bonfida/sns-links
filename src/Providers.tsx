"use client";
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT as string;
import React, { FC, useEffect, useMemo, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { SelectedDomainProvider } from "./context/selectedDomain";
import { ToastContextProvider } from "@bonfida/components";
import { ModalContextProvider } from "./context/modalContext";
import { ThemeProvider } from "next-themes";

type Props = {
  children?: React.ReactNode;
};

const queryClient = new QueryClient();

export const Providers: FC<Props> = ({ children }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [endpoint]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SelectedDomainProvider>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <ModalContextProvider>
                <ToastContextProvider>
                  <ThemeProvider
                    attribute="class"
                    enableSystem={false}
                    defaultTheme="dark"
                  >
                    {children}
                  </ThemeProvider>
                </ToastContextProvider>
              </ModalContextProvider>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </SelectedDomainProvider>
    </QueryClientProvider>
  );
};
