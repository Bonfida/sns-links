import { useFetchRecords } from "@/hooks/useFetchRecords";
const RecordsTable = ({ connection, domain }) => {
  const { data, isLoading } = useFetchRecords(connection, domain);

  if (!isLoading) {
    return (
      <div className=" w-full flex flex-col justify-center items-center ">
        <div className="w-full flex justify-center mt-10">
          <div className="md:w-1/2 w-full h-full flex justify-center items-center">
            <div className="w-full md:w-1/3 h-2/3 flex flex-col justify-start items-start border-[#2A2A51] rounded-lg border-2 border-r-0">
              {Object.keys(data.records).map((record) => {
                return (
                  <div
                    key={record}
                    className="group h-8 w-full items-center space-x-2 flex flex-row border border-[#2A2A51] p-2"
                  >
                    <h1 className="text-white">
                      {record.charAt(0).toUpperCase() + record.slice(1)}
                    </h1>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <img src="/edit-icon.svg" />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="w-full md:w-1/3 h-2/3 flex flex-col justify-center items-center  border-[#2A2A51] rounded-lg border-2 border-l-0">
              {Object.values(data.records).map((recordVal, index) => {
                return (
                  <div
                    key={`${recordVal}-${index}`}
                    className="h-8 w-full items-center md:justify-end justify-center flex flex-row border border-[#2A2A51] p-2"
                  >
                    <h1 className="text-white">{recordVal}</h1>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default RecordsTable;
