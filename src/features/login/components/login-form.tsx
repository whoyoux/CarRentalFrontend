"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { i18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

const loginSchema = z.object({
  email: z.string().min(2, i18n.auth.login.emailMinLength),
  password: z.string().min(2, i18n.auth.login.passwordMinLength),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    const success = await login(values);
    if (success) {
      router.push("/");
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{i18n.auth.login.email}</FormLabel>
              <FormControl>
                <Input
                  placeholder={i18n.auth.login.emailPlaceholder}
                  type="text"
                  {...field}
                />
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
              <FormLabel>{i18n.auth.login.password}</FormLabel>
              <FormControl>
                <Input
                  placeholder={i18n.auth.login.passwordPlaceholder}
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          disabled={form.formState.isSubmitting}
          type="submit"
        >
          {form.formState.isSubmitting
            ? i18n.auth.login.submittingButton
            : i18n.auth.login.submitButton}
        </Button>
      </form>
      <div className="mt-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-border border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {i18n.auth.navigation.noAccount}
            </span>
          </div>
        </div>
        <div className="mt-4 text-center text-sm">
          <Link
            className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
            href="/register"
          >
            {i18n.auth.navigation.signUp}
          </Link>
        </div>
      </div>
    </Form>
  );
};

export default LoginForm;
