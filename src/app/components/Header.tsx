"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";

const Header = () => {
  const { connected } = useWallet();
  return (
    <div className="w-full flex items-center justify-center">
      <div className="md:h-36 h-20 flex md:flex-row flex-col items-center md:justify-between md:w-3/4 w-full space-y-3 md:space-y-0">
        <div className="flex flex-row items-center pr-9">
          <img src="./white-logo.svg" className="p-5"></img>
          <h1 className="text-white md:text-2xl text-lg font-bold">
            SNS Links
          </h1>
        </div>
        {connected ? <WalletDisconnectButton /> : null}
      </div>
    </div>
  );
};

export default Header;
