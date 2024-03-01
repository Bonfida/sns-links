import { getFavoriteDomain } from "@bonfida/spl-name-service";
import { Connection, PublicKey } from "@solana/web3.js";
import { useQuery, UseQueryResult } from "react-query";

export const useFetchFavoriteDomain = (
  connection: Connection,
  owner: PublicKey
): UseQueryResult<string> => {
  const fetchFavorite = async (): Promise<string> => {
    if (!owner || !connection) {
      return "";
    }
    const favoriteDomain = await getFavoriteDomain(connection, owner);
    if (!favoriteDomain.stale) {
      return favoriteDomain.reverse;
    } else {
      return "";
    }
  };

  return useQuery<string>({
    queryKey: ["favorite", owner],
    queryFn: fetchFavorite,
  });
};
