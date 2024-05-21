import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const RecordsTableSkeleton = () => {
  return (
    <div className="border-[1px] bg-white/10 backdrop-blur-sm border-white/20 rounded-xl space-y-2 p-10  md:mt-10 mt-28 max-w-[800px]">
      <>
        <div className="flex flex-col items-center justify-around">
          <div className="flex items-center justify-center w-full space-y-2 ">
            <Skeleton
              circle
              height={100}
              width={100}
              highlightColor="#637381"
              baseColor="#2e3b55"
            />
            <h1 className="text-5xl font-bold text-white">
              <Skeleton
                width={224}
                height={48}
                className="rounded-xl"
                highlightColor="#637381"
                baseColor="#2e3b55"
              />
            </h1>
          </div>
          <Skeleton
            width={424.5}
            height={90}
            className="rounded-xl"
            highlightColor="#637381"
            baseColor="#2e3b55"
          />
        </div>
      </>
      <table className="z-10 w-full mt-4 text-white table-fixed">
        <thead className="">
          <tr>
            <th className="p-4 w-1/4 text-start rounded-tl-xl text-sm md:text-base bg-[#191C30] ">
              <Skeleton
                width={718.5}
                height={56}
                className="rounded-xl"
                highlightColor="#637381"
                baseColor="#2e3b55"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="items-center justify-center">
            <td className="justify-center border-b-[1px] border-white border-opacity-20 items-center p-4 text-xs md:text-base text-start">
              <Skeleton
                count={19}
                width={718}
                height={57}
                highlightColor="#637381"
                baseColor="#2e3b55"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RecordsTableSkeleton;
