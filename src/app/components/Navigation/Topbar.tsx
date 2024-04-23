"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WalletConnect } from "../Wallet/WalletConnect";

const Topbar = () => {
  return (
    <div className="bg-bg-main flex items-center justify-center w-screen md:h-[72px] h-[64px] pt-3 border-b border-b-topbar-border sm:border-0">
      <div className="flex items-center justify-between w-full md:w-[1224px] z-50 px-3 sm:px-0">
        <Link
          href="/"
          className="flex items-center justify-center sm:gap-4 gap-2"
        >
          <Image
            width={80}
            height={80}
            src="/white-logo.svg"
            className="w-5 h-6"
            alt="SNS Links Logo"
          />

          <span className="text-base items-center font-bold text-topbar-text sm:text-2xl">
            SNS Links
          </span>
        </Link>

        <div className="flex justify-center">
          <WalletConnect />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
