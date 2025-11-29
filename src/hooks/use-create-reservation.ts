import { useMutation, useQueryClient } from "@tanstack/react-query";
import { betterFetch } from "@/lib/better-fetch";
import { QUERY_KEYS } from "@/lib/query-keys";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { ErrorWithMessage } from "@/types";
import { i18n } from "@/lib/i18n";

type CreateReservationInput = {
  carId: number;
  startDateTime: string;
  endDateTime: string;
};

const useCreateReservation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: CreateReservationInput) => {
      const res = await betterFetch("@post/Reservation", {
        body: input,
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.car(String(data.carId)) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cars });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminReservations });
      toast.success(i18n.messages.success.reservationCreated);
      router.push("/dashboard");
    },
    onError: (error: ErrorWithMessage | Error) => {
      const message = error?.message || i18n.messages.error.failedToCreateReservation;
      toast.error(message);
    },
  });
};

export default useCreateReservation;

