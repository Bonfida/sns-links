"use client";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import Link from "next/link";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { useRouter } from "next/navigation";
import { WalletConnect } from "../Wallet/wallet-connect";

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
    <div className="flex items-center justify-center w-screen md:h-20 h-14 py-20 md:py-10 ">
      <div className="flex md:flex-row flex-col items-center md:justify-between justify-center w-full md:w-3/4 md:h-20 h-14">
        <Link href="/" className="flex items-center justify-center w-1/4">
          <Image
            width={80}
            height={80}
            src="/white-logo.svg"
            className="p-5"
            alt="SNS Links Logo"
          />

          <span className="text-xl items-center font-bold text-white md:text-2xl md:inline-block hidden">
            SNS Links
          </span>
        </Link>
        <NavigationMenu.Root className="flex justify-center items-center font-semibold  w-full flex-1">
          <NavigationMenu.Link
            className="flex items-center justify-center md:text-xl text-2xl text-white hover:cursor-pointer"
            onClick={handleProfileClick}
          >
            <Image
              src="/user.svg"
              width={45}
              height={45}
              alt="Profile"
              className=""
            />
          </NavigationMenu.Link>
        </NavigationMenu.Root>

        <div className="w-1/4 flex justify-center">
          <WalletConnect />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
