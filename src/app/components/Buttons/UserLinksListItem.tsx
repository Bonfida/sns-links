import { useState } from "react";
import { Record } from "@bonfida/spl-name-service";
import { useFetchVerifyROA } from "@/hooks/useVerifyROA";
import Badge from "../Tooltip/Tooltip";
import { useConnection } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { useTheme } from "next-themes";

const UserLinksListItem = ({
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
  // Connection
  const { connection } = useConnection();

  // Misc.
  const [showCopyConfirmation, setShowCopyConfirmation] = useState(false);

  // Theme
  const { theme } = useTheme();

  // Record verification
  const { data: ROA, isLoading: ROALoading } = useFetchVerifyROA(
    connection,
    domain,
    name as Record
  );

  // Handlers
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
    <div className="h-[65px] flex bg-list-item-bg border-t-[1px] border-list-item-border rounded-[24px] sm:w-[450px] w-[351px]">
      <div className="flex justify-between items-center w-full py-2 px-5">
        <div className="flex justify-between items-center">
          <span className="text-primary-text text-lg w-7">
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </span>
          {ROA && (
            <Badge
              tooltipContent="Ownership is verified"
              imgSrc="/verifications/verified-badge.svg"
            />
          )}
        </div>

        {interactionType === "newTab" && link ? (
          <a href={link} target="_blank" rel="noopener noreferrer">
            <Image
              src={
                theme === "dark"
                  ? "/link-out/link-out-green.svg"
                  : "/link-out/link-out-purple.svg"
              }
              width={18}
              height={18}
              alt="copy"
            />
          </a>
        ) : (
          <button
            onClick={() => {
              handleCopy(value || "");
            }}
            className="relative"
          >
            <Image
              src={
                theme === "dark"
                  ? "/copy/copy-green.svg"
                  : "/copy/copy-purple.svg"
              }
              width={18}
              height={18}
              alt="copy"
            />
            {showCopyConfirmation && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-list-item-bg text-primary-text rounded-md whitespace-nowrap text-xs z-100">
                Link copied!
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserLinksListItem;
