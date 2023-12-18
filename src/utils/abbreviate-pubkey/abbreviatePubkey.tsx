import { PublicKey } from "@solana/web3.js";
export const abbreviatePubkey = (
  publicKey: PublicKey | null,
  sliceLength: number
) => {
  if (publicKey) {
    const pubKeyString = publicKey.toBase58();

    return (
      pubKeyString.slice(0, sliceLength) +
      "..." +
      pubKeyString?.slice(-sliceLength)
    );
  }
};
