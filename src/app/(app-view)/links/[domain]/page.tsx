import { RecordsListPage } from "@/app/components/Pages/RecordsListPage";

export const metadata = {
  title: "Share Links",
  description: "Edit and share your links",
};

type RecordListViewParams = {
  domain: string;
};

const RecordsListView = ({ params }: { params: RecordListViewParams }) => {
  return (
    <div className="bg-gradient-to-t to-[#03001A] from-[#000a1a] w-screen h-screen">
      <RecordsListPage params={params} />
    </div>
  );
};

export default RecordsListView;
