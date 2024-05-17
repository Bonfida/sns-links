import { DomainListPage } from "@/app/components/Pages/DomainListPage";

export const metadata = {
  title: "Profile",
  description: "Profile Page",
};

const DomainListView = () => {
  return (
    <div className="bg-primary-bg w-screen min-h-screen">
      <DomainListPage />
    </div>
  );
};

export default DomainListView;
