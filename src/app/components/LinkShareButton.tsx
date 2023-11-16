import { useContext } from "react";
import SelectedDomainContext from "@/context/selectedDomain";
const LinkShareButton = () => {
  const { selectedDomain } = useContext(SelectedDomainContext);
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="md:h-10 h-8 w-full border border-dashed bg-white border-gray-600 rounded-lg flex justify-center items-center">
        <span className="md:p-4 p-2 overflow-x-auto">
          localhost:3000/user/{selectedDomain}
        </span>
      </div>
      <button
        className="rounded-lg border-white md:py-2 md:px-4 py-1 px-2 bg-gradient-to-r from-[#00F0FF] to-[#CBFF5E] active:translate-y-1 transition-all"
        onClick={() =>
          navigator.clipboard.writeText(`localhost:3000/user/${selectedDomain}`)
        }
      >
        Share
      </button>
    </div>
  );
};

export default LinkShareButton;
