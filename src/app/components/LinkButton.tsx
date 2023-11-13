const LinkButton = ({ linkName, linkVal }) => {
  console.log("linkName", linkName, linkVal);
  return (
    <a href={`https://${linkName}.com/${linkVal}`} target="_blank">
      <button className="py-3 px-20 w-72 bg-gradient-to-r from-[#00F0FF] to-[#CBFF5E] rounded-lg font-azeret font-bold active:translate-y-1 transition-all">
        {linkName.charAt(0).toUpperCase() + linkName.slice(1)}
      </button>
    </a>
  );
};

export default LinkButton;
