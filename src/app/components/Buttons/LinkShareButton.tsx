import { useContext, useState, useEffect } from "react";
import SelectedDomainContext from "@/context/selectedDomain";
import Image from "next/image";

const LinkShareButton = ({ domain }: { domain: string }) => {
  const { selectedDomain } = useContext(SelectedDomainContext);
  const [showCopyConfirmation, setShowCopyConfirmation] = useState(false);

  const handleShareClick = () => {
    navigator.clipboard
      .writeText(`localhost:3000/user/${selectedDomain || domain}`)
      .then(() => {
        setShowCopyConfirmation(true);
        setTimeout(() => setShowCopyConfirmation(false), 750);
      });
  };

  return (
    <>
      <button
        className="active:translate-y-1 transition-all relative"
        onClick={handleShareClick}
      >
        <Image
          src="/link-out/link-out.svg"
          height={40}
          width={40}
          alt={"share link"}
        />
        {showCopyConfirmation && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-primary-bg text-primary-text rounded-md whitespace-nowrap text-xs">
            Link copied!
          </div>
        )}
      </button>
    </>
  );
};

export default LinkShareButton;
