import { AccountInfo, PublicKey, Connection } from "@solana/web3.js";
import { useRef } from "react";
import { useAsyncEffect, useUnmount, useMap } from "ahooks";
import { useConnection } from "@solana/wallet-adapter-react";
import { getMultipleAccountsInfo } from "@bonfida/hooks";

type CallBack<T> = (info: AccountInfo<Buffer>) => T;

const unsubscribe = async (connection: Connection, subs: number[]) => {
  await Promise.all(
    subs.map((sub) => connection.removeAccountChangeListener(sub))
  );
};

export function useMultipleAccountInfoWs<T>(
  keys: PublicKey[],
  callBack: CallBack<T>
) {
  const { connection } = useConnection();
  const subscription = useRef<number[]>([]);
  const [map, { set, setAll }] = useMap<string, T>();

  useAsyncEffect(async () => {
    const _map = new Map<string, T>();
    const subs: number[] = [];
    const result = await getMultipleAccountsInfo(connection, keys);
    //@ts-ignore
    for (let key of result.keys()) {
      const data = result.get(key);
      if (!data) continue;

      _map.set(key.toBase58(), callBack(data));
      const sub = connection.onAccountChange(key, (info) => {
        set(key.toBase58(), callBack(info));
      });
      subs.push(sub);
    }
    subscription.current = subs;
    setAll(_map);
  }, [JSON.stringify(keys.map((e) => e.toBase58()))]);

  useUnmount(async () => await unsubscribe(connection, subscription.current));

  return map;
}
