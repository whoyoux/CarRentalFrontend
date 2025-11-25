import { useQuery } from "@tanstack/react-query";
import { betterFetch } from "@/lib/better-fetch";
import { QUERY_KEYS } from "@/lib/query-keys";

const useCar = () => {
  const { data, error, isFetching } = useQuery({
    queryKey: QUERY_KEYS.user,
    queryFn: async () => await betterFetch("@get/Auth/me"),
  });

  return {
    success: !error,
    data,
    isLoading: isFetching,
  };
};

export default useCar;
