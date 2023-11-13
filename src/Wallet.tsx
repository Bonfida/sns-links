"use client";
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT as string;
import React, { FC, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { Buffer } from "buffer";
import "@solana/wallet-adapter-react-ui/styles.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { SelectedDomainProvider } from "./context/selectedDomain";
import { ToastContextProvider } from "@bonfida/components";

window.Buffer = Buffer;

type Props = {
  children?: React.ReactNode;
};
const queryClient = new QueryClient();

export const Wallet: FC<Props> = ({ children }) => {
  const network = WalletAdapterNetwork.Mainnet;
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
