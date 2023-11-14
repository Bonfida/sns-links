const Footer = () => {
  return (
    <div className="w-full flex items-center justify-center bg-[#12152B] flex-col">
      <div className="md:h-18 h-12 flex md:flex-row flex-col items-center md:justify-center md:w-3/4 w-full space-x-4">
        <h1 className="text-white">Browse Domains</h1>
        <h1 className="text-white">Learn</h1>
        <h1 className="text-white">Developers</h1>
        <h1 className="text-white">Community</h1>
        <h1 className="text-white">Blog</h1>
        <h1 className="text-white">Bug Bounty</h1>
      </div>
      <h1 className="text-white">Powered by Bonfida with ❤️</h1>
    </div>
  );
};

export default Footer;
