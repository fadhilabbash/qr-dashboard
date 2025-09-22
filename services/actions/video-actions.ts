"use server";
import apiClientAuth from "@/services/api/api-client-auth";
import { ENDPOINTS } from "@/services/api/endpoints";
import { Video } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import { addVideoSchema, editVideoSchema } from "@/lib/schemas";
import z from "zod";

//Get  Video
export const getVideos = async (page: number = 1, term: string = "") => {
  const params = new URLSearchParams({ page: page.toString(), search: term });
  const endpoint = `${ENDPOINTS.videos}?${params.toString()}`;
  const response = await apiClientAuth<Video[]>(endpoint, { method: "GET" });
  return response;
};

//Add Video
export const addVideo = async (values: z.infer<typeof addVideoSchema>) => {
  const result = addVideoSchema.safeParse(values);

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

  const endpoint = ENDPOINTS.createVideo;
  const response = await apiClientAuth<Video>(endpoint, {
    method: "POST",
    body: formData,
  });
  revalidatePath(ENDPOINTS.videos);
  return {
    status: response.status,
    message: response.message.toString(),
  };
};

//Update Video
export const updateVideo = async (values: z.infer<typeof editVideoSchema>) => {
  const result = editVideoSchema.safeParse(values);
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
  const endpoint = ENDPOINTS.updateVideo(values.id);
  const response = await apiClientAuth<Video>(endpoint, {
    method: "POST",
    body: formData,
  });
  revalidatePath(ENDPOINTS.videos);
  return {
    status: response.status,
    message: response.message.toString(),
  };
};
//Get Video
export const getVideo = async (id: number) => {
  const endpoint = ENDPOINTS.getVideo(id);
  const response = await apiClientAuth<Video>(endpoint, { method: "GET" });
  return response;
};

//Delete Video
export const deleteVideo = async (id: string | number) => {
  const endpoint = ENDPOINTS.deleteVideo(id);
  const response = await apiClientAuth<Video>(endpoint, { method: "DELETE" });
  revalidatePath(ENDPOINTS.videos);
  return response;
};
