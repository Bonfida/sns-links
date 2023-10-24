import { getRecords } from "@bonfida/spl-name-service";
import { useQuery } from "react-query";

export const useFetchRecords = (connection, domain) => {
  const defaultPic = "/smiley-face.png";
  const recordsToFetch = [
    "IPFS",
    "ARWV",
    "SOL",
    "ETH",
    "BTC",
    "LTC",
    "DOGE",
    "email",
    "url",
    "discord",
    "github",
    "reddit",
    "twitter",
    "telegram",
    "pic",
    "SHDW",
    "POINT",
    "INJ",
    "BNB",
    "backpack",
    "A",
    "AAAA",
    "CNAME",
    "TXT",
    "background",
  ];

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
