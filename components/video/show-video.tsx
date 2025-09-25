"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import { YouTubeEmbed } from "@next/third-parties/google";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Video } from "@/lib/definitions";
import { Eye } from "lucide-react";

interface ShowVideoProps {
  row: Video;
}

const ShowVideo = ({ row }: ShowVideoProps) => {
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
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>عرض</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-[12px] text-destructive">
          {}
        </DialogDescription>
        <YouTubeEmbed videoid={row.video_id} />
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
export default ShowVideo;
