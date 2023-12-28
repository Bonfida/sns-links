import Image from "next/image";

const Home = () => {
  return (
    <div className="w-full flex mt-10">
      <div className="w-1/2 px-4 md:px-6 ">
        <div className="flex flex-col justify-center space-y-8 text-center">
          <h1 className="font-bold tracking-tighter text-transparent text-5xl xl:text-8xl/none bg-clip-text bg-gradient-to-r from-white to-gray-500">
            Your links on chain.
          </h1>
          <p className="max-w-[600px] text-zinc-200 md:text-xl sm:tex-lg text-sm dark:text-zinc-100 mx-auto">
            Upload all of your platform links using SNS links and share easily
            with friends. Your .sol domain now holds the key to sharing your
            brand accross the web.
          </p>
          <div className=" justify-center flex">
            <button className="bg-gradient-to-r from-white to-gray-500 px-3 py-3 rounded-xl text-black mt-5">
              Get started
            </button>
          </div>
        </div>
      </div>
      <div className="w-1/2 flex justify-center">
        <Image
          width={400}
          height={600}
          className="rounded-xl border-[2px] border-white border-opacity-20"
          src={"/preview/Preview.png"}
          alt="app preview"
        />
      </div>
    </div>
  );
};

export default Home;
