"use server";
import apiClientBase from "../api/api-client-base";
import { ENDPOINTS } from "../api/endpoints";
import { AccessToken, UserInfo } from "@/lib/definitions";

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  const formData = new FormData();
  formData.append("email", credentials.email as string);
  formData.append("password", credentials.password as string);
  const response = await apiClientBase<AccessToken>(ENDPOINTS.login, {
    method: "POST",
    body: formData,
  });
  return response;
};

export const me = async (accessToken: string) => {
  const response = await apiClientBase<UserInfo>(
    ENDPOINTS.me,
    { method: "GET" },
    accessToken
  );
  return response;
};

export const refresh = async (accessToken: string) => {
  const response = apiClientBase<AccessToken>(
    ENDPOINTS.refresh,
    { method: "POST" },
    accessToken
  );
  return response;
};