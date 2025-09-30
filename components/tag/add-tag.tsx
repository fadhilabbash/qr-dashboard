"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, PlusCircle } from "lucide-react";
import { ErrorToast, SuccessToast } from "@/components/common/notification";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { addTagSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { addTag } from "@/services/actions/tag-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { tagTypeOptions } from "@/lib/placeholder";
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

const AddTag = () => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof addTagSchema>>({
    resolver: zodResolver(addTagSchema),
    defaultValues: {
      name: "",
      type: "",
    },
  });
  const handleOpenChange = (newState: boolean) => {
    setOpen(newState);
    form.reset();
  };
  const onSubmit = (values: z.infer<typeof addTagSchema>) => {
    startTransition(async () => {
      const result = await addTag(values);
      if (result.status === "error") {
        ErrorToast(result.message || ".حدث خطأ أثناء الاضافة");
        setError(result.message);
      } else {
        setOpen(false);
        SuccessToast(result.message || ".تمت الاضافة بنجاح");
        setError("");
        form.reset();
      }
    });
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle /> اضافة
        </Button>
      </DialogTrigger>
    <DialogContent className="sm:max-w-[720px]" onInteractOutside={(event) => event.preventDefault()} >
        <DialogHeader>
          <DialogTitle>اضافة</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-[12px] text-destructive">
          {error}
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>النوع</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="اختر النوع من القائمة المنسدلة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tagTypeOptions.map((tag) => (
                          <SelectItem key={tag.value} value={tag.value}>
                            {tag.label}
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
export default AddTag;
