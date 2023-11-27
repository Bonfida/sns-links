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
    <div className="flex items-center justify-center w-full md:h-20 h-14 ">
      <div className="flex flex-col items-center w-full mt-2 space-y-3 md:h-20 h-14 md:flex-row md:justify-between md:w-3/4 md:space-y-0">
        <Link href="/" className="flex flex-row items-center pr-9">
          <Image
            width={80}
            height={80}
            src="/white-logo.svg"
            className="p-5"
            alt=""
          />
          <span className="text-lg font-bold text-white md:text-2xl">
            SNS Links
          </span>
        </Link>
        {connected ? <WalletDisconnectButton /> : <WalletMultiButton />}
      </div>
    </div>
  );
};

export default Topbar;
