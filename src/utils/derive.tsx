import { PublicKey } from "@solana/web3.js";
import { getHashedName, getNameAccountKey } from "@bonfida/spl-name-service";
const SOL_TLD_AUTHORITY = new PublicKey(
  "58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx"
);

export const _derive = async (
  name: string,
  parent: PublicKey = SOL_TLD_AUTHORITY
) => {
  let hashed = await getHashedName(name);
  let pubkey = await getNameAccountKey(hashed, undefined, parent);
  return { pubkey, hashed };
};

export const derive = async (domain: string, record = false) => {
  // Handle subdomain
  const splitted = domain.split(".");
  if (splitted.length === 2) {
    const prefix = Buffer.from([record ? 1 : 0]).toString();
    const sub = prefix.concat(splitted[0]);
    const { pubkey: parentKey } = await _derive(splitted[1]);
    const result = await _derive(sub, parentKey);
    return { ...result, isSub: true, parent: parentKey };
  } else if (splitted.length === 3 && record) {
    // Parent key
    const { pubkey: parentKey } = await _derive(splitted[2]);

    // Sub domain
    const { pubkey: subKey } = await _derive(
      "\0".concat(splitted[1]),
      parentKey
    );

    // Sub record
    const recordPrefix = Buffer.from([1]).toString();
    const result = await _derive(recordPrefix.concat(splitted[0]), subKey);

    return { ...result, isSub: true, parent: parentKey, isSubRecord: true };
  } else if (splitted.length >= 3) {
    throw new Error("Invalid derivation input");
  }
  const result = await _derive(domain, SOL_TLD_AUTHORITY);
  return { ...result, isSub: false, parent: undefined };
};
