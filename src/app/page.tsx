'use client';
import * as solanaweb3 from '@solana/web3.js';
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;
import React, { FC, useMemo, useEffect, useState } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
  useConnection,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  SolletWalletAdapter,
  PhantomWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { Buffer } from 'buffer';
import '@solana/wallet-adapter-react-ui/styles.css';

window.Buffer = Buffer;

export default function Home() {
  const network = WalletAdapterNetwork.Mainnet;

  const wallets = useMemo(() => [new PhantomWalletAdapter()], [endpoint]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Content endpoint={endpoint} />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

const Content = () => {
  return <div></div>;
};
