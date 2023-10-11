'use client';
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

const Header = ({ loggedIn }) => {
  const { connected } = useWallet();
  console.log(connected);
  return (
    <div className="w-full flex flex-col items-center space-y-20">
      <div className="md:h-36 h-20 w-3/4 flex flex-row items-center justify-center md:justify-start">
        <img src="./white-logo.svg" className="p-5"></img>
        <h1 className="text-white md:text-2xl text-lg font-bold">SNS Links</h1>
        {loggedIn ? <WalletDisconnectButton /> : null}
      </div>
    </div>
  );
};

export default Header;
