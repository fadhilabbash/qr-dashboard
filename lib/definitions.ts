export interface UserCredentials {
  email: string;
  password: string;
}
export interface AccessToken {
  access_token: string;
}
export interface Image {
  id: number;
  image_url: string;
}

export enum TagType {
  Post = "post",
  Video = "video",
  Article = "article",
}
export interface Role {
  id: number;
  name: string;
}
export interface User {
  id: number;
  name: string;
  email: string;
  image: string;
  roles: Role[];
  password?: string;
  password_confirmation?: string;
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  image: string;
  roles: Role[];
}
export interface Tag {
  id: number;
  name: string;
  type: string;
}
export interface Video {
  id: number;
  title: string;
  video_id: string;
  date: string;
  tag: Tag;
  tag_id: string;
}
export interface Post {
  id: number;
  title: string;
  text: string | null;
  image_url?: string | null;
  image_name?: string | null;
  date: string;
  tag: Tag;
  tag_id: string;
}
export interface Article {
  id: number;
  title: string;
  text: string | null;
  image_url?: string | null;
  image_name?: string | null;
  date: string;
  tag: Tag;
  tag_id: string;
}
export interface Report {
  from_date: Date;
  to_date: Date;
}
export interface ReportData {
  totals: {
    posts: number;
    articles: number;
    videos: number;
  };
  tags: TagReport[];
}

export interface TagReport {
  tag_id: number;
  tag_name: string;
  type: "post" | "article" | "video";
  count: number;
}


type Pagination = {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};
export type SuccessResponse<T> = {
  status: "success";
  message: string;
  data: T;
  pagination?: Pagination;
};

export type ErrorResponse = {
  status: "error";
  message: string;
  errors?: Record<string, string[]>;
};

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
