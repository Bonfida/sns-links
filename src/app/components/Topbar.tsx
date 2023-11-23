"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import Link from "next/link";

const Topbar = () => {
  const { connected } = useWallet();
  return (
    <div className="w-full md:h-20 h-14 flex items-center justify-center ">
      <div className="md:h-20 h-14 flex md:flex-row flex-col items-center md:justify-between md:w-3/4 w-full space-y-3 md:space-y-0 mt-2">
        <Link href="/" className="flex flex-row items-center pr-9">
          <Image
            width={80}
            height={80}
            src="/white-logo.svg"
            className="p-5"
            alt=""
          />
          <span className="text-white md:text-2xl text-lg font-bold">
            SNS Links
          </span>
        </Link>
        {connected ? <WalletDisconnectButton /> : <WalletMultiButton />}
      </div>
    </div>
  );
};

export default Topbar;
