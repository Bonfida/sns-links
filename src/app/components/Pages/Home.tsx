"use client";
import Image from "next/image";
import { WalletConnect } from "../Wallet/WalletConnect";
import { HomePageCarousel } from "../Carousel/HomePageCarousel";
import { useWallet } from "@solana/wallet-adapter-react";
import { GoToProfileButton } from "../Buttons/GoToProfileButton";

export const Home = () => {
  const { connected } = useWallet();
  return (
    <div className="flex-col flex gap-3 w-[1224px] overflow-hidden px-3 sm:px-0 mt-44 sm:mt-[50px]">
      <div className="flex w-[1224px]">
        <div className="sm:w-1/2 space-y-8 z-10 w-full">
          <div className="sm:w-[600px] w-[351px]">
            <span className="font-azeret font-semibold sm:text-[104px] text-[64px] text-primary-text leading-none">
              Your Brand On Chain
            </span>
            <p className="font-medium text-base font-azeret text-primary-text sm:w-[505px] w-full">
              Upload all of your platform links using SNS and share them easily
              with friends. Use your .sol domain to build brands and connections
              across the web!
            </p>
          </div>
          {connected ? (
            <GoToProfileButton />
          ) : (
            <WalletConnect green={true} width={258} />
          )}
        </div>
        <div className="absolute inset-0 flex justify-center items-center -z-1 sm:mt-0 mb-[80px]">
          <Image
            src="/preview/phone-preview.svg"
            width={1440}
            height={1024}
            alt="preview"
            className=" w-[766px] h-[418px] md:w-[1440px] md:h-[895px] md:top-1/2 md:translate-y-[10%]"
          />
        </div>
      </div>
      <div className="w-screen mt-32 md:mt-20 z-50 hidden sm:inline-block">
        <HomePageCarousel />
      </div>
    </div>
  );
};
