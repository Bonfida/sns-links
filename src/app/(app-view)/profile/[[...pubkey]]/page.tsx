import { DomainListPage } from "@/app/components/Pages/DomainListPage";

export const metadata = {
  title: "Profile",
  description: "Profile Page",
};

const ProfilePage = () => {
  return (
    <div className="bg-gradient-to-t to-[#03001A] from-[#000a1a] w-screen h-screen">
      <DomainListPage />
    </div>
  );
};

export default ProfilePage;
