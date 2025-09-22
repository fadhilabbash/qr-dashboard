"use server";
import apiClientAuth from "@/services/api/api-client-auth";
import { ENDPOINTS } from "@/services/api/endpoints";
import { Role, User } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import {
  addUserSchema,
  editUserSchema,
  userPasswordSchema,
} from "@/lib/schemas";
import z from "zod";

//Get  user
export const getUsers = async (page: number = 1, term: string = "") => {
  const params = new URLSearchParams({ page: page.toString(), search: term });
  const endpoint = `${ENDPOINTS.users}?${params.toString()}`;
  const response = await apiClientAuth<User[]>(endpoint, { method: "GET" });
  return response;
};

//Add user
export const addUser = async (values: z.infer<typeof addUserSchema>) => {
  const result = addUserSchema.safeParse(values);

  if (!result.success) {
    return {
      status: "error",
      message: result.error.issues.map((i) => i.message).join(", "),
    };
  }
  const formData = new FormData();
  for (const [key, value] of Object.entries(values)) {
    if (key === "roles") continue;
    if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, value as string);
    }
  }
  values.roles.forEach((role) => {
    formData.append("roles[]", role.toString());
  });

  const endpoint = ENDPOINTS.createUser;
  const response = await apiClientAuth<User>(endpoint, {
    method: "POST",
    body: formData,
  });
   revalidatePath(ENDPOINTS.users);
  return {
    status: response.status,
    message: response.message.toString(),
  };
};

//Update user
export const updateUser = async (values: z.infer<typeof editUserSchema>) => {
  const result = editUserSchema.safeParse(values);
  if (!result.success) {
    return {
      status: "error",
      message: result.error.issues.map((i) => i.message).join(", "),
    };
  }
  const formData = new FormData();
  for (const [key, value] of Object.entries(values)) {
    if (key === "roles") continue;
    if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, value as string);
    }
  }
  values.roles.forEach((role) => {
    formData.append("roles[]", role.toString());
  });
  formData.append("_method", "PUT");
  const endpoint = ENDPOINTS.updateUser(values.id);
  const response = await apiClientAuth<User>(endpoint, {
    method: "POST",
    body: formData,
  });

  revalidatePath(ENDPOINTS.updateUser(values.id));
  return {
    status: response.status,
    message: response.message.toString(),
  };
};
//Update user password
export const updateUserPassword = async (
  values: z.infer<typeof userPasswordSchema>
) => {
  const result = userPasswordSchema.safeParse(values);
  if (!result.success) {
    return {
      status: "error",
      message: result.error.issues.map((i) => i.message).join(", "),
    };
  }
  const formData = new FormData();
  for (const [key, value] of Object.entries(values))
    formData.append(key, value as string);

  const endpoint = ENDPOINTS.updateUserPassword(values.id);
  const response = await apiClientAuth<null>(endpoint, {
    method: "POST",
    body: formData,
  });

  return {
    status: response.status,
    message: response.message.toString(),
  };
};
//Get user
export const getUser = async (id: number) => {
  const endpoint = ENDPOINTS.getUser(id);
  const response = await apiClientAuth<User>(endpoint, { method: "GET" });
  return response;
};
//Get user roles
export const getRoles = async () => {
  const endpoint = ENDPOINTS.getRoles;
  const response = await apiClientAuth<Role[]>(endpoint, { method: "GET" });
  return response;
};
//Delete user
export const deleteUser = async (id: string | number) => {
  const endpoint = ENDPOINTS.deleteUser(id);
  const response = await apiClientAuth<User>(endpoint, { method: "DELETE" });
  revalidatePath(ENDPOINTS.users);
  return response;
};
