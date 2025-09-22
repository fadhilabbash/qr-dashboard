"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { Tag, Article } from "@/lib/definitions";
import DeleteDialog from "../common/delete-dialog";
import { ErrorToast, SuccessToast } from "../common/notification";
import EditArticle from "./edit-article";
import { deleteArticle } from "@/services/actions/article-actions";


// Columns definition
export const tableColumns: ColumnDef<Article>[] = [
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
    id: "actions",
    header: "الإجراءات",
    meta: { displayName: "الإجراءات" },
    cell: ({ row, table }) => {
      const tags = table.options.meta?.exData as Tag[];
      return (
        <div className="flex items-center gap-2">
         <EditArticle row={row.original} tagOptions={tags ?? []} />
          <div className="ps-2">
            <DeleteDialog
              icon={<Trash2 className="h-4 w-4" />}
              title="تاكيد الحذف"
              description="هل أنت متأكد أنك تريد الحذف؟ هذا الأمر غير قابل للتراجع."
              onConfirm={async () => {
                const response = await deleteArticle(row.original.id);
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
