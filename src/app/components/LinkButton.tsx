const LinkButton = ({ linkName, linkVal }) => {
  return (
    <button className="py-3 px-20 bg-gradient-to-r from-[#00F0FF] to-[#CBFF5E] rounded-lg font-azeret font-bold">
      {linkName}
    </button>
  );
};

export default LinkButton;
