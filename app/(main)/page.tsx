
import ContentOverview from "@/components/common/content-overview";
import { getReportLastThreeMonths } from "@/services/actions/report-actions";

const HomePage = async () => {
  const response = await getReportLastThreeMonths();

  if (response.status === "error") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{response.message}</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 p-2">
      <ContentOverview data={response.data} />
    </div>
  );
};

export default HomePage;
