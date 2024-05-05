import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { useTheme } from "next-themes";

export const SearchAction = ({
  searchTerm,
  setSearchTerm,
  disabled,
}: {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  disabled: boolean;
}) => {
  const emptySearch = searchTerm.length === 0;
  const { theme } = useTheme();
  const searchIcon =
    theme === "dark"
      ? !emptySearch
        ? "/close/close-white.svg"
        : "/search/magnifying-glass-white.svg"
      : !emptySearch
      ? "/close/close-black.svg"
      : "/search/magnifying-glass-black.svg";
  return (
    <div className="flex relative sm:w-1/3 w-1/2 h-fit mb-4">
      <input
        type="text"
        placeholder="Search domains..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={disabled}
        className="relative w-full pl-4 pr-7 py-2 border rounded-xl bg-input-bg text-search-input-text border-search-input-border"
      />
      <button
        className={twMerge(
          "flex items-center inset-y-0 right-3 absolute",
          emptySearch ? "cursor-default" : "cursor-pointer"
        )}
        onClick={() => setSearchTerm("")}
        disabled={emptySearch}
      >
        <Image src={searchIcon} height={20} width={20} alt="close" />
      </button>
    </div>
  );
};
