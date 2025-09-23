"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { Tag, Post } from "@/lib/definitions";
import DeleteDialog from "../common/delete-dialog";
import { ErrorToast, SuccessToast } from "../common/notification";
import EditPost from "./edit-post";
import { deletePost } from "@/services/actions/post-actions";
import { TableRowImage } from "../common/table-row-image";
import { avatar } from "@/lib/placeholder";

// Columns definition
export const tableColumns: ColumnDef<Post>[] = [
  {
    accessorKey: "id",
    header: "المعرف",
    meta: { displayName: "المعرف" },
  },
  {
    accessorKey: "title",
    header: "العنوان",
    meta: { displayName: "العنوان" },
  },
  {
    accessorKey: "tag.name",
    header: "الصنف",
    meta: { displayName: "العنوان" },
  },
  {
    accessorKey: "date",
    header: "التاريخ",
    meta: { displayName: "العنوان" },
  },
  {
    accessorKey: "image",
    header: "الصورة",
    meta: { displayName: "الصورة" },
    cell: ({ row }) => {
      const imageUrl = row.original.image_url ? row.original.image_url : avatar;
      return <TableRowImage src={imageUrl} alt="@OW" fallback="OW" />;
    },
  },
  {
    id: "actions",
    header: "الإجراءات",
    meta: { displayName: "الإجراءات" },
    cell: ({ row, table }) => {
      const tags = table.options.meta?.exData as Tag[];
      return (
        <div className="flex items-center gap-2">
          <EditPost row={row.original} tagOptions={tags ?? []} />
          <div className="ps-2">
            <DeleteDialog
              icon={<Trash2 className="h-4 w-4" />}
              title="تاكيد الحذف"
              description="هل أنت متأكد أنك تريد الحذف؟ هذا الأمر غير قابل للتراجع."
              onConfirm={async () => {
                const response = await deletePost(row.original.id);
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
