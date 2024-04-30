import { GenericLoading } from "@bonfida/components";
const DomainTableSkeleton = () => {
  const loadingItems = Array.from({ length: 8 }, (_, index) => index);
  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="md:w-[800px] sm:w-[450px] w-screen items-center justify-center flex">
        <GenericLoading className="rounded-lg mb-4 sm:w-1/4 w-1/2 h-[42px]" />
      </div>

      <div className="md:w-[800px] sm:w-[450px] w-screen px-3 sm:px-0 space-y-3 h-[70vh]">
        {loadingItems.map((item) => (
          <GenericLoading
            key={item}
            className="w-full rounded-[24px] p-2 h-[66px]"
          />
        ))}
      </div>
    </div>
  );
};

export default DomainTableSkeleton;
