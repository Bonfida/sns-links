import DomainLinksPageComponent from "@/app/components/Pages/RecordsListPage";

export const metadata = {
  title: "Share Links",
  description: "Edit and share your links",
};

type DomainLinksPageParams = {
  domain: string;
};

const DomainLinksPage = ({ params }: { params: DomainLinksPageParams }) => {
  return (
    <div className="bg-gradient-to-t to-[#03001A] from-[#000a1a] w-screen h-screen">
      <DomainLinksPageComponent params={params} />
    </div>
  );
};

export default DomainLinksPage;
