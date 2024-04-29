import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useToastContext } from "@bonfida/components";
import { checkIsOwner } from "@/utils/owner/checkIsOwner";
import { useFetchOwner } from "@/hooks/useFetchOwner";
import { useDomainsInfo } from "@/hooks/useDomainsInfo";
import { updateBio } from "../../../utils/update-record/update-bio";
import { isTokenized } from "../../../utils/tokenizer/isTokenized";
import UnwrapModal from "../Modals/UnwrapModal";
import { useFetchBio } from "@/hooks/useFetchBio";
import { useQueryClient } from "react-query";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

const Bio = ({ domain }: { domain: string }) => {
  const { connection } = useConnection();
  const { toast } = useToastContext();
  const [isToken, setIsToken] = useState(false);
  const { publicKey, signAllTransactions, signMessage, connected } =
    useWallet();
  const [bioEditMode, setBioEditMode] = useState(false);
  const [bioText, setBioText] = useState("");
  const [refresh, setRefresh] = useState(false);

  const { data: bio, isLoading: bioLoading } = useFetchBio(domain);
  const bioPlaceholder = !connected
    ? "My bio..."
    : bioLoading
    ? "Loading bio..."
    : "Add a bio...";
  const [isModalVisible, setModalVisible] = useState(false);
  const queryClient = useQueryClient();

  const { data: owner, isLoading: ownerLoading } = useFetchOwner(
    connection,
    domain
  );

  useEffect(() => {
    if (!bioLoading && bio?.length !== 0) {
      setBioText(bio!);
    }
  }, [bio, bioLoading]);

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

  const handleSubmit = async () => {
    if (bioEditMode) {
      if (bioText == bio) {
        toast.error("Nothing to update");
      } else {
        await updateBio(
          connection,
          publicKey!,
          domain,
          bioText,
          signAllTransactions!,
          toast
        );
      }
      queryClient.invalidateQueries(["bio", domain]);
      setBioEditMode(false);
    }
  };

  return (
    <form
      method="post"
      className="flex flex-col mt-6 overflow-y-auto no-scrollbar "
    >
      <div className="flex justify-between">
        <span className="text-bio-placeholder-text text-sm">Bio</span>
        <div className="flex gap-2">
          {bioEditMode && (
            <button
              className="text-link text-sm"
              type="button"
              onClick={() => setBioEditMode(false)}
            >
              <Image
                src="/cancel/red-x.svg"
                height={15}
                width={15}
                alt="cancel"
              />
            </button>
          )}
          <button
            className="flex self-center text-link text-sm"
            type="button"
            onClick={toggleEdit}
          >
            {bioEditMode && !isToken ? (
              <Image
                src="/confirm/green-check.svg"
                width={19.51}
                height={14.25}
                alt="confirm"
              />
            ) : (
              "Edit"
            )}
          </button>
        </div>
      </div>

      {bioEditMode ? (
        <>
          <textarea
            name="postContent"
            placeholder={bioPlaceholder}
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            rows={3}
            cols={45}
            className="rounded-2xl  py-2 px-3 bg-search-input-bg text-search-input-text border-bio-edit-border"
            readOnly={!isToken ? !bioEditMode : bioEditMode}
            maxLength={250}
          />
          <div className="flex justify-between items-center">
            <div className="text-sm text-bio-placeholder-text">{`${
              bioText?.length || "0"
            }/250 characters`}</div>
          </div>
        </>
      ) : (
        <div className="h-[33px]">
          <span className="bg-inherit text-bio-text">{bioText}</span>
        </div>
      )}

      {bioEditMode && isToken && (
        <UnwrapModal domain={domain} close={() => setModalVisible(false)} />
      )}
    </form>
  );
};

export default Bio;
