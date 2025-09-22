"use server";
import apiClientAuth from "@/services/api/api-client-auth";
import { ENDPOINTS } from "@/services/api/endpoints";
import { Tag } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import { addTagSchema, editTagSchema } from "@/lib/schemas";
import z from "zod";

//Get  Tag
export const getTags = async (page: number = 1, term: string = "") => {
  const params = new URLSearchParams({ page: page.toString(), search: term });
  const endpoint = `${ENDPOINTS.tags}?${params.toString()}`;
  const response = await apiClientAuth<Tag[]>(endpoint, { method: "GET" });
  return response;
};

//Add Tag
export const addTag = async (values: z.infer<typeof addTagSchema>) => {
  const result = addTagSchema.safeParse(values);

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
  const endpoint = ENDPOINTS.createTag;
  const response = await apiClientAuth<Tag>(endpoint, {
    method: "POST",
    body: formData,
  });
  revalidatePath(ENDPOINTS.tags);
  return {
    status: response.status,
    message: response.message.toString(),
  };
};

//Update Tag
export const updateTag = async (values: z.infer<typeof editTagSchema>) => {
  const result = editTagSchema.safeParse(values);
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
  const endpoint = ENDPOINTS.updateTag(values.id);
  const response = await apiClientAuth<Tag>(endpoint, {
    method: "POST",
    body: formData,
  });

  revalidatePath(ENDPOINTS.tags);
  return {
    status: response.status,
    message: response.message.toString(),
  };
};
//Get Tag
export const getTag = async (id: number) => {
  const endpoint = ENDPOINTS.getTag(id);
  const response = await apiClientAuth<Tag>(endpoint, { method: "GET" });
  return response;
};

//Delete Tag
export const deleteTag = async (id: string | number) => {
  const endpoint = ENDPOINTS.deleteTag(id);
  const response = await apiClientAuth<Tag>(endpoint, { method: "DELETE" });
  revalidatePath(ENDPOINTS.tags);
  return response;
};
//Get  Tag
export const getTagsByType = async (type: string = "") => {
  const endpoint = ENDPOINTS.getTagsByType(type);
  const response = await apiClientAuth<Tag[]>(endpoint, { method: "GET" });
  return response;
};
