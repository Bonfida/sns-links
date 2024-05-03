import {
  Connection,
  PublicKey,
  TransactionInstruction,
  Transaction,
  Signer,
  Commitment,
  VersionedTransaction,
  TransactionMessage,
} from "@solana/web3.js";
import { sleep } from "../sleep";
import { sendRawTransaction } from "../send-raw-transaction";
import { getConnection } from "./getConnection";
import { chunkIx } from "../chunk-ix";
import { COMPUTE_IX, getCuUsage } from "./priority-fee";
import { SnsClientError } from "../errors";

export const LOOKUP_TABLE = new PublicKey(
  "4j2dBsgjSGJGYSGy7PaZn8Xr9zH2EFqXjMjkpCh1DYEU"
);

type TransactionType = Transaction | VersionedTransaction;

export type makeTxParams = {
  connection: Connection;
  feePayer: PublicKey;
  signAllTransactions: (txs: TransactionType[]) => Promise<TransactionType[]>;
  signers?: Signer[];
  skipPreflight?: boolean;
  confirmCommitment?: Commitment;
  /**
   * If any transaction fails, `failedTransactionsStrategy` defines how it will be handled.
   *
   * "throwOnFail" – it will throw an error immediately if any transaction fails.
   * It will also store the result of previous transactions.
   *
   * "accumulateResults" it won't throw any error if any transaction fails,
   * but will store the error to the results array. It means that `await makeTxV2`
   * will be resolved successfully.
   */
  failedTransactionsStrategy?: "throwOnFail" | "accumulateResults";
} & ( // Either `instructions` or `transactions` is allowed, but not both
  | { instructions: TransactionInstruction[]; transactions?: never }
  | { instructions?: never; transactions: TransactionType[] }
);

export interface SendTransactionResult {
  signature: string | null;
  error?: MakeTransactionError;
  success: boolean;
}

export class MakeTransactionError extends SnsClientError {
  results?: SendTransactionResult[];

  constructor({
    message,
    cause,
    results,
  }: {
    message: string;
    cause?: any;
    results?: SendTransactionResult[];
  }) {
    super(message, cause);

    this.results = results;
  }
}

/**
 * This is a universal utility to send transactions. It automatically chunks
 * instructions into multiple transactions if needed. It also allows to use two
 * different strategies for errors using `failedTransactionsStrategy` param (see
 * type definition for more details).
 *
 * @example
 * // Basic example of how to use it in components with `throwOnFail` strategy
 *
 * try {
 *    // open "Loading" toast manually
 *    toast.processing()
 *    // load this util dynamically for better JS chunking
 *    const { makeTxV2 } = await import("utils/send-tx/make-tx-v2");
 *
 *    const results = await makeTxV2({
 *      connection,
 *      feePayer: publicKey,
 *      instructions: cancelIxs,
 *      signAllTransactions,
 *    });
 *
 *    if (results.length === 1) {
 *      toast.success(results[0].signature);
 *    } else if (results.length > 1) {
 *      // or you can define some `toast.custom` to show signatures of all
 *      // transactions
 *      toast.success("all");
 *    }
 * } catch (err) {
 *    process({ err, toast })
 * }
 *
 * @example
 * // Basic example of how to use it in components with `accumulateResults` strategy
 *
 * try {
 *    // open "Loading" toast manually
 *    toast.processing()
 *    // load this util dynamically for better JS chunking
 *    const { makeTxV2 } = await import("utils/send-tx/make-tx-v2");
 *
 *    const results = await makeTxV2({
 *      connection,
 *      feePayer: publicKey,
 *      instructions: cancelIxs,
 *      signAllTransactions,
 *      failedTransactionsStrategy: "accumulateResults",
 *    });
 *
 *    // If some error occurs, `results` will still be resolved with stored errors
 *
 *    if (results.some(i => i.error)) {
 *      // handle error per transaction
 *    }
 * } catch (err) {
 *    process({ err, toast })
 * }
 *
 */
