import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { updateRecord } from "@/utils/update-record/update-record";
import { useToastContext } from "@bonfida/components";
import { Record } from "@bonfida/spl-name-service";
import { checkIsOwner } from "@/utils/owner/checkIsOwner";
import { useFetchOwner } from "@/hooks/useFetchOwner";
import { useDomainsInfo } from "@/hooks/useDomainsInfo";
import { updateBio } from "../../utils/update-record/update-bio";
import { isTokenized } from "../../utils/tokenizer/isTokenized";
import UnwrapModal from "./UnwrapModal";

const Bio = ({ domain }: { domain: string }) => {
  const { data: domainInfo, keys } = useDomainsInfo([domain]);
  const domainKey = keys.find((e) => e.domain === domain)?.pubkey;
  const { connection } = useConnection();
  const { toast } = useToastContext();
  const [isToken, setIsToken] = useState(false);
  const { publicKey, signAllTransactions, signMessage, connected } =
    useWallet();
  const [bioEditMode, setBioEditMode] = useState(false);
  const [bioText, setBioText] = useState("");
  const [refresh, setRefresh] = useState(false);
  const bioPlaceholder = !connected ? "My bio..." : "Add a bio...";

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

  useEffect(() => {
    if (content) {
      setBioText(content);
    }
  }, [domainInfo]);

  const toggleEdit = async () => {
    const isToken = await isTokenized(domain!, connection, publicKey!);
    if (!bioEditMode) {
      setBioEditMode(true);
    }
    if (isToken) {
      setIsToken(true);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (bioEditMode) {
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
        readOnly={!bioEditMode}
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
              {bioEditMode ? "Save" : "Edit"}
            </button>
          )}
        </div>
      )}
      {bioEditMode && isToken && <UnwrapModal domain={domain} />}
    </form>
  );
};

export default Bio;
