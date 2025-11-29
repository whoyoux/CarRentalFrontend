import { useMutation, useQueryClient } from "@tanstack/react-query";
import { betterFetch } from "@/lib/better-fetch";
import { QUERY_KEYS } from "@/lib/query-keys";
import { toast } from "sonner";
import type { ErrorWithMessage } from "@/types";
import { i18n } from "@/lib/i18n";

type UpdateReviewInput = {
  id: number;
  rating: number;
  comment: string | null;
  carId: number;
};

const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateReviewInput) => {
      const res = await betterFetch("@put/Review/:id", {
        params: { id: String(input.id) },
        body: {
          rating: input.rating,
          comment: input.comment ?? null,
        },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviewsByCar(String(variables.carId)) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviews });
      toast.success(i18n.messages.success.reviewUpdated);
    },
    onError: (error: ErrorWithMessage | Error) => {
      const message = error?.message || i18n.messages.error.failedToUpdateReview;
      toast.error(message);
    },
  });
};

export default useUpdateReview;

