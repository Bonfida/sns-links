"use client";
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT as string;
import React, { FC, useMemo } from "react";
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

type Props = {
  children?: React.ReactNode;
};
const queryClient = new QueryClient();

export const Wallet: FC<Props> = ({ children }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [endpoint]);

  return (
    <QueryClientProvider client={queryClient}>
      <SelectedDomainProvider>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <ToastContextProvider>{children}</ToastContextProvider>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </SelectedDomainProvider>
    </QueryClientProvider>
  );
};
