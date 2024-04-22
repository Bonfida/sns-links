import Link from "next/link";
import { useState, useEffect } from "react";
import { Record } from "@bonfida/spl-name-service";
import { useFetchVerifyROA } from "@/hooks/useVerifyROA";
import Badge from "../Badges/Tooltip";
import { handleLink, copyItems } from "@/utils/links/handle-click";
import { useConnection } from "@solana/wallet-adapter-react";

const LinkButton = ({
  name,
  value,
  domain,
}: {
  name: string;
  value: string;
  domain: string;
}) => {
  const { connection } = useConnection();
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
    <div
      className=" h-[65px] flex bg-white/[7%] border-t-[1px] border-white/[24%] rounded-[24px] w-[600px]"
      onClick={handleShareClick}
    >
      <div className="flex justify-center items-center">
        <div className="flex justify-between items-center w-full py-2 px-4">
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
        </div>
      </div>
      {showCopyConfirmation && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-[#03001A] text-white rounded-md whitespace-nowrap text-xs z-100">
          Link copied!
        </div>
      )}
    </div>
  );
};

export default LinkButton;
