import { getTokenizedDomains } from "@bonfida/spl-name-service";
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
    const domainArray: string[] = serializedTokenDomainArr.map(
      (tokenizedDomain) => tokenizedDomain.reverse!
    );

    return domainArray;
  };

  return useQuery<string[], unknown>({
    queryKey: ["tokenizedDomains", owner],
    queryFn: fetchTokenizedDomains,
  });
};
