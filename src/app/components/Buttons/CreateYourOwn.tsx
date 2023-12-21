import Link from "next/link";

const CreateYourOwnButton = () => {
  return (
    <Link href="/" passHref>
      <button className="px-6 py-3 font-semibold bg-zinc-100 rounded-xl text-black mb-[-40px]">
        Create your own profile!
      </button>
    </Link>
  );
};

export default CreateYourOwnButton;
