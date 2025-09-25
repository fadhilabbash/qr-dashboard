// "use client";

// import { useState } from "react";
// import { getReport } from "@/services/actions/report-actions";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { FileText, BookOpen, Video } from "lucide-react";
// import { ReportData } from "@/lib/definitions";

// export default function ReportDetails() {
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [data, setData] = useState<ReportData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const response = await getReport({
//         from_date: fromDate,
//         to_date: toDate,
//       });

//       if (response.status === "error") {
//         setError("فشل في تحميل البيانات");
//         setData(null);
//       } else {
//         setData(response.data);
//       }
//     } catch {
//       setError("حدث خطأ أثناء جلب التقرير");
//       setData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const items = data
//     ? [
//         { label: "المنشورات", value: data.posts, icon: FileText },
//         { label: "المقالات", value: data.articles, icon: BookOpen },
//         { label: "الفيديوهات", value: data.videos, icon: Video },
//       ]
//     : [];

//   return (
//     <div className="p-4 space-y-6">
//       {/* Form */}
//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col sm:flex-row gap-4 items-center"
//       >
//         <Input
//           type="date"
//           value={fromDate}
//           onChange={(e) => setFromDate(e.target.value)}
//           required
//         />
//         <Input
//           type="date"
//           value={toDate}
//           onChange={(e) => setToDate(e.target.value)}
//           required
//         />
//         <Button type="submit" disabled={loading}>
//           {loading ? "جار التحميل..." : "عرض التقرير"}
//         </Button>
//       </form>

//       {/* Error */}
//       {error && <p className="text-red-500">{error}</p>}

//       {/* Cards */}
//       {data && (
//         <div className="grid gap-4 sm:grid-cols-3">
//           {items.map(({ label, value, icon: Icon }) => (
//             <Card key={label} className="text-center shadow-md">
//               <CardHeader>
//                 <CardTitle className="flex items-center justify-center gap-2">
//                   <Icon className="w-5 h-5" /> {label}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-3xl font-bold">{value}</p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useState, useTransition } from "react";
import { getReport } from "@/services/actions/report-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, BookOpen, Video, Loader2 } from "lucide-react";
import { ReportData } from "@/lib/definitions";
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

export default function ReportDetails() {
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
        ErrorToast(result.message || ".حدث خطأ أثناء الاضافة");
      } else {
        SuccessToast(result.message || ".تمت الاضافة بنجاح");
        setData(result.data);
      }
    });
  };
  const handleReset = () => {
    setData(null);
    form.reset();
  };
  const items = data
    ? [
        { label: "المنشورات", value: data.posts, icon: FileText },
        { label: "المقالات", value: data.articles, icon: BookOpen },
        { label: "الفيديوهات", value: data.videos, icon: Video },
      ]
    : [];

  return (
    <div className="p-4 space-y-6">
      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-4">
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
            <div className="w-[20%] flex flex-col sm:flex-row gap-4 items-center ">
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

      {/* Cards */}
      {data && (
        <div className="grid gap-4 sm:grid-cols-3">
          {items.map(({ label, value, icon: Icon }) => (
            <Card key={label} className="text-center shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Icon className="w-5 h-5" /> {label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
