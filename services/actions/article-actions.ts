"use server";
import apiClientAuth from "@/services/api/api-client-auth";
import { ENDPOINTS } from "@/services/api/endpoints";
import { Article } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import { addArticleSchema, editArticleSchema } from "@/lib/schemas";
import z from "zod";

//Get  Article
export const getArticles = async (
  page: number = 1,
  term: string = "",
  tag: number = 0
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    search: term,
    tag: tag.toString(),
  });
  const endpoint = `${ENDPOINTS.articles}?${params.toString()}`;
  const response = await apiClientAuth<Article[]>(endpoint, { method: "GET" });
  return response;
};

//Add Article
export const addArticle = async (values: z.infer<typeof addArticleSchema>) => {
  const result = addArticleSchema.safeParse(values);

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

  const endpoint = ENDPOINTS.createArticle;
  const response = await apiClientAuth<Article>(endpoint, {
    method: "POST",
    body: formData,
  });
  revalidatePath(ENDPOINTS.articles);
  return {
    status: response.status,
    message: response.message.toString(),
  };
};

//Update Article
export const updateArticle = async (
  values: z.infer<typeof editArticleSchema>
) => {
  const result = editArticleSchema.safeParse(values);
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
  const endpoint = ENDPOINTS.updateArticle(values.id);
  const response = await apiClientAuth<Article>(endpoint, {
    method: "POST",
    body: formData,
  });
  revalidatePath(ENDPOINTS.articles);
  return {
    status: response.status,
    message: response.message.toString(),
  };
};
//Get Article
export const getArticle = async (id: number) => {
  const endpoint = ENDPOINTS.getArticle(id);
  const response = await apiClientAuth<Article>(endpoint, { method: "GET" });
  return response;
};

//Delete Article
export const deleteArticle = async (id: string | number) => {
  const endpoint = ENDPOINTS.deleteArticle(id);
  const response = await apiClientAuth<Article>(endpoint, { method: "DELETE" });
  revalidatePath(ENDPOINTS.articles);
  return response;
};
