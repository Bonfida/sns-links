import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const DomainTableSkeleton = () => {
  return (
    <div className="border-[1px] bg-white/10 backdrop-blur-sm border-white/20 rounded-xl space-y-2 p-10 mt-10  md:w-[800px] w-[350px]">
      <table className="z-10 w-full mt-4 text-white items-center justify-center table-fixed">
        <thead>
          <tr>
            <th className="p-4 w-1/4 text-center rounded-tl-xl align-middle rounded-xl bg-[#191C30]">
              <Skeleton
                highlightColor="#637381"
                baseColor="#2e3b55"
                height={56}
                containerClassName="rounded-xl"
              />
            </th>
            {/* Add more th tags if needed */}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Skeleton
                count={5}
                highlightColor="#637381"
                baseColor="#2e3b55"
                height={88.5}
                containerClassName="rounded-xl"
              />
            </td>
            {/* Add more td tags if needed */}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DomainTableSkeleton;
