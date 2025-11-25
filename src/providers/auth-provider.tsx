"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { toast } from "sonner";
import type { LoginFormValues } from "@/features/login/components/login-form";
import type { RegisterFormValues } from "@/features/register/components/register-form";
import { betterFetch } from "@/lib/better-fetch";
import { i18n } from "@/lib/i18n";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useAuthStore } from "@/stores/auth-store";

type AuthContextType = {
  login: (data: LoginFormValues) => Promise<boolean>;
  register: (data: RegisterFormValues) => Promise<boolean>;
  logout: (callback?: () => void) => void;
  verifySession: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const userId = useAuthStore((state) => state.userId);
  const setTokens = useAuthStore((state) => state.setTokens);
  const clearTokens = useAuthStore((state) => state.clearTokens);
  const setLoading = useAuthStore((state) => state.setLoading);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  const queryClient = useQueryClient();

  const clearRefreshInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const refreshAccessToken = useCallback(async () => {
    if (!(refreshToken && userId) || isRefreshingRef.current) {
      return;
    }

    isRefreshingRef.current = true;

    try {
      const { data, error } = await betterFetch("@post/Auth/refresh-token", {
        body: { userId, refreshToken },
      });

      if (error || !data) {
        clearTokens();
        clearRefreshInterval();
        return;
      }

      setTokens(data.accessToken, data.refreshToken, userId);
    } catch (error) {
      console.error("Token refresh failed:", error);
      clearTokens();
      clearRefreshInterval();
    } finally {
      isRefreshingRef.current = false;
    }
  }, [refreshToken, userId, setTokens, clearTokens, clearRefreshInterval]);

  useEffect(() => {
    if (!(refreshToken && userId)) {
      clearRefreshInterval();
      return;
    }

    clearRefreshInterval();

    intervalRef.current = setInterval(refreshAccessToken, REFRESH_INTERVAL);

    return clearRefreshInterval;
  }, [refreshToken, userId, refreshAccessToken, clearRefreshInterval]);

  const login = useCallback(
    async ({ email, password }: LoginFormValues): Promise<boolean> => {
      setLoading(true);

      try {
        const { data, error } = await betterFetch("@post/Auth/login", {
          body: { email, password },
        });

        if (error || !data) {
          const errorMessage =
            error?.status === 400
              ? i18n.auth.messages.loginErrorBadCredentials
              : i18n.auth.messages.loginErrorGeneric;
          toast.error(errorMessage);
          return false;
        }

        setTokens(data.accessToken, data.refreshToken, data.id);
        toast.success(i18n.auth.messages.loginSuccess);
        return true;
      } catch (error) {
        console.error("Login failed:", error);
        toast.error(i18n.auth.messages.loginErrorGeneric);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setTokens]
  );

  const register = useCallback(
    async ({
      email,
      password,
      confirmPassword,
    }: RegisterFormValues): Promise<boolean> => {
      setLoading(true);

      try {
        const { error } = await betterFetch("@post/Auth/register", {
          body: { email, password, confirmPassword },
        });

        if (error) {
          const errorMessage =
            error.status === 400
              ? i18n.auth.messages.registerErrorEmailTaken
              : i18n.auth.messages.registerErrorGeneric;
          toast.error(errorMessage);
          return false;
        }

        toast.success(i18n.auth.messages.registerSuccess);
        return true;
      } catch (error) {
        console.error("Registration failed:", error);
        toast.error(i18n.auth.messages.registerErrorGeneric);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  const verifySession = useCallback(async (): Promise<boolean> => {
    if (!accessToken) {
      return false;
    }

    setLoading(true);

    try {
      const { error } = await betterFetch("@get/Auth/me");

      if (error) {
        clearTokens();
        toast.error(i18n.auth.messages.sessionInvalid);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Session verification failed:", error);
      clearTokens();
      toast.error(i18n.auth.messages.sessionInvalid);
      return false;
    } finally {
      setLoading(false);
    }
  }, [accessToken, clearTokens, setLoading]);

  const logout = useCallback(
    (cb?: () => void) => {
      clearRefreshInterval();
      clearTokens();
      queryClient.removeQueries({ queryKey: QUERY_KEYS.user });
      toast.success(i18n.auth.messages.logoutSuccess);

      cb?.();
    },
    [clearTokens, clearRefreshInterval, queryClient]
  );

  const value = {
    login,
    register,
    logout,
    verifySession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
