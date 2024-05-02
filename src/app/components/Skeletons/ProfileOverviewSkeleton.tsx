import { GenericLoading } from "@bonfida/components";
import { useTheme } from "next-themes";
import { twMerge } from "tailwind-merge";
const ProfileOverviewSkeleton = () => {
  const { theme } = useTheme();
  return (
    <div className="flex flex-col sm:flex-row justify-start items-center sm:space-x-5 w-full gap-y-5 py-3 sm:py-0">
      <GenericLoading
        className={twMerge(
          "rounded-full sm:w-[120px] sm:h-[120px] w-[56px] h-[56px]",
          theme === "light" ? "bg-list-item-bg" : ""
        )}
      />
      <div className="flex flex-col items-center sm:items-start gap-y-2">
        <h1 className="">
          <GenericLoading
            className={twMerge(
              "rounded-lg w-[115px] sm:w-[171px] h-8 sm:h-10",
              theme === "light" ? "bg-list-item-bg" : ""
            )}
          />
        </h1>
        <h2 className="">
          <GenericLoading
            className={twMerge(
              "rounded-lg h-6 sm:h-8 w-[104px] sm:w-[150px]",
              theme === "light" ? "bg-list-item-bg" : ""
            )}
          />
        </h2>
      </div>
    </div>
  );
};

export default ProfileOverviewSkeleton;
