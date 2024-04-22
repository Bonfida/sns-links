"use client";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import Link from "next/link";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { useRouter } from "next/navigation";
import { WalletConnect } from "../Wallet/WalletConnect";

const Topbar = () => {
  const { publicKey } = useWallet();
  const router = useRouter();

  const handleProfileClick = () => {
    if (publicKey) {
      router.push(`/profile/${publicKey}`);
    } else {
      router.push(`/profile`);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen md:h-[72px] h-14 pt-3 ">
      <div className="flex md:flex-row flex-col items-center md:justify-between justify-center w-full md:w-[1224px] md:h-12 h-10 z-50">
        <Link href="/" className="flex items-center justify-center gap-4">
          <Image
            width={80}
            height={80}
            src="/white-logo.svg"
            className="w-5 h-6"
            alt="SNS Links Logo"
          />

          <span className="text-xl items-center font-bold text-white md:text-2xl md:inline-block hidden">
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
