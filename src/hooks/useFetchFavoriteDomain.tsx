import { getFavoriteDomain } from "@bonfida/spl-name-service";
import { Connection, PublicKey } from "@solana/web3.js";
import { useQuery, UseQueryResult } from "react-query";
import { NameRegistryState, getDomainKeySync } from "@bonfida/spl-name-service";

export const useFetchFavoriteDomain = (
  connection: Connection,
  owner: PublicKey
): UseQueryResult<string> => {
  const fetchFavorite = async (): Promise<string> => {
    const { reverse } = await getFavoriteDomain(connection, owner);
    if (!owner) {
      return "";
    }
    return reverse;
  };

  return useQuery<string>({
    queryKey: ["favorite", owner],
    queryFn: fetchFavorite,
  });
};
