import { useMutation, useQueryClient } from "@tanstack/react-query";
import { betterFetch } from "@/lib/better-fetch";
import { QUERY_KEYS } from "@/lib/query-keys";
import { toast } from "sonner";
import type { ErrorWithMessage } from "@/types";
import { i18n } from "@/lib/i18n";

type CreateReviewInput = {
  carId: number;
  rating: number;
  comment: string | null;
};

const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateReviewInput) => {
      const res = await betterFetch("@post/Review", {
        body: input,
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviewsByCar(String(data.carId)) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviews });
      toast.success(i18n.messages.success.reviewAdded);
    },
    onError: (error: ErrorWithMessage | Error) => {
      const message = error?.message || i18n.messages.error.failedToAddReview;
      toast.error(message);
    },
  });
};

export default useCreateReview;

