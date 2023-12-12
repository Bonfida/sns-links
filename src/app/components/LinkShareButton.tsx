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
    if (!selectedDomain && !domain) {
      setErrorMessage("No domain selected. Please select a domain to share.");
      return;
    }

    navigator.clipboard
      .writeText(`localhost:3000/user/${selectedDomain || domain}`)
      .then(() => {
        console.log("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        setErrorMessage("Failed to copy link.");
      });
  };

  return (
    <>
      <button
        className=" active:translate-y-1 transition-all"
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
