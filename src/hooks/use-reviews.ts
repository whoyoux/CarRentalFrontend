import { useQuery } from "@tanstack/react-query";
import { betterFetch } from "@/lib/better-fetch";
import { QUERY_KEYS } from "@/lib/query-keys";

const useReviews = (carId: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: QUERY_KEYS.reviewsByCar(carId),
    queryFn: async () => {
      const res = await betterFetch("@get/Review/car/:carId", {
        params: { carId },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    enabled: !!carId,
  });

  return {
    success: !error,
    reviews: data,
    isLoading,
    error,
  };
};

export default useReviews;

