import Link from "next/link";
import { useState, useEffect } from "react";
import { Record } from "@bonfida/spl-name-service";
import { useFetchVerifyROA } from "@/hooks/useVerifyROA";
import Badge from "../Badges/Tooltip";
import { useConnection } from "@solana/wallet-adapter-react";
import Image from "next/image";

const LinkButton = ({
  name,
  value,
  domain,
  interactionType,
  link,
}: {
  name: string;
  value: string | undefined;
  domain: string;
  interactionType?: string | "copy";
  link?: string;
}) => {
  const { connection } = useConnection();
  const [showCopyConfirmation, setShowCopyConfirmation] = useState(false);
  const { data: ROA, isLoading: ROALoading } = useFetchVerifyROA(
    connection,
    domain,
    name as Record
  );
  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value).then(
      () => {
        setShowCopyConfirmation(true);
        setTimeout(() => {
          setShowCopyConfirmation(false);
        }, 200);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <div className="h-[65px] flex bg-white/[7%] border-t-[1px] border-white/[24%] rounded-[24px] w-[450px]">
      <div className="flex justify-between items-center w-full py-2 px-5">
        <div className="space-x-2 flex justify-center items-center">
          <span className="text-white text-lg">
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </span>
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
        {interactionType === "newTab" && link ? (
          <a href={link} target="_blank" rel="noopener noreferrer">
            <Image src="/link-out.svg" width={18} height={18} alt="copy" />
          </a>
        ) : (
          <button
            onClick={() => {
              handleCopy(value || "");
            }}
            className="relative"
          >
            <Image src="/copy.svg" width={18} height={18} alt="copy" />
            {showCopyConfirmation && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-[#03001A]/75 text-white rounded-md whitespace-nowrap text-xs z-100">
                Link copied!
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default LinkButton;
