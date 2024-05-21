import {
  Transaction,
  Connection,
  Commitment,
  VersionedTransaction,
} from "@solana/web3.js";
import { sleep } from "@bonfida/hooks";
import base58 from "bs58";
const HELIUS_RPC = process.env.NEXT_PUBLIC_ENDPOINT;

export const JITO_ENGINE =
  "https://mainnet.block-engine.jito.wtf/api/v1/transactions";

const MAX_RETRIES = 10;
const RETRY_SLEEP_MS = 300;

const encodeSignature = (tx: Transaction | VersionedTransaction): string => {
  if ("version" in tx) {
    return base58.encode(tx.signatures[0]);
  } else {
    // Tx  are always signed before being sent
    return base58.encode(tx.signature!);
  }
};

const toError = (err: any): Error => {
  if (err instanceof Error) {
    return err;
  } else {
    return new Error(String(err));
  }
};

const send = async (
  connection: Connection,
  tx: Transaction | VersionedTransaction,
  skipPreflight: boolean,
  preflightCommitment: Commitment
): Promise<string> => {
  let success = false;
  let attempts = 0;
  let error: Error | null = null;
  let result: string | null = null;

  while (!success && attempts < MAX_RETRIES) {
    attempts += 1;
    try {
      const sig = await connection.sendRawTransaction(tx.serialize(), {
        skipPreflight,
        preflightCommitment,
      });
      success = true;
      result = sig;
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("already been processed")) {
          console.log("Transaction already processed.");
          success = true;
          result = encodeSignature(tx);
        } else if (
          // We have tried so many times that the blockhash expired
          err.message.includes(
            "Transaction simulation failed: Blockhash not found"
          )
        ) {
          error = toError(err);
          break;
        } else {
          console.log(
            `Retrying sending transaction due to error: ${JSON.stringify(err)}`
          );
          error = toError(err);
          await sleep(RETRY_SLEEP_MS);
        }
      }
    }
  }

  if (result) return result;

  throw error || new Error("Error sending batch transaction");
};

export const sendRawTransaction = async (
  connection: Connection,
  tx: Transaction | VersionedTransaction,
  skipPreflight = false,
  preflightCommitment: Commitment = "processed"
): Promise<string> => {
  const connections = [
    connection,
    new Connection(HELIUS_RPC!),
    new Connection(JITO_ENGINE),
  ];
  return Promise.race(
    connections.map((c) => send(c, tx, skipPreflight, preflightCommitment))
  );
};
