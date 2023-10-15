const DomainSelectButton = ({ domain }) => {
  return (
    <label className="cursor-pointer space-y-5 flex">
      <input type="radio" className="peer sr-only" />
      <div className="w-72 max-w-xl rounded-md bg-white p-5 text-gray-600 ring-2 ring-transparent transition-all hover:shadow peer-checked:text-sky-600 peer-checked:ring-blue-400 peer-checked:ring-offset-2">
        <span className="text-lg font-bold text-center flex justify-center items-center">
          {domain}.sol
        </span>
      </div>
    </label>
  );
};

export default DomainSelectButton;
