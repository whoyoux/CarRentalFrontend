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

const registerSchema = z
  .object({
    email: z.string().email(i18n.auth.register.invalidEmail),
    password: z.string().min(6, i18n.auth.register.passwordMinLength),
    confirmPassword: z.string().min(6, i18n.auth.register.passwordMinLength),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: i18n.auth.register.passwordsDoNotMatch,
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const { register } = useAuth();
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    const success = await register(values);
    if (success) {
      router.push("/login");
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
              <FormLabel>{i18n.auth.register.email}</FormLabel>
              <FormControl>
                <Input
                  placeholder={i18n.auth.register.emailPlaceholder}
                  type="email"
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
              <FormLabel>{i18n.auth.register.password}</FormLabel>
              <FormControl>
                <Input
                  placeholder={i18n.auth.register.passwordPlaceholder}
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{i18n.auth.register.confirmPassword}</FormLabel>
              <FormControl>
                <Input
                  placeholder={i18n.auth.register.passwordPlaceholder}
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
            ? i18n.auth.register.submittingButton
            : i18n.auth.register.submitButton}
        </Button>
      </form>
      <div className="mt-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-border border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {i18n.auth.navigation.haveAccount}
            </span>
          </div>
        </div>
        <div className="mt-4 text-center text-sm">
          <Link
            className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
            href="/login"
          >
            {i18n.auth.navigation.signIn}
          </Link>
        </div>
      </div>
    </Form>
  );
};

export default RegisterForm;
