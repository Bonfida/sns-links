import { DomainListPage } from "@/app/components/Pages/DomainListPage";

export const metadata = {
  title: "Profile",
  description: "Profile Page",
};

const DomainListView = () => {
  return (
    <div className="bg-primary-bg w-screen h-screen overflow-auto">
      <DomainListPage />
    </div>
  );
};

export default DomainListView;
