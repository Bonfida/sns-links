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
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Buffer } from 'buffer';
import LoginPage from '../app/login-page/page.tsx';
import Header from '../components/Header.tsx';
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
  const [domainsOwned, setDomainsOwned] = useState([]);
  return (
    <div className="w-screen h-screen flex justify-center">
      <div className="w-3/4 h-screen flex flex-col items-center justify-center space-y-5">
        <LoginPage
          domainsOwned={domainsOwned}
          setDomainsOwned={setDomainsOwned}
        />
      </div>
    </div>
  );
};
