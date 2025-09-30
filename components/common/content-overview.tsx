"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportData } from "@/lib/definitions";
import { geTagTypeLabel } from "@/lib/utils";
import { FileText, BookOpen, Video } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";
import { ChartConfig, ChartContainer } from "../ui/chart";
interface ContentOverviewProps {
  data: ReportData;
  containerClass?: string;
}

const ContentOverview = ({
  data,
  containerClass = "h-[60vh] w-full",
}: ContentOverviewProps) => {
  const chartConfig = {
    post: {
      label: "Post",
      color: "#42b9df",
    },
    article: {
      label: "Article",
      color: "#6a767b",
    },
    video: {
      label: "Video",
      color: "#6870af",
    },
  } satisfies ChartConfig;
  return (
    <div className="space-y-6">
      {/* Totals */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <FileText /> مجموع المنشورات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.totals.posts}</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <BookOpen /> مجموع المقالات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.totals.articles}</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Video /> مجموع الفيديوهات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.totals.videos}</p>
          </CardContent>
        </Card>
      </div>
      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>إحصائيات المحتوى</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className={containerClass}>
            <BarChart
              data={data.tags.map((tag) => ({
                ...tag,
                label: `${tag.tag_name} (${geTagTypeLabel(tag.type)})`,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8">
                {data.tags.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={chartConfig[entry.type]?.color ?? "#8884d8"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
export default ContentOverview;
