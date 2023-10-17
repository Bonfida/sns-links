import { useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Record, getRecords } from "@bonfida/spl-name-service";
import { useAsync } from "react-async-hook";

export const useFetchRecords = (connection, domain) => {
  const { connected } = useWallet();
  const [records, setRecords] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);
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
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const fetchedRecords = await getRecords(
          connection,
          domain,
          recordsToFetch,
          true
        );
        if (mounted.current) {
          const responseObj = recordsToFetch.reduce((obj, key, index) => {
            obj[key] = fetchedRecords[index];
            return obj;
          }, {});
          console.log("responseObj", responseObj);
          setRecords(responseObj);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
      return () => (mounted.current = false);
    };

    fetchRecords();
  }, [domain, connected, connection]);

  return { records, loading, error };
};
