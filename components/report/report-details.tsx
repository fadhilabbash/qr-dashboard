"use client";

import { useState, useTransition } from "react";
import { getReport } from "@/services/actions/report-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportSchema } from "@/lib/schemas";
import z from "zod";
import { ErrorToast, SuccessToast } from "../common/notification";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { ReportData } from "@/lib/definitions";
import ContentOverview from "../common/content-overview";
const ReportDetails = () => {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<ReportData | null>(null);
  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      from_date: "",
      to_date: "",
    },
  });

  const onSubmit = (values: z.infer<typeof reportSchema>) => {
    startTransition(async () => {
      const result = await getReport(values);
      if (result.status === "error") {
        ErrorToast(result.message || "حدث خطأ أثناء استرجاع التقرير");
      } else {
        SuccessToast(result.message || "تم استرجاع التقرير بنجاح");
        setData(result.data);
      }
    });
  };

  const handleReset = () => {
    setData(null);
    form.reset();
  };
  return (
    <div className="p-4 space-y-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>التاريخ</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-1">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <FormField
                  control={form.control}
                  name="from_date"
                  render={({ field }) => (
                    <FormItem className="w-[40%]">
                      <FormLabel>من تاريخ</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="to_date"
                  render={({ field }) => (
                    <FormItem className="w-[40%]">
                      <FormLabel>الى تاريخ</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="w-[20%] flex flex-col sm:flex-row gap-4 items-center">
                  <Button
                    size="sm"
                    type="submit"
                    disabled={isPending}
                    className="mt-6"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="animate-spin" />
                        <span> جار التحميل ..</span>
                      </>
                    ) : (
                      "عرض التقرير"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleReset}
                    size="sm"
                    className="mt-6"
                  >
                    اعادة تعيين
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      {data && <ContentOverview data={data} containerClass="h-[38vh] w-full" />}
    </div>
  );
};
export default ReportDetails;
