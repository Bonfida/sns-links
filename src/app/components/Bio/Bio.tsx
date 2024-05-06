import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { GenericLoading, useToastContext } from "@bonfida/components";
import { useFetchOwner } from "@/hooks/useFetchOwner";
import { updateBio } from "../../../utils/update-record/update-bio";
import UnwrapModal from "../Modals/UnwrapModal";
import { useFetchBio } from "@/hooks/useFetchBio";
import { useQueryClient } from "react-query";
import Image from "next/image";
import { ButtonModal } from "../ButtonModal";
import { useIsTokenized } from "@/hooks/useIsTokenized";

const Bio = ({ domain }: { domain: string }) => {
  const { connection } = useConnection();
  const { toast } = useToastContext();
  const { publicKey, signAllTransactions, signMessage, connected } =
    useWallet();
  const [bioEditMode, setBioEditMode] = useState(false);
  const { data: bio, isLoading: bioLoading } = useFetchBio(domain);
  const [bioText, setBioText] = useState("");

  useEffect(() => {
    if (!bioLoading && bio && bio?.length !== 0) {
      setBioText(bio);
    }
  }, [bio, bioLoading]);

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

  const isOwner = owner === publicKey?.toBase58();
  const { data: isToken } = useIsTokenized(domain);
  const refreshIsToken = queryClient.invalidateQueries(["isTokenized", domain]);

  const handleSubmit = async () => {
    if (!publicKey || !signAllTransactions) return;
    if (bioText == bio || bioText?.length === 0) {
      toast.error("Nothing to update");
    } else if (bioText.length > 250) {
      toast.error("Over the character limit");
    } else {
      await updateBio(
        connection,
        publicKey,
        domain,
        bioText,
        signAllTransactions,
        toast
      );
    }
    queryClient.invalidateQueries(["bio", domain]);
    setBioEditMode(false);
  };

  return (
    <div className="flex flex-col mt-6 overflow-y-auto">
      <div className="flex flex-col">
        <div className="flex justify-between z-10 mb-2">
          <span className="text-bio-placeholder-text text-sm">Bio</span>
          <div className="flex gap-2">
            {bioEditMode && isOwner && (
              <>
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
                <button onClick={handleSubmit}>
                  <Image
                    src="/confirm/green-check.svg"
                    width={19.51}
                    height={14.25}
                    alt="confirm"
                  />
                </button>
              </>
            )}

            {!bioEditMode && isOwner && !isToken && (
              <button
                className="flex self-center text-link text-sm"
                type="button"
                onClick={(prev) => setBioEditMode(true)}
              >
                Edit
              </button>
            )}
            {!bioEditMode && isOwner && isToken && (
              <ButtonModal
                buttonText="Edit"
                buttonClass=" flex self-center text-link text-sm"
                setVisible={setModalVisible}
                visible={isModalVisible}
              >
                <UnwrapModal
                  domain={domain}
                  refresh={() => refreshIsToken}
                  close={() => setModalVisible(false)}
                />
              </ButtonModal>
            )}
          </div>
        </div>
      </div>

      <form
        method="post"
        className="flex flex-col  overflow-y-auto no-scrollbar"
      >
        {bioEditMode && isOwner ? (
          <>
            <textarea
              name="postContent"
              placeholder={bioPlaceholder}
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              rows={1}
              cols={45}
              className="rounded-2xl  py-2 px-3 bg-input-bg text-search-input-text border-primary-border"
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
          <div className="mb-8 h-[28px]">
            {!bioLoading ? (
              <span className="bg-inherit text-bio-text">{bioText}</span>
            ) : (
              <GenericLoading className="w-full" />
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default Bio;
