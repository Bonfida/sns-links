import { Record } from "@bonfida/spl-name-service";
import { isPubkey } from "@bonfida/hooks";
import { USERNAME_RECORDS } from "@/app/constants/username-records";

export const simpleValidation = (
  value: string,
  record: Record
): { err?: string } => {
  if (record === Record.SOL && !isPubkey(value)) {
    return { err: `The record must be a valid wallet address` };
  }

  if (USERNAME_RECORDS.includes(record) && value.startsWith("https://")) {
    return { err: `The record must contain your username not a link` };
  }

  if (record === Record.Url) {
    try {
      new URL(value);
    } catch (err) {
      return { err: `Invalid URL` };
    }
  }
  return {};
};
