import { getDomainKeySync, NameRegistryState } from "@bonfida/spl-name-service";
import { useQuery } from "react-query";
import { useCallback } from "react";
import { useConnection } from "@solana/wallet-adapter-react";

export const useIsTokenized = (domain: string) => {
  const { connection } = useConnection();
  const fn = useCallback(async () => {
    const { pubkey } = getDomainKeySync(domain);
    const { nftOwner } = await NameRegistryState.retrieve(connection, pubkey);
    return !!nftOwner || false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain]);
  return useQuery<boolean>({
    queryKey: ["isTokenized", domain],
    queryFn: fn,
    staleTime: Infinity,
  });
};
