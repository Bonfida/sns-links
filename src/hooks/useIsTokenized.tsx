import { getDomainKeySync, NameRegistryState } from "@bonfida/spl-name-service";
import { useDomainsInfo } from "./useDomainsInfo";
import { useQuery, UseQueryResult } from "react-query";
import { useConnection } from "@solana/wallet-adapter-react";

export const useIsTokenized = (domain: string): UseQueryResult<boolean> => {
  const { connection } = useConnection();

  const fn = async () => {
    const { pubkey } = getDomainKeySync(domain);
    const { nftOwner } = await NameRegistryState.retrieve(connection, pubkey);

    if (nftOwner) {
      return true;
    }
    return false;
  };
  return useQuery<boolean>({
    queryKey: ["isTokenized", domain],
    queryFn: fn,
  });
};
