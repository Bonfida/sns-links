export const EVM_RECORDS = [Record.ETH, Record.BSC, Record.Injective];
import {
  Record,
  resolve,
  validateRecordV2Content,
} from "@bonfida/spl-name-service";
import { TransactionType, makeTxV2 } from "../make-tx-v2/makeTx";
import { Connection, PublicKey } from "@solana/web3.js";

export const updateROAHandler = async ({
  connection,
  publicKey,
  domain,
  record,
  signAllTransactions,
}: {
  connection: Connection;
  publicKey: PublicKey;
  domain: string;
  record: Record;
  signAllTransactions: (txs: TransactionType[]) => Promise<TransactionType[]>;
}) => {
  try {
    const owner = await resolve(connection, domain);
    const ix = validateRecordV2Content(
      false,
      domain,
      record,
      owner,
      publicKey,
      publicKey
    );
    const results = await makeTxV2({
      connection,
      feePayer: publicKey,
      instructions: [ix],
      signAllTransactions,
    });
    console.log(results);
  } catch (err) {
    throw new Error();
  }
};
