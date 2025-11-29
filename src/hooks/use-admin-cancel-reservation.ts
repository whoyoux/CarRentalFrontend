import { useMutation, useQueryClient } from "@tanstack/react-query";
import { betterFetch } from "@/lib/better-fetch";
import { QUERY_KEYS } from "@/lib/query-keys";
import { toast } from "sonner";
import type { ErrorWithMessage } from "@/types";

const useAdminCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId: number) => {
      const res = await betterFetch("@delete/Reservation/admin/:id", {
        params: { id: String(reservationId) },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminReservations });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cars });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userReservations });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reservationLogs });
      toast.success("Reservation cancelled successfully!");
    },
    onError: (error: ErrorWithMessage | Error) => {
      const message = error?.message || "Failed to cancel reservation";
      toast.error(message);
    },
  });
};

export default useAdminCancelReservation;

