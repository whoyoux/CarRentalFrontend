import { useQuery } from "@tanstack/react-query";
import { betterFetch } from "@/lib/better-fetch";
import { QUERY_KEYS } from "@/lib/query-keys";

const useCars = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: QUERY_KEYS.cars,
    queryFn: async () => await betterFetch("@get/Car"),
  });

  return {
    success: !error,
    cars: data?.data,
    isLoading,
    error,
  };
};

export default useCars;
