import { derive } from "../utils/derive";
import { NameRegistryState } from "@bonfida/spl-name-service";
import { useAsyncEffect, useSafeState } from "ahooks";
import { useMultipleAccountInfoWs } from "./useMultipleAccountInfoWs";
import { AccountInfo, PublicKey } from "@solana/web3.js";

const callBack = (info: AccountInfo<Buffer>) => {
  return NameRegistryState.deserialize(info.data);
};

export const useDomainsInfo = (domains: string[] | undefined | null) => {
  const [keys, setKeys] = useSafeState<{ pubkey: PublicKey; domain: string }[]>(
    []
  );
  const data = useMultipleAccountInfoWs(
    keys.map((e) => e.pubkey),
    callBack
  );

  useAsyncEffect(async () => {
    if (!domains) return;
    const pubkeys = await Promise.all(domains.map((e) => derive(e)));
    setKeys(
      pubkeys.map((e, idx) => {
        return { pubkey: e.pubkey, domain: domains[idx] };
      })
    );
  }, [JSON.stringify(domains)]);

  return { data, keys };
};
