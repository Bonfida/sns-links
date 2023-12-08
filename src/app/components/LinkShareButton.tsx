import { useContext, useState, useEffect } from "react";
import SelectedDomainContext from "@/context/selectedDomain";
import Image from "next/image";
const LinkShareButton = ({ domain }: { domain: string }) => {
  const { selectedDomain } = useContext(SelectedDomainContext);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (selectedDomain || domain) {
      setErrorMessage("");
    }
  }, [selectedDomain, domain]);

  const handleShareClick = () => {
    if (!selectedDomain || !domain) {
      setErrorMessage("No domain selected. Please select a domain to share.");
      return;
    }
    navigator.clipboard.writeText(
      `localhost:3000/user/${selectedDomain || domain}`
    );
  };

  return (
    <>
      <button
        // className="rounded-lg border-white md:py-4 md:px-4 py-2 px-2 bg-gradient-to-r from-[#00F0FF] to-[#CBFF5E] active:translate-y-1 transition-all text-sm text-[#03001A]"

        onClick={handleShareClick}
      >
        <Image
          src="/share-link/share.svg"
          height={40}
          width={40}
          alt={"share link"}
          className=""
        />
      </button>
    </>
  );
};

export default LinkShareButton;
