'use client';
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;
import React, { FC, useMemo, useEffect, useContext } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
  WalletDisconnectButton,
  WalletMultiButton,
  WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';
import { Buffer } from 'buffer';
import { DomainsOwnedProvider } from '../context/domainsOwned';
import DomainsOwnedContext from '../context/domainsOwned';
import { useRouter } from 'next/navigation';
import '@solana/wallet-adapter-react-ui/styles.css';

window.Buffer = Buffer;

export default function MyApp() {
  const network = WalletAdapterNetwork.Mainnet;
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [endpoint]);

  return (
    <DomainsOwnedProvider>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <Content endpoint={endpoint} />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </DomainsOwnedProvider>
  );
}

const Content = () => {
  const { connected } = useWallet();
  const { domainsOwned } = useContext(DomainsOwnedContext);
  const router = useRouter();

  useEffect(() => {
    if (connected && domainsOwned.length !== 0) {
      router.push('/domain-select');
    } else {
      router.push('/');
    }
  }, [connected]);

  return null;
};
