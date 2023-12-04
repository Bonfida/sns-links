import { PublicKey } from "@solana/web3.js";
export const abbreviatePubkey = (publicKey: PublicKey | null) => {
  if (publicKey) {
    const pubKeyString = publicKey.toBase58();

    return pubKeyString.slice(0, 5) + "..." + pubKeyString?.slice(-5);
  }
};
