import { derive } from "../utils/derive";
import { NameRegistryState } from "@bonfida/spl-name-service";
import { deserializeUnchecked } from "borsh";
import { useAsyncEffect, useSafeState } from "ahooks";
import { useMultipleAccountInfoWs } from "./useMultipleAccountInfoWs";
import { AccountInfo, PublicKey } from "@solana/web3.js";

const callBack = (info: AccountInfo<Buffer>) => {
  const reg = deserializeUnchecked(
    NameRegistryState.schema,
    NameRegistryState,
    info.data
  );
  reg.data = info.data?.slice(NameRegistryState.HEADER_LEN);
  return reg;
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
