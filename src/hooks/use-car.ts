import { useQuery } from "@tanstack/react-query";
import { betterFetch } from "@/lib/better-fetch";
import { QUERY_KEYS } from "@/lib/query-keys";

const useCar = (carId: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: QUERY_KEYS.car(carId),
    queryFn: async () => {
      const res = await betterFetch("@get/Car/:id", {
        params: { id: carId },
      })
      if (res.error) throw res.error
      return res.data
    },
    enabled: !!carId,
  });

  return {
    success: !error,
    car: data,
    isLoading,
    error,
  };
};

export default useCar;
