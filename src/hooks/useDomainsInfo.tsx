import { useQuery } from "react-query";
import { getDomainKeySync } from "@bonfida/spl-name-service";
import { AccountInfo } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";

export const useDomainsInfoV2 = (domains: string[] | undefined | null) => {
  const { connection } = useConnection();
  const fn = async () => {
    if (!domains) return null;
    const keys = domains?.map((e) => getDomainKeySync(e).pubkey);
    const batchSize = 100;
    const batchedResults: (AccountInfo<Buffer> | null)[] = [];

    for (let i = 0; i < keys.length; i += batchSize) {
      const batchKeys = keys.slice(i, i + batchSize);
      const batchResult = await connection.getMultipleAccountsInfo(batchKeys);
      batchedResults.push(...batchResult);
    }

    return batchedResults;
  };

  return useQuery({
    queryKey: ["useDomainsInfoV2", domains],
    queryFn: fn,
  });
};
