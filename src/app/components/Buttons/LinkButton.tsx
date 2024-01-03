import Link from "next/link";
import { useState, useEffect } from "react";
import {
  verifyRightOfAssociation,
  GUARDIANS,
  Record,
} from "@bonfida/spl-name-service";
import { Connection } from "@solana/web3.js";
import { useFetchVerifyROA } from "@/hooks/useVerifyROA";
import Image from "next/image";
import Badge from "../Badges/Tooltip";
import { handleLink, copyItems } from "@/utils/links/handle-click";

const LinkButton = ({
  name,
  value,
  domain,
  connection,
}: {
  name: string;
  value: string;
  domain: string;
  connection: Connection;
}) => {
  const [showCopyConfirmation, setShowCopyConfirmation] = useState(false);
  const { data: ROA, isLoading: ROALoading } = useFetchVerifyROA(
    connection,
    domain,
    name as Record
  );
  const handleShareClick = () => {
    if (copyItems.includes(name)) {
      setShowCopyConfirmation(true);
      setTimeout(() => setShowCopyConfirmation(false), 10000);
    }
    handleLink(name, value);
  };

  return (
    <Link
      className="py-3 px-20 w-full md:w-[400px] bg-zinc-100 text-black text-center rounded-lg font-azeret font-bold active:translate-y-1 transition-all"
      href="" // TODO
      onClick={handleShareClick}
    >
      <div className="flex justify-center items-center">
        <div className="w-5"></div>
        <div className="">
          <h2 className="">{name.charAt(0).toUpperCase() + name.slice(1)}</h2>
        </div>
        {ROA ? (
          <Badge
            tooltipContent="Ownership is verified"
            imgSrc="/verifications/verified-badge.svg"
            sizeClass=""
          />
        ) : (
          <div className="w-10"></div>
        )}
      </div>
      {showCopyConfirmation && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-[#03001A] text-white rounded-md whitespace-nowrap text-xs z-100">
          Link copied!
        </div>
      )}
    </Link>
  );
};

export default LinkButton;
