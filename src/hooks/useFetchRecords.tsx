import { getRecords, Record } from "@bonfida/spl-name-service";
import { useQuery } from "react-query";
import { recordsToFetch, recordStrings } from "@/app/constants/recordsToFetch";
import { Connection } from "@solana/web3.js";

export const useFetchRecords = (connection: Connection, domain: string) => {
  const defaultPic = "/smiley-face.png";
  const fetchRecords = async () => {
    const fetchedRecords = await getRecords(
      connection,
      domain,
      recordsToFetch,
      true
    );

    let picRecord: string | undefined;
    const otherRecords: { [key in Record]?: string } = {};

    fetchedRecords.forEach((value, index) => {
      const key = recordsToFetch[index];
      if (key === Record.Pic) {
        picRecord = value;
      } else {
        otherRecords[key] = value;
      }
    });
    return { pic: picRecord || defaultPic, records: otherRecords };
  };

  return useQuery({ queryKey: ["records", domain], queryFn: fetchRecords });
};
