"use server";

import { ApiResponse, ErrorResponse, SuccessResponse } from "@/lib/definitions";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const apiClientBase = async <T>(
  endpoint: string,
  options: RequestInit = {},
  accessToken?: string 
): Promise<ApiResponse<T>> => {
  const config = {
    ...options,
    headers: {
      Accept: "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  };
  const response = await fetch(`${baseUrl}${endpoint}`, config);
  // Handle 2xx responses (Success)
  if (response.ok) {
    const data = await response.json();
    return {
      status: "success",
      ...data,
    } as SuccessResponse<T>;
  }

  // Handle 4xx responses (Client Errors)
  if (response.status >= 400 && response.status < 500) {
    const errorData = await response.json();

    return {
      status: "error",
      ...errorData,
    } as ErrorResponse;
  }

  // Handle 5xx responses (Server Errors)
  if (response.status >= 500) {
    const errorData = {
      status: "error",
      message: `حدث خطأ في الخادم: ${response.status} - ${response.statusText}`,
    };
    return {
      status: "error",
      message: errorData.message,
    } as ErrorResponse;
  }

  // If for some reason the status code isn't recognized
  const errorData = {
    status: "error",
    message: `خطأ غير متوقع: ${response.status}. الرجاء المحاولة لاحقًا.`,
  };
  return errorData as ErrorResponse;
};
export default apiClientBase;
