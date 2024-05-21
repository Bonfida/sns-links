import { Result } from "@/hooks/useRecordsV2";
import { deserializeRecordV2Content } from "@bonfida/spl-name-service";
export const getRecordValue = (result: Result): string => {
  if (typeof result.data !== "string" && result.data) {
    try {
      return deserializeRecordV2Content(
        result.data.getContent(),
        result.record
      );
    } catch (err) {
      console.log("Error: ", err);
      return "";
    }
  }
  return result.data || "";
};
