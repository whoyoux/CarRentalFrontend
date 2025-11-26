export const QUERY_KEYS = {
  user: ["user"],
  cars: ["cars"],
  car: (id: string) => ["car", id] as const,
} as const;
