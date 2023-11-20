import {
  getAllDomains,
  reverseLookupBatch,
  getTokenizedDomains,
} from "@bonfida/spl-name-service";
import { Connection, PublicKey } from "@solana/web3.js";
import { useQuery } from "react-query";

export const useFetchTokenizedDomains = (
  connection: Connection,
  owner: PublicKey
) => {
  const fetchTokenizedDomains = async () => {
    if (!owner) {
      return [];
    }
    const serializedTokenDomainArr = await getTokenizedDomains(
      connection,
      owner
    );

    const domainArray = serializedTokenDomainArr.map(
      (tokenizedDomain) => tokenizedDomain.reverse
    );

    return domainArray;
  };

  return useQuery({
    queryKey: ["tokenizedDomains", owner],
    queryFn: fetchTokenizedDomains,
  });
};
