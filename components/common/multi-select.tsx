"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown } from "lucide-react";
import { Input } from "../ui/input";

interface MultiSelectProps {
  options: { id: string | number; name: string }[];
  placeholder?: string;
  value?: Array<string | number>;
  onChange: (selected: Array<string | number>) => void;
}

const MultiSelect = ({
  options,
  placeholder = "اختر من القائمة المنسدلة",
  value = [],
  onChange,
}: MultiSelectProps) => {
  const toggleSelection = (item: string | number, checked: boolean) => {
    const updatedSelection = checked
      ? [...value, item]
      : value.filter((i) => i !== item);
    onChange(updatedSelection);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative w-full">
          <div className="relative flex items-center">
            <Input
              value={
                value.length > 0
                  ? options
                      .filter((opt) =>
                        value.map(String).includes(String(opt.id))
                      )
                      .map((opt) => opt.name)
                      .join(", ")
                  : ""
              }
              placeholder={placeholder}
              className="w-full cursor-pointer pe-10"
              readOnly
            />
            <ChevronDown className="absolute ltr:right-3 rtl:left-3 pointer-events-none h-4 w-4 opacity-50" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[var(--radix-popper-anchor-width)]">
        {options.map((item) => (
          <DropdownMenuCheckboxItem
            onSelect={(e) => e.preventDefault()}
            key={item.id}
            checked={value.map(String).includes(String(item.id))}
            onCheckedChange={(checked) => toggleSelection(item.id, checked)}
          >
            {item.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MultiSelect;
