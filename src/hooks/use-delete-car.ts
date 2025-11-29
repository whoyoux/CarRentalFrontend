import { useMutation, useQueryClient } from "@tanstack/react-query";
import { betterFetch } from "@/lib/better-fetch";
import { QUERY_KEYS } from "@/lib/query-keys";
import { toast } from "sonner";
import type { ErrorWithMessage } from "@/types";
import { i18n } from "@/lib/i18n";

const useDeleteCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (carId: number) => {
      const res = await betterFetch("@delete/Car/:id", {
        params: { id: String(carId) },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cars });
      toast.success(i18n.messages.success.carDeleted);
    },
    onError: (error: ErrorWithMessage | Error) => {
      const message = error?.message || i18n.messages.error.failedToDeleteCar;
      toast.error(message);
    },
  });
};

export default useDeleteCar;

