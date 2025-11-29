import { useMutation, useQueryClient } from "@tanstack/react-query";
import { betterFetch } from "@/lib/better-fetch";
import { QUERY_KEYS } from "@/lib/query-keys";
import { toast } from "sonner";
import type { ErrorWithMessage } from "@/types";

const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, carId }: { id: number; carId: number }) => {
      const res = await betterFetch("@delete/Review/:id", {
        params: { id: String(id) },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviewsByCar(String(variables.carId)) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviews });
      toast.success("Review deleted successfully!");
    },
    onError: (error: ErrorWithMessage | Error) => {
      const message = error?.message || "Failed to delete review";
      toast.error(message);
    },
  });
};

export default useDeleteReview;

