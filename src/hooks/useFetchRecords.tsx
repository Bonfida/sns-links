import { getRecords } from "@bonfida/spl-name-service";
import { useQuery } from "react-query";
import { recordsToFetch } from "@/utils/recordsToFetch";

export const useFetchRecords = (connection, domain) => {
  const defaultPic = "/smiley-face.png";
  const fetchRecords = async () => {
    const fetchedRecords = await getRecords(
      connection,
      domain,
      recordsToFetch,
      true
    );

    let picRecord;
    const otherRecords = {};

    fetchedRecords.forEach((value, index) => {
      const key = recordsToFetch[index];
      if (key === "pic") {
        picRecord = value;
      } else {
        otherRecords[key] = value;
      }
    });
    return { pic: picRecord || defaultPic, records: otherRecords };
  };

  return useQuery({ queryKey: ["records", domain], queryFn: fetchRecords });
};
