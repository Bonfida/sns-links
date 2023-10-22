import { useWallet } from "@solana/wallet-adapter-react";
import { getRecords } from "@bonfida/spl-name-service";
import { useQuery } from "react-query";

export const useFetchRecords = (connection, domain) => {
  const { connected } = useWallet();
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

  const {
    data: fetchedData,
    isLoading,
    isError,
  } = useQuery(
    ["records", domain],
    async () => {
      try {
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

        return { pic: picRecord, records: otherRecords };
      } catch (err) {
        throw err;
      }
    },
    {
      enabled: connected,
    }
  );

  return {
    records: fetchedData?.records,
    pic: fetchedData?.pic || defaultPic,
    loading: isLoading,
    error: isError ? "An error occurred while fetching records" : null,
  };
};
