"use client";

import {useState, useTransition } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Loader2, LucideRotateCwSquare } from "lucide-react";
import { User } from "@/lib/definitions";
import { SuccessToast, ErrorToast } from "../common/notification";

import { updateUserPassword } from "@/services/actions/user-actions";
import { Input } from "../ui/input";

import { userPasswordSchema } from "@/lib/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

interface ChangeUserPasswordProps {
  row: User;
}
const ChangeUserPassword = ({ row }: ChangeUserPasswordProps) => {
  const [open, setOpen] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof userPasswordSchema>>({
    resolver: zodResolver(userPasswordSchema),
    defaultValues: {
      id: row.id,
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = (values: z.infer<typeof userPasswordSchema>) => {
    startTransition(async () => {
      const result = await updateUserPassword(values);
      if (result.status === "error") {
        ErrorToast(result.message || ".حدث خطأ أثناء التعديل");
        setError(result.message);
      } else {
        SuccessToast(result.message || ".تم التعديل بنجاح");
        setOpen(false);
        setError("");
        form.reset();
      }
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 cursor-pointer">
          <LucideRotateCwSquare className="h-4 w-4" />
          تغيير كلمة المرور
        </Button>
      </DialogTrigger>
      <DialogContent  className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>تغيير كلمة المرور</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-[12px] text-destructive">
          {error}
        </DialogDescription>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <input type="hidden" {...form.register("id")} />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تأكيد كلمة المرور</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

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
export default ChangeUserPassword;
