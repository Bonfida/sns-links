"use client";
import { useState } from "react";
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
  return (
    <div className="flex items-center justify-center w-screen md:h-20 h-14">
      <div className="flex items-center justify-between w-full md:w-3/4 md:h-20 h-14">
        {/* <div className="flex items-center space-x-10"> */}
        <Link href="/" className="flex items-center justify-center w-1/4">
          <Image
            width={80}
            height={80}
            src="/white-logo.svg"
            className="p-5"
            alt="SNS Links Logo"
          />
          <span className="text-lg font-bold text-white md:text-2xl">
            SNS Links
          </span>
        </Link>
        <NavigationMenu.Root className="flex justify-center w-1/2 pr-6 font-semibold">
          <NavigationMenu.Link
            className="text-xl text-white hover:cursor-pointer font-azeret"
            onClick={handleProfileClick}
          >
            Profile
          </NavigationMenu.Link>
          {/* <NavigationMenu.Link
            className="text-2xl font-semibold text-white"
            href="https://github.com/radix-ui"
          >
            Links
          </NavigationMenu.Link> */}
          {/* <NavigationMenu.Link
            className="text-xl text-white hover:cursor-pointer font-azeret"
            onClick={handlePurchaseClick}
          >
            Purchase
          </NavigationMenu.Link> */}
        </NavigationMenu.Root>
        {/* </div> */}

        <div className="w-1/4">
          {connected ? <WalletDisconnectButton /> : <WalletMultiButton />}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
