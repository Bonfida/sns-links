import { getAllDomains, reverseLookupBatch } from "@bonfida/spl-name-service";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "react-query";

export const useFetchDomains = (connection, owner) => {
  const fetchDomains = async () => {
    if (!owner) {
      return [];
    }
    const serializedDomainArr = await getAllDomains(connection, owner);
    return await reverseLookupBatch(connection, serializedDomainArr);
  };

  return useQuery({
    queryKey: ["domains", owner],
    queryFn: fetchDomains,
  });
};
