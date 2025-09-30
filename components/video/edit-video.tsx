"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Loader2 } from "lucide-react";
import { ErrorToast, SuccessToast } from "@/components/common/notification";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { updateVideo } from "@/services/actions/video-actions";
import { editVideoSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Tag, Video } from "@/lib/definitions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface UpdateVideoProps {
  row: Video;
  tagOptions: Tag[];
}
const EditVideo = ({ row, tagOptions }: UpdateVideoProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof editVideoSchema>>({
    resolver: zodResolver(editVideoSchema),
    defaultValues: {
      id: row.id,
      title: row.title,
      video_id: row.video_id,
      date: row.date,
      tag_id: row.tag.id.toString(),
    },
  });

  const onSubmit = (values: z.infer<typeof editVideoSchema>) => {
    startTransition(async () => {
      const result = await updateVideo(values);
      if (result.status === "error") {
        ErrorToast(result.message || ".حدث خطأ أثناء الاضافة");
        setError(result.message);
      } else {
        SuccessToast(result.message || ".تمت الاضافة بنجاح");
        setError("");
        setOpen(false);
        form.reset(values);
      }
    });
  };
  const handleOpenChange = (newState: boolean) => {
    setOpen(newState);
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="cursor-pointer">
          <Edit />
          تعديل
        </Button>
      </DialogTrigger>
    <DialogContent className="sm:max-w-[720px]" onInteractOutside={(event) => event.preventDefault()} >
        <DialogHeader>
          <DialogTitle>تعديل</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-[12px] text-destructive">
          {error}
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <input type="hidden" {...form.register("id")} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="video_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>معرف الفديو</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التاريخ</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tag_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الصنف</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="اختر النوع من القائمة المنسدلة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tagOptions.map((tag) => (
                          <SelectItem key={tag.id} value={tag.id.toString()}>
                            {tag.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending} className="ml-2 mt-2">
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <span> جار الحفظ..</span>
                  </>
                ) : (
                  "حفظ"
                )}
              </Button>
              <DialogClose asChild>
                <Button type="button" className="mt-2" variant="outline">
                  الغاء
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default EditVideo;
