import { useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Record, getRecords } from "@bonfida/spl-name-service";
import { useAsync } from "react-async-hook";
import { useQuery } from "react-query";

export const useFetchRecords = (connection, domain) => {
  const { connected } = useWallet();
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
    data: records,
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
        return recordsToFetch.reduce((obj, key, index) => {
          obj[key] = fetchedRecords[index];
          return obj;
        }, {});
      } catch (err) {
        throw err;
      }
    },
    {
      enabled: connected,
    }
  );

  return {
    records,
    loading: isLoading,
    error: isError ? "An error occurred while fetching records" : null,
  };
};
