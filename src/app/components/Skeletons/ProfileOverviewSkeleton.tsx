import { GenericLoading } from "@bonfida/components";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const ProfileOverviewSkeleton = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-start items-center sm:space-x-5 w-full gap-y-5 py-3 sm:py-0">
      <GenericLoading className="rounded-full sm:w-[120px] sm:h-[120px] w-[56px] h-[56px]" />
      <div className="flex flex-col items-center sm:items-start gap-y-2">
        <h1 className="">
          <GenericLoading className="rounded-lg w-[115px] sm:w-[171px] h-8 sm:h-10" />
        </h1>
        <h2 className="">
          <GenericLoading className="rounded-lg h-6 sm:h-8 w-[104px] sm:w-[150px]" />
        </h2>
      </div>
    </div>
  );
};

export default ProfileOverviewSkeleton;
