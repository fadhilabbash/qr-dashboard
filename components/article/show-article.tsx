"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Article } from "@/lib/definitions";
import { Eye } from "lucide-react";
import Image from "next/image";

interface ShowArticleProps {
  row: Article;
}

const ShowArticle = ({ row }: ShowArticleProps) => {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (newState: boolean) => {
    setOpen(newState);
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="cursor-pointer">
          <Eye />
          عرض
        </Button>
      </DialogTrigger>
    <DialogContent className="sm:max-w-[720px]" onInteractOutside={(event) => event.preventDefault()} >
        <DialogHeader>
          <DialogTitle>عرض</DialogTitle>
        </DialogHeader>

        <div className="space-y-1 mb-4">
          <h2 className="text-lg font-semibold">{row.title}</h2>
          <p className="text-xs text-muted-foreground">{row.date}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative w-full h-60 md:h-80">
            <Image
              src={row.image_url ?? "/empty.jpg"}
              alt="Post image"
              className="rounded-lg object-cover"
              fill
              unoptimized
            />
          </div>

          <div className="flex flex-col gap-2 max-h-80 overflow-y-auto border rounded-lg p-3 bg-muted/30">
            <p className="text-sm leading-relaxed">{row.text}</p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" className="mt-2" variant="outline">
              الغاء
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default ShowArticle;
