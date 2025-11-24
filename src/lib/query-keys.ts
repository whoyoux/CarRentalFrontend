export const QUERY_KEYS = {
  auth: {
    login: ["auth", "login"] as const,
    register: ["auth", "register"] as const,
    checkAuth: ["auth", "check"] as const,
    refreshToken: ["auth", "refresh"] as const,
  },
} as const;
