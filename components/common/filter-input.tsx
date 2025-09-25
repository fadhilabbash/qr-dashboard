"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Tag } from "@/lib/definitions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
interface FilterInputProps {
  tagOptions: Tag[];
}
export function FilterInput({ tagOptions }: FilterInputProps) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const currentTag = searchParams.get("tag") ?? "";
  const handleFilter = useDebouncedCallback((tag: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (tag !== "") {
      params.set("tag", tag);
    } else {
      params.delete("tag");
    }

    replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <div className="flex items-center gap-2">
      <Select onValueChange={handleFilter} value={currentTag}>
        <SelectTrigger>
          <SelectValue placeholder="اختر النوع من القائمة المنسدلة" />
        </SelectTrigger>
        <SelectContent>
          {tagOptions.map((tag) => (
            <SelectItem key={tag.id} value={tag.id.toString()}>
              {tag.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {currentTag && (
        <Button
          type="button"
          variant="outline"
          onClick={() => handleFilter("")}
        >
          اعادة تعيين
          <Trash2 />
        </Button>
      )}
    </div>
  );
}
