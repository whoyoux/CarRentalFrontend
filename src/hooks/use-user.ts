import { useQuery } from "@tanstack/react-query";
import { betterFetch } from "@/lib/better-fetch";

const useUser = () => {
  const { data, error, isFetching } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await betterFetch("@get/Auth/me"),
  });

  return {
    success: !error,
    user: data,
    isAdmin: data?.data?.role === "Admin",
    isLoading: isFetching,
  };
};

export default useUser;
