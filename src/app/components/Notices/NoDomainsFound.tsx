"use client";
import Image from "next/image";
import ProfileOverview from "../ProfileOverview/ProfileOverview";
import { BuyADomainButton } from "../Buttons/BuyADomain";

export const NoDomainsFound = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="sm:items-start items-center sm:justify-start justify-center sm:w-1/2 w-full flex flex-col gap-5 mt-5">
        <ProfileOverview />
        <span className="text-start  text-white font-azeret sm:px-0 px-3">
          Looks like you don&apos;t have an SNS domain quite yet. Click the
          button below to explore all domains, or use our widget in the bottom
          right of your screen to register a domain directly from this app!
        </span>
        <BuyADomainButton />
      </div>
    </div>
  );
};
