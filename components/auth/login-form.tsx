"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { nextAuthSignIn } from "@/services/actions/nextauth-actions";
import { Loader2 } from "lucide-react";
import { userCredentialsSchema } from "@/lib/schemas";
import { useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
interface LoginFormProps {
  className?: string;
  error?: string;
}
const LoginForm = ({ className, error }: LoginFormProps) => {
  const form = useForm<z.infer<typeof userCredentialsSchema>>({
    resolver: zodResolver(userCredentialsSchema),
     defaultValues: {
      email: "",
      password: "",
      }
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof userCredentialsSchema>) => {
    startTransition(async () => {
      await nextAuthSignIn(values);
    });
  };
  return (
    <div className={cn("flex flex-col gap-6 w-[22em]", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
          <CardDescription>
            أدخل البريد الالكتروني وكلمة المرور لتسجيل الدخول إلى حسابك.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-[12px] text-destructive mb-4">
              {error === "CredentialsSignin"
                ? "خطأ في  البريد الالكتروني  أو كلمة المرور"
                : error}
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الالكتروني</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <span> جار تسجيل الدخول..</span>
                  </>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
export default LoginForm;
