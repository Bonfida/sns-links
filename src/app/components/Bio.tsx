import { useState, useEffect } from "react";
import { useFetchRecords } from "@/hooks/useFetchRecords";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { updateRecord } from "@/utils/update-record/update-record";
import { useToastContext } from "@bonfida/components";
import { Record } from "@bonfida/spl-name-service";
import { checkIsOwner } from "@/utils/owner/checkIsOwner";
import { useFetchOwner } from "@/hooks/useFetchOwner";

const Bio = ({ domain }: { domain: string }) => {
  const { connection } = useConnection();
  const { toast } = useToastContext();
  const { publicKey, signTransaction, signMessage, connected } = useWallet();
  const { data: recordsData, isLoading: recordsLoading } = useFetchRecords(
    connection,
    domain
  );

  const { data: owner, isLoading: ownerLoading } = useFetchOwner(
    connection,
    domain
  );

  const [editMode, setEditMode] = useState(false);
  const [bioText, setBioText] = useState("");
  const [refresh, setRefresh] = useState(false);
  const bioPlaceholder = !connected ? "My bio..." : "Add a bio...";

  useEffect(() => {
    if (!recordsLoading && recordsData?.bio) {
      setBioText(recordsData?.bio);
    }
  }, [recordsData]);

  const toggleEdit = () => {
    setEditMode(!editMode);
    if (editMode) {
      handleSubmit();
    }
  };

  function handleSubmit() {
    if (editMode) {
      updateRecord(
        connection,
        Record.TXT,
        domain,
        bioText,
        publicKey,
        signTransaction!,
        signMessage!,
        toast
      );
      setRefresh(true);
    }
  }

  return (
    <form method="post" className="flex flex-col mt-6">
      <textarea
        name="postContent"
        placeholder={bioPlaceholder}
        value={bioText}
        onChange={(e) => setBioText(e.target.value)}
        rows={3}
        cols={45}
        className="text-white rounded-xl bg-inherit"
        readOnly={!editMode}
        maxLength={250}
      />
      {connected && checkIsOwner(owner, publicKey) && (
        <div className="flex justify-between items-center">
          <div className="text-sm">{`${bioText.length}/${250} characters`}</div>
          {connected && checkIsOwner(owner, publicKey) && (
            <button
              className="flex self-center"
              type="button"
              onClick={toggleEdit}
            >
              {editMode ? "Save" : "Edit"}
            </button>
          )}
        </div>
      )}
    </form>
  );
};

export default Bio;
