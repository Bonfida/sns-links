import { useWallet } from "@solana/wallet-adapter-react";
import { getAllDomains, reverseLookupBatch } from "@bonfida/spl-name-service";
import { useQuery } from "react-query";

export const useFetchDomains = (connection, owner) => {
  const { connected } = useWallet();

  const {
    data: domains,
    isLoading,
    isError,
  } = useQuery(
    ["domains", owner],
    async () => {
      const serializedDomainArr = await getAllDomains(connection, owner);
      return await reverseLookupBatch(connection, serializedDomainArr);
    },
    {
      enabled: connected,
    }
  );

  return {
    domains,
    loading: isLoading,
    error: isError ? "An error occurred while fetching domains." : null,
  };
};
