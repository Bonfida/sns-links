import { Record } from "@bonfida/spl-name-service";

export const RECORDS = Object.keys(Record)
  .filter((item) => {
    return isNaN(Number(item));
  })
  // @ts-ignore
  .map((e: string) => Record[e] as string);

const ORDERED_RECORDS_ = [
  // Social
  Record.Twitter,
  Record.Telegram,
  Record.Discord,
  Record.Url,
  Record.Github,
  Record.Email,
  Record.Pic,
  Record.Reddit,
  Record.Backpack,

  // Addresses
  Record.SOL,
  Record.ETH,
  Record.BSC,
  Record.Injective,
  Record.BTC,
  Record.LTC,
  Record.DOGE,

  // Decentralized Hosting
  Record.IPFS,
  Record.ARWV,
  Record.SHDW,
  Record.POINT,

  // DNS Equivalent
  Record.A,
  Record.AAAA,
  Record.TXT,
  Record.CNAME,
] as string[];

// The record list might be extended upstream in `@bonfida/spl-name-service` so we do this for completeness
const REST_RECORD = RECORDS.filter(
  // @ts-ignore
  (e) => !ORDERED_RECORDS_.includes(e as string)
);

export const ORDERED_RECORDS = [...ORDERED_RECORDS_, ...REST_RECORD];

export const formatRecordContent = (content: string, record: Record) => {
  if ([Record.BSC, Record.ETH].includes(record)) {
    content = content.startsWith("0x") ? content.slice(2) : content;
    const buff = Buffer.from(content, "hex");
    if (buff.length === 20) return buff;
    return content;
  }
  return content;
};
