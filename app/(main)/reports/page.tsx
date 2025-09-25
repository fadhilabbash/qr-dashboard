import { auth } from "@/auth";
import ReportDetails from "@/components/report/report-details";

const ReportPage = async () => {
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

      {session?.user.user_info?.roles[0].name === "admin" && <ReportDetails />}
    </div>
  );
};

export default ReportPage;
