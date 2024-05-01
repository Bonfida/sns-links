"use client";
import Image from "next/image";
import Link from "next/link";
import { WalletConnect } from "../Wallet/WalletConnect";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import { useContext } from "react";
import ThemeContext from "@/context/theme";

const Topbar = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div className="bg-primary-bg flex items-center justify-center w-screen md:h-[72px] h-[64px] pt-3 border-b border-b-topbar-border sm:border-0">
      <div className="flex items-center justify-between w-full md:w-[1224px] z-50 px-3 sm:px-0">
        <Link
          href="/"
          className="flex items-center justify-center sm:gap-4 gap-2  w-[149px]"
        >
          <Image
            width={80}
            height={80}
            src={
              theme === "dark"
                ? "/bonfida/bonfida-white.svg"
                : "/bonfida/bonfida-black.svg"
            }
            className="w-5 h-6"
            alt="SNS Links Logo"
          />

          <span className="text-base items-center font-bold text-primary-text sm:text-2xl">
            SNS Links
          </span>
        </Link>

        <div className="flex justify-center gap-6">
          <div className="hidden sm:inline-flex ">
            <ThemeToggle />
          </div>
          <WalletConnect />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
