import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  NameRegistryState,
  createNameRegistry,
  getRecordKeySync,
} from "@bonfida/spl-name-service";
import { Connection } from "@solana/web3.js";

const useEditRecords = (
  connection,
  publicKey,
  recordName,
  recordVal,
  domain
) => {
  const recordKey = getRecordKeySync(domain, recordName);

  const edit = async () => {
    const sub = Buffer.from([1]).toString() + recordName;
    const lamports = await connection.getMinimumBalanceForRentExemption(
      space,
      NameRegistryState.HEADER_LEN
    );

    const ix = await createNameRegistry(
      connection,
      sub,
      space,
      publicKey,
      lamports
    );
  };
};
