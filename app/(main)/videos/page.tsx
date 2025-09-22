import { PaginationWithLinks } from "@/components/common/pagination-with-links";
import { DataTable } from "@/components/common/data-table";
import { tableColumns } from "@/components/video/table-columns";
import { SearchInput } from "@/components/common/search-input";
import { auth } from "@/auth";
import { getVideos } from "@/services/actions/video-actions";
import { getTagsByType } from "@/services/actions/tag-actions";
import AddVideo from "@/components/video/add-video";

interface SearchParamsProps {
  searchParams?: Promise<{
    page?: string;
    search?: string;
  }>;
}
const VideosPage = async ({ searchParams }: SearchParamsProps) => {
  const params = await searchParams;
  const term = params?.search ?? "";
  const currentPage = Number(params?.page) || 1;
  const videosResponse = await getVideos(currentPage, term);
  const tagsResponse = await getTagsByType("video");
  if (videosResponse.status === "error" || tagsResponse.status === "error") {
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
              data={videosResponse.data}
              pageSize={videosResponse.pagination?.per_page ?? 1}
              exData={tagsResponse.data}
            >
              <AddVideo tagOptions={tagsResponse.data} />
              <SearchInput />
            </DataTable>
          </div>

          <div>
            <PaginationWithLinks
              page={currentPage}
              pageSize={videosResponse.pagination?.per_page ?? 1}
              totalCount={videosResponse.pagination?.total ?? 1}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default VideosPage;
