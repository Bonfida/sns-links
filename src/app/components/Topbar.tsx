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
import Widget from "@bonfida/sns-widget";

const Topbar = () => {
  const { connected } = useWallet();
  const { connection } = useConnection();
  const [isBuyingDomain, setIsBuyingDomain] = useState(false);

  const handleClick = () => {
    setIsBuyingDomain(true);
  };
  return (
    <div className="flex items-center justify-center w-full md:h-20 h-14">
      {isBuyingDomain && <Widget connection={connection} isDark={true} />}
      <div className="flex items-center justify-between w-full md:w-3/4 md:h-20 h-14">
        {/* <div className="flex items-center space-x-10"> */}
        <Link href="/" className="flex items-center justify-center">
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
        <NavigationMenu.Root className="flex items-center justify-center space-x-4">
          <NavigationMenu.Link
            className="text-xl font-semibold text-white "
            href="/profile"
          >
            Profile
          </NavigationMenu.Link>
          <NavigationMenu.Link
            className="text-xl font-semibold text-white"
            href="https://github.com/radix-ui"
          >
            Links
          </NavigationMenu.Link>
          <NavigationMenu.Link
            className="text-xl font-semibold text-white hover:cursor-pointer"
            onClick={handleClick}
          >
            Purchase
          </NavigationMenu.Link>
        </NavigationMenu.Root>
        {/* </div> */}

        <div>
          {connected ? <WalletDisconnectButton /> : <WalletMultiButton />}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