export const makeTxV2 = async ({
  connection,
  feePayer,
  instructions,
  signAllTransactions,
  transactions,
  signers = [],
  skipPreflight = false,
  confirmCommitment = "processed",
  failedTransactionsStrategy = "throwOnFail",
}: makeTxParams) => {
  const results: SendTransactionResult[] = [];

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();

  const txs =
    transactions ??
    (await createTransactions({
      connection,
      feePayer,
      instructions,
      blockhash,
    }));

  const signedTxs = await signAllTransactions(
    signTransactionWithSigners({ txs, signers })
  );

  for (let i = 0; i < signedTxs.length; i++) {
    const signedTx = signedTxs[i];
    let sig: string | null = null;

    try {
      console.info(`Sending ${i + 1}/${signedTxs.length}`);

      sig = await attemptTransactionSend({
        connection,
        signedTx,
        skipPreflight,
        confirmCommitment,
        blockhash,
        lastValidBlockHeight,
      });

      results.push({ signature: sig, success: true });
    } catch (_err) {
      let baseError = _err as any;

      // We still keep throwing `RetryTransactionSendError` for better
      // understanding of error's source
      let errMessage = baseError.message || "";

      let message = `Unexpected error`;

      // Don't use `getKnownErrorMessage` here because this utility is only
      // responsible for cathing expected errors. Any unexpected error is
      // thrown above and must be handled accordingly by the higher level.
      if (errMessage.includes("not found")) {
        message = `Solana network is unstable - Try again`;
      } else if (
        errMessage.includes("User rejected the request") ||
        errMessage.includes("Approval Denied")
      ) {
        message = `Transaction cancelled`;
      } else if (errMessage.includes("Transfer: insufficient lamports")) {
        message = `Not enough SOL`;
      } else if (
        errMessage.includes("was not confirmed") ||
        errMessage.includes("has already been processed")
      ) {
        if (sig) {
          console.info("Tx was not confirmed in 30s, refetching...");
          await sleep(1_000);
          const CONFIRMED_CONNECTION = getConnection();
          const result = await CONFIRMED_CONNECTION.getTransaction(sig, {
            maxSupportedTransactionVersion: 1,
          });
          if (!!result?.meta && !result.meta.err) {
            results.push({ signature: sig, success: true });
            // Skip all the code below and move to the next iteration
            continue;
          }
        }
        // If unable to refetch transaction, throw an error
        message = `Solana network is congested, the validator was unable to confirm that your transaction was succesful. Please inspect the transaction on the explorer`;
      }

      // Depending on the strategy, simply store the error and continue
      // transactions executing, or throw the error and stop the loop
      if (failedTransactionsStrategy === "accumulateResults") {
        results.push({
          signature: sig,
          error: new MakeTransactionError({ message, cause: baseError }),
          success: false,
        });
      } else if (failedTransactionsStrategy === "throwOnFail") {
        throw new MakeTransactionError({ message, cause: baseError });
      }
    }
  }

  return results;
};

function signTransactionWithSigners({
  txs,
  signers,
}: {
  txs: TransactionType[];
  signers: Signer[];
}) {
  if (!signers.length) return txs;

  txs.forEach((tx) => {
    if (tx instanceof Transaction) {
      tx.sign(...signers);
    } else if (tx instanceof VersionedTransaction) {
      tx.sign(signers);
    }
  });

  return txs;
}

async function createTransactions({
  connection,
  feePayer,
  instructions,
  blockhash,
}: {
  connection: makeTxParams["connection"];
  feePayer: makeTxParams["feePayer"];
  instructions: NonNullable<makeTxParams["instructions"]>;
  blockhash: string;
}) {
  const lookUpTable = await connection.getAddressLookupTable(LOOKUP_TABLE);

  const chunks = chunkIx(instructions, feePayer, lookUpTable.value);

  const transactions: VersionedTransaction[] = [];
  for (let chunk of chunks) {
    const cu = await getCuUsage(
      connection,
      chunk,
      feePayer,
      blockhash,
      lookUpTable.value
    );
    const instructions = [...chunk];
    instructions.unshift(COMPUTE_IX);
    cu && instructions.unshift(cu);
    const msg = new TransactionMessage({
      payerKey: feePayer,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message(lookUpTable.value ? [lookUpTable.value] : undefined);
    transactions.push(new VersionedTransaction(msg));
  }

  return transactions;
}

class RetryTransactionSendError extends SnsClientError {
  constructor({
    message,
    cause,
    retries = 3,
  }: { message?: string; cause?: Error; retries?: number } = {}) {
    super(message ?? `Error sending tx after ${retries} retries.`, cause);
  }
}

async function attemptTransactionSend({
  connection,
  signedTx,
  skipPreflight,
  confirmCommitment,
  blockhash,
  lastValidBlockHeight,
  // Number of retries
  retries = 3,
  // Delay between retries in milliseconds
  retryDelay = 1000,
}: {
  connection: Connection;
  signedTx: TransactionType;
  skipPreflight: boolean;
  confirmCommitment: Commitment;
  blockhash: string;
  lastValidBlockHeight: number;
  retries?: number;
  retryDelay?: number;
}) {
  let attempt = 0;
  let lastError;

  while (attempt < retries) {
    try {
      const sig = await sendRawTransaction(
        connection,
        signedTx,
        skipPreflight,
        confirmCommitment
      );
      await connection.confirmTransaction(
        {
          blockhash,
          signature: sig,
          lastValidBlockHeight,
        },
        confirmCommitment
      );
      return sig; // Successful transaction
    } catch (error) {
      lastError = error;
      attempt++;
      if (attempt < retries) {
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }

  // Throw the last error after all retries failed
  throw new RetryTransactionSendError({ cause: lastError as Error, retries });
}
