import { getAllDomains, reverseLookupBatch } from "@bonfida/spl-name-service";
import { Connection, PublicKey } from "@solana/web3.js";
import { useQuery, UseQueryResult } from "react-query";

export const useFetchDomains = (
  connection: Connection,
  owner: PublicKey | null
): UseQueryResult<string[], unknown> => {
  const fetchDomains = async (): Promise<string[]> => {
    if (!owner) {
      return [];
    }
    const serializedDomainArr: PublicKey[] = await getAllDomains(
      connection,
      owner
    );
    const domains = await reverseLookupBatch(connection, serializedDomainArr);
    const filteredDomains: string[] = domains.filter(
      (domain): domain is string => domain !== undefined
    );

    return filteredDomains;
  };

  return useQuery<string[], unknown>({
    queryKey: ["domains", owner],
    queryFn: fetchDomains,
  });
};
