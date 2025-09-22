"use server";
import apiClientAuth from "@/services/api/api-client-auth";
import { ENDPOINTS } from "@/services/api/endpoints";
import { Post } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import { addPostSchema, editPostSchema } from "@/lib/schemas";
import z from "zod";

//Get  Post
export const getPosts = async (page: number = 1, term: string = "") => {
  const params = new URLSearchParams({ page: page.toString(), search: term });
  const endpoint = `${ENDPOINTS.posts}?${params.toString()}`;
  const response = await apiClientAuth<Post[]>(endpoint, { method: "GET" });
  return response;
};

//Add Post
export const addPost = async (values: z.infer<typeof addPostSchema>) => {
  const result = addPostSchema.safeParse(values);

  if (!result.success) {
    return {
      status: "error",
      message: result.error.issues.map((i) => i.message).join(", "),
    };
  }
  const formData = new FormData();
  for (const [key, value] of Object.entries(values)) {
    formData.append(key, value as string);
  }

  const endpoint = ENDPOINTS.createPost;
  const response = await apiClientAuth<Post>(endpoint, {
    method: "POST",
    body: formData,
  });
  revalidatePath(ENDPOINTS.posts);
  return {
    status: response.status,
    message: response.message.toString(),
  };
};

//Update Post
export const updatePost = async (values: z.infer<typeof editPostSchema>) => {
  const result = editPostSchema.safeParse(values);
  if (!result.success) {
    return {
      status: "error",
      message: result.error.issues.map((i) => i.message).join(", "),
    };
  }
  const formData = new FormData();
  for (const [key, value] of Object.entries(values)) {
    formData.append(key, value as string);
  }
  formData.append("_method", "PUT");
  const endpoint = ENDPOINTS.updatePost(values.id);
  const response = await apiClientAuth<Post>(endpoint, {
    method: "POST",
    body: formData,
  });
  revalidatePath(ENDPOINTS.posts);
  return {
    status: response.status,
    message: response.message.toString(),
  };
};
//Get Post
export const getPost = async (id: number) => {
  const endpoint = ENDPOINTS.getPost(id);
  const response = await apiClientAuth<Post>(endpoint, { method: "GET" });
  return response;
};

//Delete Post
export const deletePost = async (id: string | number) => {
  const endpoint = ENDPOINTS.deletePost(id);
  const response = await apiClientAuth<Post>(endpoint, { method: "DELETE" });
  revalidatePath(ENDPOINTS.posts);
  return response;
};
