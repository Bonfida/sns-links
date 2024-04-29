import {
  AddressLookupTableAccount,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { COMPUTE_IX, DUMMY_COMPUTE_CU } from "./priority-fee";

const MAX = 1_232;

export const chunkIx = (
  instructions: TransactionInstruction[],
  buyer: PublicKey,
  lookupTable: AddressLookupTableAccount | null,
  blockhash = "48tzUutUCPDohF4YqFpX9dHHS43V1bn9R45LHEFVhbtq",
  offset = 0
) => {
  const result: TransactionInstruction[][] = [];
  let temp: TransactionInstruction[] = [];

  for (let ix of instructions) {
    const size = getSize([...temp, ix], buyer, lookupTable, blockhash);
    if (size > MAX - offset) {
      result.push(temp);
      temp = [ix];
    } else {
      temp.push(ix);
    }
  }

  if (temp.length > 0) {
    result.push(temp);
  }

  return result;
};

const getSize = (
  instructions: TransactionInstruction[],
  buyer: PublicKey,
  lookupTable: AddressLookupTableAccount | null,
  blockhash = "48tzUutUCPDohF4YqFpX9dHHS43V1bn9R45LHEFVhbtq"
) => {
  try {
    const msgV0 = new TransactionMessage({
      payerKey: buyer,
      recentBlockhash: blockhash,
      instructions: [DUMMY_COMPUTE_CU, COMPUTE_IX, ...instructions],
    }).compileToV0Message(lookupTable ? [lookupTable] : undefined);
    const tx = new VersionedTransaction(msgV0);
    return tx.serialize().length;
  } catch (err) {
    return MAX + 1;
  }
};
