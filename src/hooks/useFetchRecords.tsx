import {
  getRecords,
  Record,
  getMultipleRecordsV2,
} from "@bonfida/spl-name-service";
import { useQuery } from "react-query";
import { recordsToFetch } from "@/app/constants/recordsToFetch";
import { Connection } from "@solana/web3.js";

interface FetchRecordsResult {
  pic: string | undefined;
  records: { [key in Record]?: string };
}
export const useFetchRecords = (
  connection: Connection,
  domain: string | undefined
) => {
  const fetchRecords = async (): Promise<FetchRecordsResult | undefined> => {
    if (!domain) {
      return;
    }

    const fetchedV2Records = await getMultipleRecordsV2(
      connection,
      domain,
      recordsToFetch,
      { deserialize: true }
    );

    let picRecord: string | undefined;
    const otherRecords: { [key in Record]?: string } = {};
    const v2RecordsObj: { [key in Record]?: string } = recordsToFetch.reduce(
      (obj, record) => {
        if (record !== Record.Pic) {
          obj[record] = undefined;
        }
        return obj;
      },
      {} as { [key in Record]?: string }
    );

    fetchedV2Records.forEach((value) => {
      if (value?.record === Record.Pic) {
        picRecord = value.deserializedContent;
      }

      if (value?.record && v2RecordsObj.hasOwnProperty(value.record)) {
        v2RecordsObj[value.record] = value.deserializedContent;
      }
    });

    return { pic: picRecord, records: v2RecordsObj };
  };

  return useQuery({ queryKey: ["records", domain], queryFn: fetchRecords });
};
