import { PaginationWithLinks } from "@/components/common/pagination-with-links";
import { DataTable } from "@/components/common/data-table";
import { tableColumns } from "@/components/tag/table-columns";
import { Tag } from "@/lib/definitions";
import { SearchInput } from "@/components/common/search-input";
import { auth } from "@/auth";
import { getTags } from "@/services/actions/tag-actions";
import AddTag from "@/components/tag/add-tag";

interface SearchParamsProps {
  searchParams?: Promise<{
    page?: string;
    search?: string;
  }>;
}
const TagsPage = async ({ searchParams }: SearchParamsProps) => {
  const params = await searchParams;
  const term = params?.search ?? "";
  const currentPage = Number(params?.page) || 1;
  const response = await getTags(currentPage, term);
  if (response.status === "error")
    return (
      <div className="flex items-center justify-center  min-h-screen">
        <p className="text-red-500">فشل في تحميل البيانات</p>
      </div>
    );
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
        <>
          <div>
            <DataTable
              columns={tableColumns}
              data={response.data as Tag[]}
              pageSize={response.pagination?.per_page ?? 1}
            >
              <AddTag />
              <SearchInput />
            </DataTable>
          </div>

          <div>
            <PaginationWithLinks
              page={currentPage}
              pageSize={response.pagination?.per_page ?? 1}
              totalCount={response.pagination?.total ?? 1}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TagsPage;
