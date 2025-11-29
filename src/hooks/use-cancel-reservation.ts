import { useMutation, useQueryClient } from "@tanstack/react-query";
import { betterFetch } from "@/lib/better-fetch";
import { QUERY_KEYS } from "@/lib/query-keys";
import { toast } from "sonner";
import type { ErrorWithMessage } from "@/types";
import { i18n } from "@/lib/i18n";

const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId: number) => {
      const res = await betterFetch("@delete/Reservation/:id", {
        params: { id: String(reservationId) },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userReservations });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cars });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminReservations });
      toast.success(i18n.messages.success.reservationCancelled);
    },
    onError: (error: ErrorWithMessage | Error) => {
      const message = error?.message || i18n.messages.error.failedToCancelReservation;
      toast.error(message);
    },
  });
};

export default useCancelReservation;

