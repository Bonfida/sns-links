import Link from "next/link";

const LinkButton = ({ name, value }: { name: string; value: string }) => {
  return (
    <Link
      className="py-3 px-20 w-full md:w-[400px] bg-zinc-100 text-black text-center rounded-lg font-azeret font-bold active:translate-y-1 transition-all"
      href="" // TODO
    >
      {name.charAt(0).toUpperCase() + name.slice(1)}
    </Link>
  );
};

export default LinkButton;
