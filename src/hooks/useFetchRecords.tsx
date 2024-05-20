import { Record, getMultipleRecordsV2 } from "@bonfida/spl-name-service";
import { useQuery } from "react-query";
import { RECORDS_TO_FETCH } from "@/app/constants/records-to-fetch";
import { Connection } from "@solana/web3.js";

export const useFetchRecords = (
  connection: Connection,
  domain: string | undefined
) => {
  const fetchRecords = async (): Promise<
    { record: Record; content?: string }[] | undefined
  > => {
    if (!domain) {
      return;
    }

    const fetchedV2Records = await getMultipleRecordsV2(
      connection,
      domain,
      RECORDS_TO_FETCH,
      { deserialize: true }
    );

    const v2RecordsArray: { record: Record; content?: string }[] =
      RECORDS_TO_FETCH.reduce((arr, record) => {
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
      }, [] as { record: Record; content?: string }[]);

    return v2RecordsArray;
  };

  return useQuery({ queryKey: ["records", domain], queryFn: fetchRecords });
};
