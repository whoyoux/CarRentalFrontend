import { useMutation, useQueryClient } from "@tanstack/react-query";
import { betterFetch } from "@/lib/better-fetch";
import { QUERY_KEYS } from "@/lib/query-keys";
import { toast } from "sonner";
import type { ErrorWithMessage } from "@/types";

type CreateCarInput = {
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  description: string | null;
  imageUrl: string | null;
};

const useCreateCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateCarInput) => {
      const res = await betterFetch("@post/Car", {
        body: input,
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cars });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.car(String(data.id)) });
      toast.success("Car created successfully!");
    },
    onError: (error: ErrorWithMessage | Error) => {
      const message = error?.message || "Failed to create car";
      toast.error(message);
    },
  });
};

export default useCreateCar;

