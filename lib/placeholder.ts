import { Home, Users, 
  Tag,
  Video,
  FileText,
  BookOpen, } from "lucide-react";

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
];


export const tagsOptions = [
  { value: "post", label: "منشور" },
  { value: "video", label: "فديو" },
  { value: "article", label: "مقال" },
];
