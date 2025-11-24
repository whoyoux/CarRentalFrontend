import { createFetch, createSchema } from "@better-fetch/fetch";
import z from "zod";
import { useAuthStore } from "@/stores/auth-store";

if (!process.env.NEXT_PUBLIC_BACKEND_PATH) {
  throw new Error("BACKEND_PATH does not exists in .env!");
}
export const apiSchema = createSchema({
  "@post/Auth/register": {
    input: z.object({
      email: z.string(),
      password: z.string(),
      confirmPassword: z.string(),
    }),
    output: z.object({
      id: z.string(),
      email: z.string(),
      role: z.string(),
    }),
  },
  "@post/Auth/login": {
    input: z.object({
      email: z.string(),
      password: z.string(),
    }),
    output: z.object({
      accessToken: z.string(),
      refreshToken: z.string(),
      email: z.string(),
      role: z.string(),
      id: z.string(),
    }),
  },
  "@post/Auth/refresh-token": {
    input: z.object({
      userId: z.string(),
      refreshToken: z.string(),
    }),
    output: z.object({
      accessToken: z.string(),
      refreshToken: z.string(),
    }),
  },
  "@get/Auth/me": {
    output: z.object({
      id: z.string(),
      email: z.string(),
      role: z.string(),
    }),
  },
});

export const betterFetch = createFetch({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_PATH}/api`,
  schema: apiSchema,
  auth: {
    type: "Bearer",
    token: () => useAuthStore.getState().accessToken ?? "",
  },
});
