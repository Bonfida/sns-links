import { getDomainKeySync, NameRegistryState } from "@bonfida/spl-name-service";
import { useQuery, UseQueryResult } from "react-query";
import { useCallback } from "react";
import { useConnection } from "@solana/wallet-adapter-react";

export const useIsTokenized = (domain: string): UseQueryResult<boolean> => {
  const { connection } = useConnection();
  const fn = useCallback(async () => {
    const { pubkey } = getDomainKeySync(domain);
    const { nftOwner } = await NameRegistryState.retrieve(connection, pubkey);
    return !!nftOwner;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain]);
  return useQuery<boolean>({
    queryKey: ["isTokenized", domain],
    queryFn: fn,
  });
};
