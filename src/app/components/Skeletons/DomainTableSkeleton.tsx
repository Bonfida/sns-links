import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const DomainTableSkeleton = () => {
  return (
    <div className="space-y-2 p-10 mt-10  md:w-[800px] w-[350px]">
      <div className="flex justify-center w-full">
        <Skeleton
          highlightColor="#637381"
          baseColor="#2e3b55"
          height={42}
          containerClassName="rounded-xl"
          width={203}
        />
      </div>
      <table className="z-10 w-full mt-4 text-white items-center justify-center table-fixed">
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
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DomainTableSkeleton;
