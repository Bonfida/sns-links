import { useContext, useEffect } from "react";
import RecordsPerDomainContext from "@/context/recordsPerDomain";
const RecordsTable = () => {
  const { recordsPerDomain, setRecordsPerDomain, profilePic } = useContext(
    RecordsPerDomainContext
  );

  useEffect(() => {
    console.log("recordsPerDomain", recordsPerDomain);
  }, [recordsPerDomain]);

  return (
    <div className=" w-full flex flex-col justify-center items-center mt-10">
      {profilePic ? (
        <img src={profilePic} className="w-32 rounded-full" />
      ) : (
        <img src="/smiley-face.png" className="w-32"></img>
      )}
      <div className="w-full flex justify-center mt-10">
        <div className="w-1/2 h-full flex justify-center items-center">
          <div className="w-1/2 h-2/3 flex flex-col justify-start items-start border border-[#2A2A51] rounded-lg border-2">
            {Object.keys(recordsPerDomain).map((record) => {
              return (
                <div
                  key={record}
                  className="h-8 w-full items-center justify-between flex flex-row border border-[#2A2A51] p-2"
                >
                  <h1 className="text-white">{record}</h1>
                </div>
              );
            })}
          </div>
          <div className="w-1/2 h-2/3 flex flex-col justify-center items-center border border-[#2A2A51] rounded-lg border-2">
            {Object.values(recordsPerDomain).map((recordVal) => {
              return (
                <div
                  key={recordVal}
                  className="h-8 w-full items-center justify-end flex flex-row border border-[#2A2A51] p-2"
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
};

export default RecordsTable;
