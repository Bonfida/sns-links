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
    <div className="bg-primary-bg w-screen h-fit md:py-12">
      <RecordsListPage params={params} />
    </div>
  );
};

export default RecordsListView;
