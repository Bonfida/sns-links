import DomainSelectButton from '../app/Components/DomainSelectButton.tsx';

const DomainSelectPage = ({ domainsOwned }) => {
  return (
    <div className=" h-screen w-3/4 flex items-center justify-start flex-col space-y-20 ">
      <h1 className="text-xl font-bold text-white font-azeret">
        Which domain's links would you like to view?
      </h1>
      <ul className="space-y-10">
        {domainsOwned.map((domain) => {
          return (
            <DomainSelectButton domain={domain.domain} key={domain.domain} />
          );
        })}
      </ul>
    </div>
  );
};

export default DomainSelectPage;
