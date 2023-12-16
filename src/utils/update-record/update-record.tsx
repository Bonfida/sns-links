import {
  Record,
  getRecordV2Key,
  deleteRecordV2,
  createRecordV2Instruction,
  updateRecordV2Instruction,
  validateRecordV2Content,
  GUARDIANS,
  writRoaRecordV2,
} from "@bonfida/spl-name-service";
import {
  PublicKey,
  Transaction,
  Connection,
  TransactionInstruction,
} from "@solana/web3.js";
import { formatRecordValue } from "@/utils/formatRecordValue";
import { makeTx } from "@/utils/makeTx";
import { Toast } from "@bonfida/components";
import { checkAccountExists } from "@bonfida/hooks";
import { sleep } from "../sleep";
import { simpleValidation } from "../simple-record-validation";
import { useRecordsV2Guardians } from "@/hooks/useRecordsV2Guardian";

export const updateRecord = async (
  connection: Connection,
  recordName: Record,
  domain: string,
  recordVal: string,
  publicKey: PublicKey | null,
  signTransaction: (transaction: Transaction) => Promise<Transaction>,
  signMessage: (message: Uint8Array) => Promise<Uint8Array>,
  toast: Toast
) => {
  if (!publicKey || !signTransaction || !signMessage) return;
  try {
    const ixs: TransactionInstruction[] = [];
    const recordKey = getRecordV2Key(domain, recordName);
    const exist = await checkAccountExists(connection, recordKey);
    const formattedValue = formatRecordValue(recordVal, recordName);
    const { isRoaSupported, sendRoaRequest } =
      useRecordsV2Guardians(recordName);

    if (formattedValue === "") {
      if (!exist) return;
      // Delete the record
      ixs.push(deleteRecordV2(domain, recordName, publicKey, publicKey));
      const { signature, success } = await makeTx(
        connection,
        publicKey,
        ixs,
        signTransaction,
        toast
      );
      console.log(signature, success);
      return;
    }

    const { err } = simpleValidation(formattedValue, recordName);
    if (err) {
      return toast.error(err);
    }

    if (!exist) {
      const ix = createRecordV2Instruction(
        domain,
        recordName,
        formattedValue,
        publicKey,
        publicKey
      );
      ixs.push(ix);
    }

    ixs.push(
      ...[
        updateRecordV2Instruction(
          domain,
          recordName,
          formattedValue,
          publicKey,
          publicKey
        ),
        validateRecordV2Content(
          true,
          domain,
          recordName,
          publicKey,
          publicKey,
          publicKey
        ),
      ]
    );

    /**
     * If eligible to RoA create write ix
     */

    if (isRoaSupported && GUARDIANS.get(recordName)) {
      ixs.push(
        writRoaRecordV2(
          domain,
          recordName,
          publicKey,
          publicKey,
          GUARDIANS.get(recordName)!
        )
      );
    } else if (recordName === Record.SOL) {
      ixs.push(
        writRoaRecordV2(
          domain,
          recordName,
          publicKey,
          publicKey,
          new PublicKey(formattedValue)
        )
      );
    }

    const { signature, success } = await makeTx(
      connection,
      publicKey,
      ixs,
      signTransaction,
      toast
    );
    console.log(signature, success);
    await sleep(1_000);

    /**
     * If eligible to RoA send server request
     */
    if (isRoaSupported) {
      await sendRoaRequest(domain, recordName);
    }
  } catch (err) {
    console.error(err);
  }
};

//   if (!publicKey || !signTransaction || !signMessage) return;
//   //format value for usernames that include "@"
//   const formattedValue = formatRecordValue(
//     recordVal,
//     recordName.toLowerCase()
//   );

//   const instructions = [];
//   const sub = Buffer.from([1]).toString() + recordName;
//   const { pubkey: parentKey } = await derive(domain);
//   const recordKey = getRecordKeySync(domain, recordName);

//   const creationInstruction = async () => {
//     const lamports = await connection.getMinimumBalanceForRentExemption(
//       space + NameRegistryState.HEADER_LEN
//     );

