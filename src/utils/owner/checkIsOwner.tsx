import { PublicKey } from "@solana/web3.js";
export const checkIsOwner = (
  owner: string | undefined,
  publicKey: PublicKey | null
): boolean | null => {
  console.log("owner", owner, "publicKey", publicKey?.toBase58());
  if (!publicKey || !owner) {
    return null;
  }
  if (owner === publicKey?.toBase58()) {
    return true;
  } else {
    return false;
  }
};
