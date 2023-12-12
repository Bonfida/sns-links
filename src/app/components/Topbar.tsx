"use client";
import { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import Link from "next/link";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import classNames from "classnames";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import PurchaseModal from "./PurchaseModal";

const Topbar = () => {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  const [isBuyingDomain, setIsBuyingDomain] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const handlePurchaseClick = () => {
    router.push(`/purchase`);
  };

  const handleProfileClick = () => {
    if (publicKey) {
      router.push(`/profile/${publicKey}`);
    } else {
      router.push(`/profile`);
    }
  };

  // fixes hydration issue caused by SSR of the WalletButton(s)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex items-center justify-center w-screen md:h-20 h-14 py-20 md:py-10 ">
      <div className="flex md:flex-row flex-col items-center md:justify-between justify-center w-full md:w-3/4 md:h-20 h-14">
        <Link href="/" className="flex items-center justify-center md:w-1/4">
          <Image
            width={80}
            height={80}
            src="/white-logo.svg"
            className="p-2"
            alt="SNS Links Logo"
          />

          <span className="text-xl font-bold text-white md:text-2xl md:inline-block hidden">
            SNS Links
          </span>
        </Link>
        <NavigationMenu.Root className="flex justify-center md:w-1/2 font-semibold w-full">
          <NavigationMenu.Link
            className="md:text-xl text-2xl text-white hover:cursor-pointer font-azeret"
            onClick={handleProfileClick}
          >
            Profile
          </NavigationMenu.Link>
        </NavigationMenu.Root>

        <div className="md:w-1/4  ">
          {connected && publicKey ? (
            <WalletDisconnectButton className="wallet-button" />
          ) : (
            <WalletMultiButton className="wallet-button" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
