import { Connection } from "@solana/web3.js";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { NameRegistryState, getDomainKeySync } from "@bonfida/spl-name-service";

export const useFetchOwner = (
  connection: Connection,
  domain: string
): UseQueryResult<string> => {
  const fetchOwner = async (): Promise<string> => {
    if (!connection || !domain) {
      return "";
    }
    const { pubkey } = getDomainKeySync(domain);

    const { registry, nftOwner } = await NameRegistryState.retrieve(
      connection,
      pubkey
    );

    let owner: string = registry.owner.toBase58();
    if (nftOwner) {
      owner = nftOwner.toBase58();
    }
    return owner;
  };

  return useQuery<string>({
    queryKey: ["owner", domain],
    queryFn: fetchOwner,
  });
};
