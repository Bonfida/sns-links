import { getDomainKeySync, NameRegistryState } from "@bonfida/spl-name-service";
import { Connection, PublicKey } from "@solana/web3.js";
export const isTokenized = async (
  domain: string,
  connection: Connection,
  publicKey: PublicKey
): Promise<boolean> => {
  if (!domain || !connection || !publicKey) {
    throw new Error("Missing argument");
  }

  const { pubkey } = getDomainKeySync(domain);
  const { nftOwner } = await NameRegistryState.retrieve(connection, pubkey);

  if (nftOwner) {
    return true;
  }
  return false;
};
