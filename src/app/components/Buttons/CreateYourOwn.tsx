import Link from "next/link";

const CreateYourOwnButton = () => {
  return (
    <Link href="/" passHref>
      <button
        className="px-6 py-3 text-action-button-text rounded-2xl font-bold font-azeret text-base mb-[-40px]"
        style={{ backgroundImage: "var(--action-button-bg)" }}
      >
        Create your own profile!
      </button>
    </Link>
  );
};

export default CreateYourOwnButton;
