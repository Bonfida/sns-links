'use client';
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;
import React, { FC, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { Buffer } from 'buffer';
import { DomainsOwnedProvider } from './context/domainsOwned';
import '@solana/wallet-adapter-react-ui/styles.css';

window.Buffer = Buffer;

type Props = {
  children?: React.ReactNode;
};

export const Wallet: FC<Props> = ({ children }) => {
  const network = WalletAdapterNetwork.Mainnet;
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [endpoint]);

  return (
    <DomainsOwnedProvider>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </DomainsOwnedProvider>
  );
};
