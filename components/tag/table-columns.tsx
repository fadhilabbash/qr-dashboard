"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { Tag } from "@/lib/definitions";
import DeleteDialog from "../common/delete-dialog";
import { ErrorToast, SuccessToast } from "../common/notification";
import { geTagTypeLabel } from "@/lib/utils";
import { deleteTag } from "@/services/actions/tag-actions";
import EditTag from "./edit-tag";

// Columns definition
export const tableColumns: ColumnDef<Tag>[] = [
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
    accessorKey: "type",
    header: "النوع",
    meta: { displayName: "النوع" },
    cell: ({ row }) => {
      return geTagTypeLabel(String(row.original.type));
    },
  },
  {
    id: "actions",
    header: "الإجراءات",
    meta: { displayName: "الإجراءات" },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <EditTag row={row.original} />
          <div className="ps-2">
            <DeleteDialog
              icon={<Trash2 className="h-4 w-4" />}
              title="تاكيد الحذف"
              description="هل أنت متأكد أنك تريد الحذف؟ هذا الأمر غير قابل للتراجع."
              onConfirm={async () => {
                const response = await deleteTag(row.original.id);
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
