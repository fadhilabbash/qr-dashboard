import { PaginationWithLinks } from "@/components/common/pagination-with-links";
import { DataTable } from "@/components/common/data-table";
import { tableColumns } from "@/components/article/table-columns";
import { SearchInput } from "@/components/common/search-input";
import { getTagsByType } from "@/services/actions/tag-actions";
import { getArticles } from "@/services/actions/article-actions";
import AddArticle from "@/components/article/add-article";
import { TagType } from "@/lib/definitions";
import { FilterInput } from "@/components/common/filter-input";

interface SearchParamsProps {
  searchParams?: Promise<{
    page?: string;
    search?: string;
    tag?: number;
  }>;
}
const ArticlesPage = async ({ searchParams }: SearchParamsProps) => {
  const params = await searchParams;
  const term = params?.search ?? "";
  const tag = params?.tag ?? 0;
  const currentPage = Number(params?.page) || 1;
  const articlesResponse = await getArticles(currentPage, term, tag);
  const tagsResponse = await getTagsByType(TagType.Article);
  if (articlesResponse.status === "error" || tagsResponse.status === "error") {
    return (
      <div className="flex items-center justify-center  min-h-screen">
        <p className="text-red-500">{articlesResponse.message}</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 p-2">
      <div>
        <DataTable
          columns={tableColumns}
          data={articlesResponse.data}
          pageSize={articlesResponse.pagination?.per_page ?? 1}
          exData={tagsResponse.data}
        >
          <AddArticle tagOptions={tagsResponse.data} />
          <SearchInput />
          <FilterInput tagOptions={tagsResponse.data} />
        </DataTable>
      </div>

      <div>
        <PaginationWithLinks
          page={currentPage}
          pageSize={articlesResponse.pagination?.per_page ?? 1}
          totalCount={articlesResponse.pagination?.total ?? 1}
        />
      </div>
    </div>
  );
};

export default ArticlesPage;
