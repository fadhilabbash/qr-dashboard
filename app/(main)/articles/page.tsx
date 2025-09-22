import { PaginationWithLinks } from "@/components/common/pagination-with-links";
import { DataTable } from "@/components/common/data-table";
import { tableColumns } from "@/components/article/table-columns";
import { SearchInput } from "@/components/common/search-input";
import { auth } from "@/auth";

import { getTagsByType } from "@/services/actions/tag-actions";
import { getArticles } from "@/services/actions/article-actions";
import AddArticle from "@/components/article/add-article";

interface SearchParamsProps {
  searchParams?: Promise<{
    page?: string;
    search?: string;
  }>;
}
const ArticlesPage = async ({ searchParams }: SearchParamsProps) => {
  const params = await searchParams;
  const term = params?.search ?? "";
  const currentPage = Number(params?.page) || 1;
  const ArticlesResponse = await getArticles(currentPage, term);
  const tagsResponse = await getTagsByType("Article");
  if (ArticlesResponse.status === "error" || tagsResponse.status === "error") {
    return (
      <div className="flex items-center justify-center  min-h-screen">
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
        <>
          <div>
            <DataTable
              columns={tableColumns}
              data={ArticlesResponse.data}
              pageSize={ArticlesResponse.pagination?.per_page ?? 1}
              exData={tagsResponse.data}
            >
              <AddArticle tagOptions={tagsResponse.data} />
              <SearchInput />
            </DataTable>
          </div>

          <div>
            <PaginationWithLinks
              page={currentPage}
              pageSize={ArticlesResponse.pagination?.per_page ?? 1}
              totalCount={ArticlesResponse.pagination?.total ?? 1}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ArticlesPage;
