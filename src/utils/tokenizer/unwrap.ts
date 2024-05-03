import { TransactionInstruction, PublicKey, Connection } from "@solana/web3.js";
import { getDomainKeySync } from "@bonfida/spl-name-service";
import {
  NAME_TOKENIZER_ID,
  NftRecord,
  MINT_PREFIX,
  withdrawTokens,
  redeemNft,
} from "@bonfida/name-tokenizer";
import {
  TOKEN_PROGRAM_ID,
  AccountLayout,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createCloseAccountInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { redeemSol } from "./redeem-sol";
import { checkAccountExists } from "@bonfida/hooks";

export const unwrap = async (
  connection: Connection,
  domain: string,
  publicKey: PublicKey
) => {
  const instructions: TransactionInstruction[] = [];
  const { pubkey } = getDomainKeySync(domain);
  const [recordKey] = await NftRecord.findKey(pubkey, NAME_TOKENIZER_ID);
  const [mint] = await PublicKey.findProgramAddress(
    [MINT_PREFIX, pubkey.toBuffer()],
    NAME_TOKENIZER_ID
  );

  const recordTokenAccounts = await connection.getTokenAccountsByOwner(
    recordKey,
    { programId: TOKEN_PROGRAM_ID }
  );

  for (let tokenAcc of recordTokenAccounts.value) {
    const des = AccountLayout.decode(tokenAcc.account.data);
    const ata = await getAssociatedTokenAddress(des.mint, publicKey);
    if (!(await checkAccountExists(connection, ata))) {
      const ix = createAssociatedTokenAccountInstruction(
        publicKey,
        ata,
        publicKey,
        des.mint
      );
      instructions.push(ix);
    }
    const ix = await withdrawTokens(
      mint,
      des.mint,
      publicKey,
      recordKey,
      NAME_TOKENIZER_ID
    );
    instructions.push(...ix);
  }
  const withdrawNativeSol = await redeemSol(
    connection,
    recordKey,
    publicKey,
    recordTokenAccounts.value.length,
    mint
  );
  instructions.push(...withdrawNativeSol);

  const ix = await redeemNft(pubkey, publicKey, NAME_TOKENIZER_ID);
  instructions.push(...ix);

  // Close token account
  const ata = getAssociatedTokenAddressSync(mint, publicKey);
  const ix_close = createCloseAccountInstruction(ata, publicKey, publicKey);
  instructions.push(ix_close);

  return instructions;
};
