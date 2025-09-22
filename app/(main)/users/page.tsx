import { PaginationWithLinks } from "@/components/common/pagination-with-links";
import { DataTable } from "@/components/common/data-table";
import { getRoles, getUsers } from "@/services/actions/user-actions";
import { tableColumns } from "@/components/user/table-columns";
import { SearchInput } from "@/components/common/search-input";
import { auth } from "@/auth";
import AddUser from "@/components/user/add-user";
import { getRoleLabel } from "@/lib/utils";

interface SearchParamsProps {
  searchParams?: Promise<{
    page?: string;
    search?: string;
  }>;
}
const UsersPage = async ({ searchParams }: SearchParamsProps) => {
  const params = await searchParams;
  const term = params?.search ?? "";
  const currentPage = Number(params?.page) || 1;
  const usersResponse = await getUsers(currentPage, term);
  const rolesResponse = await getRoles();

  if (usersResponse.status === "error" || rolesResponse.status === "error") {
    return (
      <div className="flex items-center justify-center  min-h-screen">
        <p className="text-red-500">فشل في تحميل البيانات</p>
      </div>
    );
  }

  const roleOptions = rolesResponse.data.map((role) => ({
    id: role.id,
    name: getRoleLabel(role.name),
  }));
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
              data={usersResponse.data}
              exData={roleOptions}
              pageSize={usersResponse.pagination?.per_page ?? 1}
            >
              <AddUser roleOptions={roleOptions} />
              <SearchInput />
            </DataTable>
          </div>

          <div>
            <PaginationWithLinks
              page={currentPage}
              pageSize={usersResponse.pagination?.per_page ?? 1}
              totalCount={usersResponse.pagination?.total ?? 1}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default UsersPage;
