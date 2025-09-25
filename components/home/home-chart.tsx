"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportData } from "@/lib/definitions";
import { FileText, BookOpen, Video } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const HomeChart = ({ data }: { data: ReportData }) => {
  const items = [
    { label: "المنشورات", value: data.posts, icon: FileText },
    { label: "المقالات", value: data.articles, icon: BookOpen },
    { label: "الفيديوهات", value: data.videos, icon: Video },
  ];

  const chartData = items.map((item) => ({
    name: item.label,
    value: item.value,
  }));

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
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

      {/* Bar Chart */}
      <Card className="shadow-md ">
        <CardHeader>
          <CardTitle>إحصائيات المحتوى خلال ثلاثة اشهر</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[55vh]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#3db7dd" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default HomeChart;
