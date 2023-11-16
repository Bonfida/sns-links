const Footer = () => {
  return (
    <div className="w-full pt-5 md:pt-0 flex items-center justify-center bg-[#12152B] flex-col">
      <div className="flex items-center justify-center space-x-4">
        <a
          className="text-white text-xs md:text-base font-azeret"
          href="https://www.sns.id/listings"
        >
          Browse Domains
        </a>
        <a
          className="text-white text-xs md:text-base font-azeret"
          href="https://www.sns.id/listings"
        >
          Learn
        </a>
        <a
          className="text-white text-xs md:text-base font-azeret"
          href="https://sns.guide/"
        >
          Developers
        </a>
        <a
          className="text-white text-xs md:text-base font-azeret"
          href="https://www.sns.id/community"
        >
          Community
        </a>
        <a
          className="text-white text-xs md:text-base font-azeret"
          href="https://www.bonfida.org/blog"
        >
          Blog
        </a>
        <a
          className="text-white text-xs md:text-base font-azeret"
          href="https://immunefi.com/bounty/bonfida/"
        >
          Bug Bounty
        </a>
      </div>
      <h1 className="text-white text-xs md:text-base font-azeret">
        Powered by{" "}
        <a className="underline font-azeret" href="https://bonfida.org/">
          Bonfida
        </a>{" "}
        with ❤️
      </h1>
    </div>
  );
};

export default Footer;
