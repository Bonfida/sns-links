/**
 * We keep things simple for now with a fixed priority fee
 *
 * The following URL https://docs.helius.dev/solana-rpc-nodes/alpha-priority-fee-api
 * contains a lot of useful information for dynamic pricing if we need to improve the computation logic
 *
 */

import {
  AddressLookupTableAccount,
  Blockhash,
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

export const COMPUTE_IX = ComputeBudgetProgram.setComputeUnitPrice({
  microLamports: 3_000,
});

const MAX_TX_CU = 1_400_000;

// Used for tx size computation only
export const DUMMY_COMPUTE_CU = ComputeBudgetProgram.setComputeUnitLimit({
  units: MAX_TX_CU,
});

export const getCuUsage = async (
  connection: Connection,
  instructions: TransactionInstruction[],
  feePayer: PublicKey,
  blockhash: Blockhash,
  lookupTable: AddressLookupTableAccount | null
) => {
  const msgV0 = new TransactionMessage({
    payerKey: feePayer,
    recentBlockhash: blockhash,
    instructions: [DUMMY_COMPUTE_CU, COMPUTE_IX, ...instructions],
  }).compileToV0Message(lookupTable ? [lookupTable] : undefined);
  const tx = new VersionedTransaction(msgV0);
  const { value } = await connection.simulateTransaction(tx, {
    sigVerify: false,
    replaceRecentBlockhash: true,
  });

  if (value.err === null && value.unitsConsumed) {
    return ComputeBudgetProgram.setComputeUnitLimit({
      // For registrations the execution might differ between the simulation
      // and when the tx is processed because of Pyth price feed state so we request a bit more
      units: value.unitsConsumed! * 1.1,
    });
  }

  return undefined;
};