//     let ix = await createNameRegistry(
//       connection,
//       sub,
//       space,
//       publicKey!,
//       publicKey!,
//       lamports,
//       undefined,
//       parentKey
//     );
//     return ix;
//   };

//   const deletionInstruction = async () => {
//     return deleteInstruction(
//       NAME_PROGRAM_ID,
//       recordKey,
//       publicKey!,
//       publicKey!
//     );
//   };

//   if (formattedValue === "") {
//     const { signature, success } = await makeTx(
//       connection,
//       publicKey!,
//       [await deletionInstruction()],
//       signTransaction,
//       toast
//     );
//     toast.close();
//     console.log(signature, success);
//     await sleep(1_000);
//     return;
//   }

//   // Checks for various record types
//   if (recordName === Record.SOL && !isPubkey(formattedValue)) {
//     return toast.error("The record must be a valid wallet address");
//   }

//   if (
//     USERNAME_RECORDS.includes(recordName) &&
//     recordVal.startsWith("https://")
//   ) {
//     return toast.error("The record must contain your username not a link");
//   }

//   if (recordName === Record.Url) {
//     try {
//       new URL(formattedValue);
//     } catch (err) {
//       return toast.error("Invalid URL");
//     }
//   } else if (recordName === Record.IPFS) {
//     if (!formattedValue.startsWith("ipfs://")) {
//       return toast.error("Invalid IPFS record - Must start with ipfs://");
//     }
//   } else if (recordName === Record.ARWV) {
//     if (!formattedValue.startsWith("arw://")) {
//       return toast.error("Invalid Arweave record");
//     }
//   }

//   let ser = new Buffer([]);

//   if (recordName === Record.SOL) {
//     const toSign = Buffer.concat([
//       new PublicKey(formattedValue).toBuffer(),
//       recordKey.toBuffer(),
//     ]);
//     toast.processing();
//     const encodedMessage = new TextEncoder().encode(toSign.toString("hex"));
//     const signed = await signMessage(encodedMessage);
//     ser = serializeSolRecord(
//       new PublicKey(formattedValue),
//       recordKey,
//       publicKey,
//       signed
//     );
//   } else {
//     ser = serializeRecord(formattedValue, recordName);
//   }

//   const space = ser.length;
//   const currentAccount = await connection.getAccountInfo(recordKey);

//   /**
//    * Check if record is associated with the current wallet.
//    *
//    * If YES, then user is trying to update the existing value. So we need to
//    * firstly remove old record's value, and then add it again.
//    *
//    * If NO, then we need to add record to registry.
//    */
//   const isRecordExistsInRegistry = currentAccount?.data;
//   console.log("currectAccount", currentAccount);

//   if (!isRecordExistsInRegistry) {
//     instructions.push(await creationInstruction());
//   } else {
//     const { registry } = await NameRegistryState.retrieve(
//       connection,
//       recordKey
//     );

//     if (!registry.owner.equals(publicKey)) {
//       const ix = transferInstruction(
//         NAME_PROGRAM_ID,
//         recordKey,
//         publicKey,
//         registry.owner,
//         undefined,
//         parentKey,
//         publicKey
//       );
//       instructions.push(ix);
//     }

//     const recordValueChanged =
//       currentAccount.data.length - NameRegistryState.HEADER_LEN !== space;
//     if (recordValueChanged) {
//       /**
//        * If record's value is changed, we need to remove old value and
//        * create a new value. This action is non-transactional so we need
//        * to ask user to sign deletion separately.
//        */
//       const { signature, success } = await makeTx(
//         connection,
//         publicKey,
//         [await deletionInstruction()],
//         signTransaction,
//         toast
//       );
//       toast.close();
//       console.log(signature, success);

//       instructions.push(await creationInstruction());
//     }
//   }

//   const ix = updateInstruction(
//     NAME_PROGRAM_ID,
//     recordKey,
//     new Numberu32(),
//     ser,
//     publicKey
//   );
//   instructions.push(ix);

//   const { signature, success } = await makeTx(
//     connection,
//     publicKey,
//     instructions,
//     signTransaction,
//     toast
//   );
//   console.log(signature, success);
//   await sleep(1_000);
// } catch (err) {
//   console.log(err);
// }
