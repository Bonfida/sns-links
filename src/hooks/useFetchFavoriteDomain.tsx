import { FavouriteDomain, NAME_OFFERS_ID } from "@bonfida/name-offers";
import { PublicKey, Connection } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import {
  NameRegistryState,
  getAllDomains,
  reverseLookup,
} from "@bonfida/spl-name-service";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const getFav = async (connection: Connection, publicKey: string) => {
  try {
    const [favKey] = await FavouriteDomain.getKey(
      NAME_OFFERS_ID,
      new PublicKey(publicKey)
    );
    const favourite = await FavouriteDomain.retrieve(connection, favKey);
    const { registry, nftOwner } = await NameRegistryState.retrieve(
      connection,
      favourite.nameAccount
    );

    // Domain is wraped
    if (!!nftOwner && nftOwner.toBase58() !== publicKey) {
      return;
    }
    // Domain is not wrapped
    if (!nftOwner && !!registry && registry.owner.toBase58() !== publicKey) {
      return;
    }

    const reverse = await reverseLookup(connection, favourite.nameAccount);
    if (
      registry.owner.toBase58() !== publicKey &&
      nftOwner?.toBase58() !== publicKey
    ) {
      return;
    }

    return reverse;
  } catch (err: any) {
    console.log("error", err);
  }
};

export const useFavouriteDomain = (
  publicKey: string | null | undefined
): UseQueryResult<string, undefined> => {
  const { connection } = useConnection();
  const fn = async () => {
    if (!publicKey) return null;
    return await getFav(connection, publicKey);
  };
  return useQuery({
    queryKey: ["useFavouriteDomain", publicKey],
    queryFn: fn,
  });
};

export const useFavouriteDomainOrFirst = (
  publicKey: string | null | undefined
): UseQueryResult<string, undefined> => {
  const { connection } = useConnection();
  const fn = async () => {
    if (!publicKey) return;
    const fav = await getFav(connection, publicKey);
    if (!!fav) return fav;
    const domains = await getAllDomains(connection, new PublicKey(publicKey));
    if (domains.length === 0) return undefined;
    domains.sort((a, b) => a.toBase58().localeCompare(b.toBase58()));
    const reverse = await reverseLookup(connection, domains[0]);
    return reverse;
  };
  return useQuery({
    queryKey: ["useFavouriteDomainOrFirst", publicKey],
    queryFn: fn,
  });
};
