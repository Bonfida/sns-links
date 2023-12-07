import {
  getTokenizedDomains,
  getAllDomains,
  reverseLookupBatch,
} from "@bonfida/spl-name-service";
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

    const serializedTokenDomainArr: {
      key: PublicKey;
      mint: PublicKey;
      reverse: string | undefined;
    }[] = await getTokenizedDomains(connection, owner);
    const serializedDomainArr: PublicKey[] = await getAllDomains(
      connection,
      owner
    );
    const domains: (string | undefined)[] = await reverseLookupBatch(
      connection,
      serializedDomainArr
    );

    const tokenDomains: string[] = serializedTokenDomainArr.map(
      (tokenizedDomain) => tokenizedDomain.reverse!
    );

    const combinedDomains: (string | undefined)[] =
      domains?.concat(tokenDomains);
    const filteredDomains: string[] = combinedDomains?.filter(
      (domain): domain is string => domain !== undefined
    );

    return filteredDomains;
  };

  return useQuery<string[], unknown>({
    queryKey: ["tokenizedDomains", owner],
    queryFn: fetchDomains,
  });
};
