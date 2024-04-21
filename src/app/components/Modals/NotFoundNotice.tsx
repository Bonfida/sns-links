"use client";
import Image from "next/image";
import ProfileOverview from "../ProfileOverview/ProfileOverview";

export const NotFoundNotice = () => {
  return (
    <div className="flex  items-center justify-center">
      <div className="bg-bds-dark-blues-DB900 items-start justify-start  w-1/2 flex flex-col gap-5 mt-5">
        <ProfileOverview />
        <h2 className="text-center text-white font-azeret">
          Looks like you don&apos;t have an SNS domain quite yet. How about we
          set you up with one now? Click below to explore all domains, or use
          our widget in the bottom right of your screen to register a domain
          directly from this app!
        </h2>
        <a href="https://www.sns.id/" target="_blank">
          <button className="px-3 py-2 font-bold text-base bg-gradient-to-r from-[#00F0FF] to-[#CBFF5E] rounded-lg font-azeret text-[#03021A]">
            <div className="flex gap-2 items-center">
              <Image src="/sns-global.svg" height={32} width={32} alt="" />
              <span> Purchase domain</span>
            </div>
          </button>
        </a>
      </div>
    </div>
  );
};
