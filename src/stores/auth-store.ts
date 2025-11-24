import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthTokens = {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
};

type AuthStore = AuthTokens & {
  isLoading: boolean;
  setTokens: (
    accessToken: string,
    refreshToken: string,
    userId: string
  ) => void;
  clearTokens: () => void;
  setLoading: (loading: boolean) => void;
  isAuthenticated: () => boolean;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isLoading: true,
      accessToken: null,
      refreshToken: null,
      userId: null,
      setTokens: (accessToken, refreshToken, userId) => {
        set({ accessToken, refreshToken, userId });
      },
      clearTokens: () => {
        set({
          accessToken: null,
          refreshToken: null,
          userId: null,
        });
      },
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
      isAuthenticated: () => get().accessToken !== null,
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setLoading(false);
        }
      },
    }
  )
);
