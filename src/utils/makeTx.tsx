import {
  Connection,
  PublicKey,
  TransactionInstruction,
  Transaction,
  Signer,
} from "@solana/web3.js";
import { sleep } from "./sleep";
import { retry } from "./retry";
import { Toast } from "@bonfida/components";
import { getConnection } from "./getConnection";

export const makeTx = async (
  connection: Connection,
  feePayer: PublicKey,
  instructions: TransactionInstruction[],
  signTransaction: (tx: Transaction) => Promise<Transaction>,
  toast: Toast,
  transaction?: Transaction,
  signers?: Signer[],
  skipPreflight = false
) => {
  console.log("maketxfire");
  let sig: string | undefined = undefined;

  try {
    toast.processing();
    const { blockhash } = await connection.getLatestBlockhash();
    const tx = transaction ? transaction : new Transaction();

    if (!transaction) {
      tx.add(...instructions);
      tx.feePayer = feePayer;
      tx.recentBlockhash = blockhash;
    }

    if (signers && signers.length > 0) {
      tx.sign(...signers);
    }

    const signedTx = await signTransaction(tx);

    // Retrying
    sig = await retry(async () => {
      sig = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(sig, "processed");
      return sig;
    });

    toast.success(sig);
    return { success: true, signature: sig };
  } catch (err) {
    console.log(err);

    if (err instanceof Error) {
      const message = err.message;

      if (message.includes("Transaction cancelled")) {
        toast.close();
      } else if (message.includes("not found")) {
        toast.error("Solana network is unstable - Try again");
      } else if (
        message.includes("was not confirmed") ||
        message.includes("has already been processed")
      ) {
        if (sig) {
          console.log("Tx was not confirmed in 30s, refetching...");
          await sleep(1_000);
          const CONFIRMED_CONNECTION = getConnection();
          const result = await CONFIRMED_CONNECTION.getTransaction(sig, {
            maxSupportedTransactionVersion: 1,
          });

          if (!!result?.meta && !result.meta.err) {
            toast.success(sig);
            return { success: true, signature: sig };
          }
        }
        toast.error(
          "Solana network is congested, the validator was unable to confirm that your transaction was succesful. Please inspect the transaction on the explorer"
        );
      } else {
        toast.error();
      }
    }
    return { success: false };
  }
};
