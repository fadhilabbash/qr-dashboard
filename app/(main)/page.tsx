import { auth } from "@/auth";
import ContentOverview from "@/components/common/content-overview";
import { getReportLastThreeMonths } from "@/services/actions/report-actions";

const HomePage = async () => {
  const response = await getReportLastThreeMonths();

  if (response.status === "error") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">فشل في تحميل البيانات</p>
      </div>
    );
  }
  const session = await auth();

  return (
    <div className="grid grid-cols-1 gap-4 p-2">
      {session?.user.user_info?.roles[0].name !== "admin" && (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md">
          <p>
            تنبيه: ليس لديك صلاحيات المسؤول للوصول إلى جميع ميزات إدارة
            المستخدمين.
          </p>
        </div>
      )}

      {session?.user.user_info?.roles[0].name === "admin" && (
        <div>
          <ContentOverview data={response.data}/>
        </div>
      )}
    </div>
  );
};

export default HomePage;
