import { PaginationWithLinks } from "@/components/common/pagination-with-links";
import { DataTable } from "@/components/common/data-table";
import { tableColumns } from "@/components/post/table-columns";
import { SearchInput } from "@/components/common/search-input";
import { getPosts } from "@/services/actions/post-actions";
import { getTagsByType } from "@/services/actions/tag-actions";
import AddPost from "@/components/post/add-post";
import { TagType } from "@/lib/definitions";
import { FilterInput } from "@/components/common/filter-input";

interface SearchParamsProps {
  searchParams?: Promise<{
    page?: string;
    search?: string;
    tag?: number;
  }>;
}
const PostsPage = async ({ searchParams }: SearchParamsProps) => {
  const params = await searchParams;
  const term = params?.search ?? "";
  const tag = params?.tag ?? 0;
  const currentPage = Number(params?.page) || 1;
  const postsResponse = await getPosts(currentPage, term, tag);
  const tagsResponse = await getTagsByType(TagType.Post);
  if (postsResponse.status === "error" || tagsResponse.status === "error") {
    return (
      <div className="flex items-center justify-center  min-h-screen">
       <p className="text-red-500">{postsResponse.message}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-2">
      <div>
        <DataTable
          columns={tableColumns}
          data={postsResponse.data}
          pageSize={postsResponse.pagination?.per_page ?? 1}
          exData={tagsResponse.data}
        >
          <AddPost tagOptions={tagsResponse.data} />
          <SearchInput />
          <FilterInput tagOptions={tagsResponse.data} />
        </DataTable>
      </div>

      <div>
        <PaginationWithLinks
          page={currentPage}
          pageSize={postsResponse.pagination?.per_page ?? 1}
          totalCount={postsResponse.pagination?.total ?? 1}
        />
      </div>
    </div>
  );
};

export default PostsPage;
