"use client";
import Image from "next/image";
import { WalletConnect } from "../Wallet/WalletConnect";
import { HomePageCarousel } from "../Carousel/HomePageCarousel";
import { useWallet } from "@solana/wallet-adapter-react";
import { GoToProfileButton } from "../Buttons/GoToProfileButton";

export const Home = () => {
  const { connected } = useWallet();

  return (
    <div className="flex-col flex gap-3  w-[1224px] overflow-hidden px-3 sm:px-0 sm:mt-[50px] relative mb-10 sm:mb-0">
      <div className="flex w-[1224px]">
        <div className="w-1/2 space-y-8 z-10 relative">
          <div className="sm:w-full w-[330px] mt-44 sm:mt-0">
            <span className="font-azeret font-semibold md:text-[104px] text-[64px] text-primary-text leading-none hidden lg:inline-block">
              Your Brand On Chain
            </span>
            <div className="flex flex-col font-azeret font-semibold md:text-[104px] text-[64px] text-primary-text leading-none lg:hidden">
              <span>Your</span>
              <span>Brand</span>
              <span>On Chain</span>
            </div>
            <div className="blur-overlay sm:hidden" />
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
        <div className="absolute md:w-1/2 sm:w-full -right-[110px] lg:-top-5  md:-top-18 sm:-top-[105px] bottom-12 sm:-right-64 lg:-right-28 md:-right-20 -top-44">
          <div className="transform scale-50 sm:scale-75 2xl:scale-100 xl:scale-95 lg:scale-90 h-[800px]">
            <Image
              width={406}
              height={289}
              src="/preview/phone-preview.png"
              alt="preview"
            />
          </div>
        </div>
      </div>
      <div className="absolute w-screen  hidden sm:inline-block sm:bottom-[30px] lg:bottom-[30px] xl:bottom-[50px] md:bottom-0">
        <HomePageCarousel />
      </div>
    </div>
  );
};
