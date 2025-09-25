"use server";
import { ReportData } from "@/lib/definitions";
import { reportSchema } from "@/lib/schemas";
import apiClientAuth from "@/services/api/api-client-auth";
import { ENDPOINTS } from "@/services/api/endpoints";

import z from "zod";

//Get Report

export const getReport = async (values: z.infer<typeof reportSchema>) => {
  const result = reportSchema.safeParse(values);

  if (!result.success) {
    return {
      status: "error",
      message: result.error.issues.map((i) => i.message).join(", "),
      data: null,
    };
  }
  const params = new URLSearchParams({
    from_date: values.from_date,
    to_date: values.to_date,
  });
  const endpoint = `${ENDPOINTS.report}?${params.toString()}`;
  const response = await apiClientAuth<ReportData>(endpoint, { method: "GET" });
  if (response.status === "error") {
    return {
      status: response.status,
      message: response.message,
      data: null,
    };
  }

  return {
    status: response.status,
    message: response.message,
    data: response.data,
  };
};

export const getReportLastThreeMonths = async () => {
  const now = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const params = new URLSearchParams({
    from_date: formatDate(threeMonthsAgo),
    to_date: formatDate(now),
  });
  const endpoint = `${ENDPOINTS.report}?${params.toString()}`;
  const response = await apiClientAuth<ReportData>(endpoint, { method: "GET" });
  return response;
};
