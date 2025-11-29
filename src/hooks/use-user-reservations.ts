import { useQuery } from "@tanstack/react-query";
import { betterFetch } from "@/lib/better-fetch";
import { QUERY_KEYS } from "@/lib/query-keys";

const useUserReservations = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: QUERY_KEYS.userReservations,
    queryFn: async () => {
      const res = await betterFetch("@get/Reservation");
      if (res.error) throw res.error;
      return res.data;
    },
  });

  return {
    success: !error,
    reservations: data,
    isLoading,
    error,
  };
};

export default useUserReservations;

