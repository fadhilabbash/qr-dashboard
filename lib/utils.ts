import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getBase64Image = async (url: string) => {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const contentType = res.headers.get("content-type");
  return `data:${contentType};base64,${Buffer.from(buffer).toString("base64")}`;
};
export const breadcrumbMapping: Record<string, string> = {
  add: "اضافة",
  users: "المستخدمين",
  tags: "الاصناف",
  videos: "الفديوهات",
  posts: "المنشورات",
  articles: "المنشورات",
  reports: "التقارير",
};
export const getBreadcrumbLabel = (key: string): string => {
  return breadcrumbMapping[key] || key;
};
export function getRoleLabel(value: string): string {
  const names: Record<string, string> = {
    admin: "مدير",
    editor: "محرر",
    user: "مستخدم",
  };
  return names[value] || "";
}
export function geTagTypeLabel(value: string): string {
  const names: Record<string, string> = {
    post: "منشور",
    video: "فيديو",
    article: "مقال",
  };
  return names[value] || "";
}
