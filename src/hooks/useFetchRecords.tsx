import {
  getRecords,
  Record,
  getMultipleRecordsV2,
} from "@bonfida/spl-name-service";
import { useQuery } from "react-query";
import { recordsToFetch } from "@/app/constants/recordsToFetch";
import { Connection } from "@solana/web3.js";

export const useFetchRecords = (
  connection: Connection,
  domain: string | undefined
) => {
  const fetchRecords = async (): Promise<
    { record: string; content?: string }[] | undefined
  > => {
    if (!domain) {
      return;
    }

    const fetchedV2Records = await getMultipleRecordsV2(
      connection,
      domain,
      recordsToFetch,
      { deserialize: true }
    );

    const v2RecordsArray: { record: string; content?: string }[] =
      recordsToFetch.reduce((arr, record) => {
        const fetchedRecord = fetchedV2Records.find(
          (f) => f?.record === record
        );

        arr.push({
          record: record,
          content: fetchedRecord
            ? fetchedRecord.deserializedContent
            : undefined,
        });

        return arr;
      }, [] as { record: string; content?: string }[]);

    return v2RecordsArray;
  };

  return useQuery({ queryKey: ["records", domain], queryFn: fetchRecords });
};
