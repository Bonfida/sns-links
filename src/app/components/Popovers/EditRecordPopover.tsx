import { useRef } from "react";
import * as Popover from "@radix-ui/react-popover";
import { GearIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Record } from "@bonfida/spl-name-service";
import { isTokenized } from "@/utils/tokenizer/isTokenized";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { updateRecord } from "@/utils/update-record/update-record";
import { useToastContext } from "@bonfida/components";

const EditRecordPopover = ({
  setIsEditingRecord,
  isEditingRecord,
  setIsToken,
  setEditingRecordName,
  recordName,
  domain,
  connection,
  publicKey,
  signMessage,
  signTransaction,
  recordValue,
}: {
  setIsEditingRecord: (isEditing: boolean) => void;
  isEditingRecord: boolean;
  setIsToken: (isToken: boolean) => void;
  setEditingRecordName: (recordName: Record) => void;
  recordName: string;
  domain: string;
  connection: Connection;
  publicKey: PublicKey;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signMessage: (message: Uint8Array) => Promise<Uint8Array>;
  recordValue: string;
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToastContext();

  const handleEdit = async () => {
    closeRef.current?.click();
    const isToken = await isTokenized(domain, connection, publicKey!);

    if (!isEditingRecord) {
      setIsEditingRecord(true);
      if (isToken) {
        setIsToken(true);
      } else {
        setEditingRecordName(recordName as Record);
      }
    } else {
      setIsEditingRecord(false);
    }
  };

  const handleDeleteClick = async () => {
    try {
      await updateRecord(
        connection,
        recordName as Record,
        domain,
        "",
        publicKey,
        signTransaction!,
        signMessage!,
        toast
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to update record:", error);
        toast.error(`Failed to update record: ${error.message}`);
      } else {
        console.error("An unknown error occurred:", error);
        toast.error("Failed to update record: An unknown error occurred");
      }
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="rounded-full w-[35px] h-[35px] inline-flex items-center justify-center text-violet11 bg-[#03001A] "
          aria-label="Update dimensions"
        >
          <GearIcon />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="p-5 w-[200px] bg-[#03001A] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade rounded-xl"
          sideOffset={5}
        >
          <div className="flex flex-col gap-2.5">
            <p className=" text-base leading-[19px] font-medium mb-2.5 text-center ">
              Update
            </p>
            <button
              onClick={handleEdit}
              className="py-2 px-.5 bg-[#7C7CFF] rounded-xl text-slate-200"
            >
              Edit
            </button>
            {recordValue && (
              <button
                onClick={handleDeleteClick}
                className="py-2 px-.5 bg-red-600 rounded-xl text-slate-200"
              >
                Delete
              </button>
            )}
          </div>
          <Popover.Close
            className="rounded-full h-[25px] w-[25px] inline-flex items-center justify-center text-violet11 absolute top-[5px] right-[5px] hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 outline-none cursor-default"
            aria-label="Close"
            ref={closeRef}
          >
            <Cross2Icon />
          </Popover.Close>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default EditRecordPopover;
