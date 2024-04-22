import { DomainListPage } from "@/app/components/Pages/DomainListPage";

export const metadata = {
  title: "Profile",
  description: "Profile Page",
};

const ProfilePage = () => {
  return (
    <div>
      <DomainListPage />
    </div>
  );
};

export default ProfilePage;
