import { useQuery } from "@tanstack/react-query";
import { betterFetch } from "@/lib/better-fetch";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useAuthStore } from "@/stores/auth-store";
import { i18n } from "@/lib/i18n";

export const useMonthlyRevenue = (year?: number, month?: number) => {
  const { data, error, isLoading } = useQuery({
    queryKey: QUERY_KEYS.monthlyRevenue(year, month),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (year) params.append("year", String(year));
      if (month) params.append("month", String(month));
      const queryString = params.toString();
      const url = `/Reports/monthly-revenue${queryString ? `?${queryString}` : ""}`;
      const accessToken = useAuthStore.getState().accessToken;
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_PATH}/api${url}`, {
        headers: {
          Authorization: `Bearer ${accessToken ?? ""}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: i18n.dashboard.admin.monthlyRevenue.failedToFetch }));
        throw new Error(errorData.error || `HTTP ${res.status}: ${i18n.dashboard.admin.monthlyRevenue.failedToFetch}`);
      }

      return res.json();
    },
  });

  return {
    success: !error,
    data,
    isLoading,
    error,
  };
};

export const useUserHistory = (userId: string) => {
  // Funkcja do walidacji GUID
  const isValidGuid = (guid: string): boolean => {
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return guidRegex.test(guid);
  };

  const { data, error, isLoading } = useQuery({
    queryKey: QUERY_KEYS.userHistory(userId),
    queryFn: async () => {
      if (!isValidGuid(userId)) {
        throw new Error(i18n.messages.error.invalidUserId);
      }
      const res = await betterFetch("@get/Reports/user-history/:userId", {
        params: { userId },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    enabled: !!userId && isValidGuid(userId),
  });

  return {
    success: !error,
    data,
    isLoading,
    error,
  };
};

export const useUserDiscount = (userId: string) => {
  // Funkcja do walidacji GUID
  const isValidGuid = (guid: string): boolean => {
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return guidRegex.test(guid);
  };

  const { data, error, isLoading } = useQuery({
    queryKey: QUERY_KEYS.userDiscount(userId),
    queryFn: async () => {
      if (!isValidGuid(userId)) {
        throw new Error(i18n.messages.error.invalidUserId);
      }
      const res = await betterFetch("@get/Reports/discount/:userId", {
        params: { userId },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    enabled: !!userId && isValidGuid(userId),
  });

  return {
    success: !error,
    data,
    isLoading,
    error,
  };
};

