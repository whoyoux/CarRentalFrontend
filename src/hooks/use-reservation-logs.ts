import { useQuery } from "@tanstack/react-query";
import { betterFetch } from "@/lib/better-fetch";
import { QUERY_KEYS } from "@/lib/query-keys";
import type { ReservationLog } from "@/types";

export const useReservationLogs = () => {
  return useQuery<ReservationLog[]>({
    queryKey: QUERY_KEYS.reservationLogs,
    queryFn: async () => {
      const res = await betterFetch("@get/Reports/reservation-logs");
      if (res.error) throw res.error;
      return res.data;
    },
  });
};

