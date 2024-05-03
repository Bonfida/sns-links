import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  NATIVE_MINT,
} from "@solana/spl-token";
import { withdrawTokens, NAME_TOKENIZER_ID } from "@bonfida/name-tokenizer";
import { checkAccountExists } from "@bonfida/hooks";

export const redeemSol = async (
  connection: Connection,
  recordKey: PublicKey,
  publicKey: PublicKey,
  tokenAccountLen: number,
  nftMint: PublicKey
) => {
  const instructions: TransactionInstruction[] = [];
  const recordInfo = await connection.getAccountInfo(recordKey);
  if (!recordInfo) {
    throw new Error("Record info not found");
  }
  const minRent = await connection.getMinimumBalanceForRentExemption(
    recordInfo?.data.length
  );
  if (
    recordInfo.lamports > minRent &&
    tokenAccountLen === 0 // If > 0 the native SOL will be withdrawn in another ix
  ) {
    const ataDestination = await getAssociatedTokenAddress(
      NATIVE_MINT,
      publicKey
    );
    if (!(await checkAccountExists(connection, ataDestination))) {
      instructions.push(
        createAssociatedTokenAccountInstruction(
          publicKey,
          ataDestination,
          publicKey,
          NATIVE_MINT
        )
      );
    }
    const ataSource = await getAssociatedTokenAddress(
      NATIVE_MINT,
      recordKey,
      true
    );
    const createAta = createAssociatedTokenAccountInstruction(
      publicKey,
      ataSource,
      recordKey,
      NATIVE_MINT
    );
    const withdrawIx = await withdrawTokens(
      nftMint,
      NATIVE_MINT,
      publicKey,
      recordKey,
      NAME_TOKENIZER_ID
    );
    instructions.push(createAta, ...withdrawIx);
  }
  return instructions;
};
