"use client";
import Image from "next/image";
import { WalletConnect } from "../Wallet/WalletConnect";
import { HomePageCarousel } from "../Carousel/HomePageCarousel";
import { useWallet } from "@solana/wallet-adapter-react";
import { GoToProfileButton } from "../Buttons/GoToProfileButton";

const Home = () => {
  const { connected } = useWallet();
  return (
    <div className="flex-col flex gap-3 w-[1224px]">
      <div className="flex w-[1224px]">
        <div className="w-1/2 space-y-10">
          <div className="w-[600px]">
            <span className="font-azeret font-semibold text-[104px] text-[#F8EFF9] leading-none">
              Your Brand On Chain
            </span>
            <p className="font-medium text-base font-azeret text-[#F8EFF9] w-[505px]">
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
        <div className="">
          {/* <Image
          width={1440}
          height={1040}
          alt="preview"
          src="/preview/product-shot.svg"
          className=""
        /> */}
        </div>
      </div>
      <div className="w-screen mt-10">
        <HomePageCarousel />
      </div>
    </div>
  );
};

export default Home;
