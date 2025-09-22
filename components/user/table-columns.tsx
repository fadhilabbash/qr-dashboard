"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { Role, User } from "@/lib/definitions";
import { deleteUser } from "@/services/actions/user-actions";
import DeleteDialog from "../common/delete-dialog";
import { ErrorToast, SuccessToast } from "../common/notification";

import { avatar } from "@/lib/placeholder";
import ChangeUserPassword from "./change-user-password";
import { TableRowImage } from "../common/table-row-image";
import { getRoleLabel } from "@/lib/utils";
import EditUser from "./edit-user";

const baseFileUrl = process.env.NEXT_PUBLIC_FILE_URL;
// Columns definition
export const tableColumns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "المعرف",
    meta: { displayName: "المعرف" },
  },
  {
    accessorKey: "name",
    header: "الاسم",
    meta: { displayName: "الاسم" },
  },
  {
    accessorKey: "email",
    header: "البريد الإلكتروني",
    meta: { displayName: "البريد الالكتروني" },
  },
  {
    accessorKey: "roles",
    header: "الأدوار",
    meta: { displayName: "الأدوار" },
    cell: ({ row }) =>
      row.original.roles
        ?.map((role: { name: string }) => getRoleLabel(role.name))
        .join(", ") || "—",
  },

  {
    accessorKey: "image",
    header: "الصورة",
    meta: { displayName: "الصورة" },
    cell: ({ row }) => {
      const imageUrl = row.original.image
        ? baseFileUrl + row.original.image
        : avatar;
      return <TableRowImage src={imageUrl} alt="@OW" fallback="OW" />;
    },
  },
  {
    id: "actions",
    header: "الإجراءات",
    meta: { displayName: "الإجراءات" },
    cell: ({ row, table }) => {
      const roles = table.options.meta?.exData as Role[];
      return (
        <div className="flex items-center gap-2">
          <ChangeUserPassword row={row.original} />
          <EditUser row={row.original} roleOptions={roles ?? []} />
          <div className="ps-2">
            <DeleteDialog
              icon={<Trash2 className="h-4 w-4" />}
              title="تاكيد الحذف"
              description="هل أنت متأكد أنك تريد الحذف؟ هذا الأمر غير قابل للتراجع."
              onConfirm={async () => {
                const response = await deleteUser(row.original.id);
                if (response.status === "success") {
                  SuccessToast(response.message || ".تم الحذف بنجاح");
                } else if (response.status === "error") {
                  ErrorToast(response.message || ".حدث خطأ أثناء الحذف");
                }
              }}
              confirmLabel="نعم"
              cancelLabel="لا"
            />
          </div>
        </div>
      );
    },
  },
];
