import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { updateRecord } from "@/utils/update-record/update-record";
import { useToastContext } from "@bonfida/components";
import { Record } from "@bonfida/spl-name-service";
import { checkIsOwner } from "@/utils/owner/checkIsOwner";
import { useFetchOwner } from "@/hooks/useFetchOwner";
import { useDomainsInfo } from "@/hooks/useDomainsInfo";
import { updateBio } from "../../utils/update-record/update-bio";

const Bio = ({ domain }: { domain: string }) => {
  const { data: domainInfo, keys } = useDomainsInfo([domain]);
  const domainKey = keys.find((e) => e.domain === domain)?.pubkey;
  const { connection } = useConnection();
  const { toast } = useToastContext();
  const { publicKey, signAllTransactions, signMessage, connected } =
    useWallet();

  const content =
    domainKey &&
    domainInfo
      ?.get(domainKey.toBase58())
      ?.data?.toString()
      .trimStart()
      .trimEnd();

  const { data: owner, isLoading: ownerLoading } = useFetchOwner(
    connection,
    domain
  );

  const [editMode, setEditMode] = useState(false);
  const [bioText, setBioText] = useState("");
  const [refresh, setRefresh] = useState(false);
  const bioPlaceholder = !connected ? "My bio..." : "Add a bio...";

  useEffect(() => {
    if (content) {
      setBioText(content);
    }
  }, [domainInfo]);

  const toggleEdit = () => {
    setEditMode(!editMode);
    if (editMode) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (editMode) {
      updateBio(
        connection,
        publicKey!,
        domain,
        bioText,
        signAllTransactions!,
        toast
      );
      setRefresh(true);
    }
  };

  return (
    <form
      method="post"
      className="flex flex-col md:w-[420px] w-[300px] mt-6 overflow-y-auto no-scrollbar "
    >
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
