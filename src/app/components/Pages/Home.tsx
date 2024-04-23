"use client";
import Image from "next/image";
import { WalletConnect } from "../Wallet/WalletConnect";
import { HomePageCarousel } from "../Carousel/HomePageCarousel";
import { useWallet } from "@solana/wallet-adapter-react";
import { GoToProfileButton } from "../Buttons/GoToProfileButton";

const Home = () => {
  const { connected } = useWallet();
  return (
    <div className="flex-col flex gap-3 w-[1224px] overflow-hidden px-3 sm:px-0 mt-44 sm:mt-0">
      <div className="flex w-[1224px]">
        <div className="sm:w-1/2 space-y-10 z-50 w-full">
          <div className="sm:w-[600px] w-[351px]">
            <span className="font-azeret font-semibold sm:text-[104px] text-[64px] text-hero-section-text leading-none">
              Your Brand On Chain
            </span>
            <p className="font-medium text-base font-azeret text-hero-section-text sm:w-[505px] w-full">
              Upload all of your platform links using SNS links and share easily
              with friends. Your .sol domain now holds the key to sharing your
              brand across the web.
            </p>
          </div>
          {connected ? (
            <GoToProfileButton />
          ) : (
            <WalletConnect green={true} width={258} />
          )}
        </div>
        <div className="absolute inset-0 flex justify-center items-center -z-1 sm:mt-0 mt-[-300px]">
          <Image
            src="/phone-preview.svg"
            width={1152}
            height={820}
            alt="preview"
            objectFit="contain"
          />
        </div>
      </div>
      <div className="w-screen mt-10 z-50 hidden sm:inline-block">
        <HomePageCarousel />
      </div>
    </div>
  );
};

export default Home;
