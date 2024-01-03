import axios from "axios";
import { Record } from "@bonfida/spl-name-service";

export const SUPPORTED_GUARDIANS = Object.freeze([
  Record.ETH,
  Record.SOL,
  Record.Url,
]);

export const sendRoaRequest = async (domain: string, record: Record) => {
  try {
    await axios.post("https://roa-guardian.bonfida.workers.dev/roa", {
      domain,
      record,
    });
  } catch {}
};

export const useRecordsV2Guardians = (record: Record) => {
  const isRoaSupported = SUPPORTED_GUARDIANS.includes(record);

  return {
    isRoaSupported,
    sendRoaRequest,
  };
};
