"use server";
import { signOut, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { userCredentialsSchema } from "@/lib/schemas";
import z from "zod";

export const nextAuthSignOut = async () => {
  await signOut();
};

export const nextAuthSignIn = async (
  values: z.infer<typeof userCredentialsSchema>
) => {
  const result = userCredentialsSchema.safeParse(values);
  if (!result.success) {
    return {
      status: "error",
      message: result.error.message,
    };
  }
  const email = result.data.email;
  const password = result.data.password;
  await signIn("credentials", {
    email,
    password,
    redirect: false,
  })
    .then(() => redirect("/"))
    .catch((error) => {
      if (error instanceof AuthError) {
        return redirect(`/login?error=${error.type}`);
      }
      throw error;
    });
};
