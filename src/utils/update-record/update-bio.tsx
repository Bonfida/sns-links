import {
  NameRegistryState,
  getDomainKeySync,
  reallocInstruction,
  NAME_PROGRAM_ID,
  Numberu32,
  updateInstruction,
} from "@bonfida/spl-name-service";
import {
  SystemProgram,
  Transaction,
  Connection,
  PublicKey,
} from "@solana/web3.js";
import { Toast } from "@bonfida/components";
import { sleep } from "../sleep";
import { sendRawTransaction } from "../../utils/send-raw-transaction/send-raw-transaction";

export const updateBio = async (
  connection: Connection,
  publicKey: PublicKey,
  domain: string,
  text: string,
  signAllTransactions: (transaction: Transaction[]) => Promise<Transaction[]>,
  toast: Toast
) => {
  if (!signAllTransactions) return;
  if (!publicKey) return;

  toast.processing();

  try {
    let length: undefined | number = undefined;
    const { pubkey } = getDomainKeySync(domain);
    const info = await connection.getAccountInfo(pubkey);

    if (!info) {
      return toast.error("Domain does not exist");
    }

    length = info.data.length - NameRegistryState.HEADER_LEN;

    const buffer = Buffer.from(text);
    const max_buf = 1_000;
    const n = buffer.length;
    const q = Math.floor(n / max_buf);

    let transactions: Transaction[] = [];

    // Resize if needed
    if (length !== buffer.length) {
      const ix = reallocInstruction(
        NAME_PROGRAM_ID,
        SystemProgram.programId,
        publicKey,
        pubkey,
        publicKey,
        //@ts-ignore
        new Numberu32(buffer.length)
      );
      transactions.push(new Transaction().add(ix));
    }

    for (let i = 0; i < q + 1; i++) {
      const ix = updateInstruction(
        NAME_PROGRAM_ID,
        pubkey,
        //@ts-ignore
        new Numberu32(i * max_buf),
        buffer.slice(max_buf * i, max_buf * (1 + i)),
        publicKey
      );
      const tx = new Transaction().add(ix);
      transactions.push(tx);
    }

    const { blockhash } = await connection.getLatestBlockhash();
    transactions.forEach((e) => {
      e.recentBlockhash = blockhash;
      e.feePayer = publicKey;
    });

    let idx = 0;
    const len = transactions.length;

    const signed = await signAllTransactions(transactions);
    for (let signedTransaction of signed) {
      idx += 1;
      console.log(`Sending ${idx}/${len}`);
      const txid = await sendRawTransaction(connection, signedTransaction);
      console.log("txid", txid);
      await connection.confirmTransaction(txid, "processed");
    }

    toast.success("all");
    await sleep(800);
  } catch (err) {
    console.log(err);
    toast.error("Transaction failed \n Refresh the page before trying agin");
    await sleep(800);
  }
};
