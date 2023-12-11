import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const ProfileOverviewSkeleton = () => {
  return (
    <div className="flex self-start justify-start items-center space-x-5 rounded-full">
      <Skeleton
        width={100}
        height={100}
        highlightColor="#637381"
        baseColor="#2e3b55"
        circle
      />
      <div className="flex flex-col">
        <h1 className="">
          <Skeleton
            highlightColor="#637381"
            baseColor="#2e3b55"
            height={48}
            width={218.51}
            className="rounded-xl"
          />
        </h1>
        <h2 className="">
          <Skeleton
            highlightColor="#637381"
            baseColor="#2e3b55"
            height={32}
            width={207}
            className="rounded-xl"
          />
        </h2>
      </div>
    </div>
  );
};

export default ProfileOverviewSkeleton;
