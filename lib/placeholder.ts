import { Home, Users, Tag, Video, FileText, BookOpen, BarChart2 } from "lucide-react";
import { TagType } from "./definitions";

//Constants data here. static data ...
export const emptyImage = "/images/empty.jpg";
export const avatar = "/images/avatar.jpg";
export const sidebarLinks = [
  {
    title: "الرئيسية",
    url: "/",
    icon: Home,
  },
  {
    title: "المستخدمين",
    url: "/users",
    icon: Users,
    role: "admin",
  },
  {
    title: "الاصناف",
    url: "/tags",
    icon: Tag,
  },
  {
    title: "الفديوهات",
    url: "/videos",
    icon: Video,
  },
  {
    title: "المنشورات",
    url: "/posts",
    icon: FileText,
  },
  {
    title: "المقالات",
    url: "/articles",
    icon: BookOpen,
  },
  {
    title: "التقارير",
    url: "/reports",
    icon: BarChart2,
  },
];
export const tagTypeOptions = [
  { value: TagType.Post, label: "منشور" },
  { value: TagType.Video, label: "فديو" },
  { value: TagType.Article, label: "مقال" },
];
