import {
  getTokenizedDomains,
  getAllDomains,
  reverseLookupBatch,
} from "@bonfida/spl-name-service";
import { Connection, PublicKey } from "@solana/web3.js";
import { useQuery, UseQueryResult } from "react-query";

export const useFetchTokenizedDomains = (
  connection: Connection,
  owner: PublicKey | null
): UseQueryResult<string[], unknown> => {
  const fetchTokenizedDomains = async (): Promise<string[]> => {
    if (!owner) {
      return [];
    }

    const serializedTokenDomainArr = await getTokenizedDomains(
      connection,
      owner
    );
    const serializedDomainArr: PublicKey[] = await getAllDomains(
      connection,
      owner
    );
    const domains = await reverseLookupBatch(connection, serializedDomainArr);

    const tokenDomains: string[] = serializedTokenDomainArr.map(
      (tokenizedDomain) => tokenizedDomain.reverse!
    );
    domains.concat(tokenDomains);
  };

  return useQuery<string[], unknown>({
    queryKey: ["tokenizedDomains", owner],
    queryFn: fetchTokenizedDomains,
  });
};
