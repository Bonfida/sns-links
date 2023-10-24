import { useContext } from "react";
import SelectedDomainContext from "@/context/selectedDomain";
const LinkShareButton = () => {
  const { selectedDomain } = useContext(SelectedDomainContext);
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="h-10 w-full border border-dashed bg-white border-gray-600 rounded-lg flex justify-center items-center">
        <span className="p-4">localhost:3000/user/{selectedDomain}</span>
      </div>
      <button
        className="rounded-lg border-white py-2 px-4 bg-gradient-to-r from-[#00F0FF] to-[#CBFF5E] hover:translate-y-1 transition-all"
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
