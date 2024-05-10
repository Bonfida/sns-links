"use client";
import Image from "next/image";
import { WalletConnect } from "../Wallet/WalletConnect";
import { HomePageCarousel } from "../Carousel/HomePageCarousel";
import { useWallet } from "@solana/wallet-adapter-react";
import { GoToProfileButton } from "../Buttons/GoToProfileButton";

export const Home = () => {
  const { connected } = useWallet();
  return (
    <div className="flex-col flex gap-3 w-[1224px] overflow-hidden px-3 sm:px-0 mt-36 sm:mt-[50px]">
      <div className="flex w-[1224px]">
        <div className="sm:w-1/2 space-y-8 z-10 w-full">
          <div className="sm:w-[600px] w-[351px]">
            <span className="font-azeret font-semibold md:text-[104px] text-[64px] text-primary-text leading-none hidden lg:inline-block">
              Your Brand On Chain
            </span>
            <div className="flex flex-col font-azeret font-semibold md:text-[104px] text-[64px] text-primary-text leading-none lg:hidden">
              <span>Your</span>
              <span>Brand</span>
              <span>On Chain</span>
            </div>
            <p className="font-medium text-base font-azeret text-primary-text lg:w-[505px] md:w-[435px] sm:w-[350px] w-full">
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
        <div className="absolute flex justify-center items-center w-[190px] h-[135px] sm:w-[220px] lg:w-[365px] lg:h-[260px] ml-40 lg:ml-[700px] lg:mt-[247px] sm:ml-96 sm:mt-32 md:ml-[525px] md:mt-40 md:w-[240px] xl:w-[410px] xl:mt-[295px]">
          <Image
            src="/preview/phone-preview.png"
            width={1440}
            height={1024}
            alt="preview"
            className=""
          />
        </div>
      </div>
      <div className="w-screen mt-32 md:mt-20 xl:mt-[130px] z-50 hidden sm:inline-block">
        <HomePageCarousel />
      </div>
    </div>
  );
};
