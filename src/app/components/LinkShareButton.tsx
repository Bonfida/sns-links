import { useContext, useState, useEffect } from "react";
import SelectedDomainContext from "@/context/selectedDomain";
const LinkShareButton = () => {
  const { selectedDomain } = useContext(SelectedDomainContext);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    // Clear the error message if a domain is selected
    if (selectedDomain) {
      setErrorMessage("");
    }
  }, [selectedDomain]);

  const handleShareClick = () => {
    if (!selectedDomain) {
      setErrorMessage("No domain selected. Please select a domain to share.");
      return;
    }
    navigator.clipboard.writeText(`localhost:3000/user/${selectedDomain}`);
  };

  return (
    <>
      <button
        className="rounded-lg border-white md:py-4 md:px-4 py-2 px-2 bg-gradient-to-r from-[#00F0FF] to-[#CBFF5E] active:translate-y-1 transition-all text-sm text-[#03001A]"
        onClick={handleShareClick}
      >
        Share
      </button>
    </>
  );
};

export default LinkShareButton;
