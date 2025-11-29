import { createFetch, createSchema } from "@better-fetch/fetch";
import z from "zod";
import { useAuthStore } from "@/stores/auth-store";

if (!process.env.NEXT_PUBLIC_BACKEND_PATH) {
  throw new Error("BACKEND_PATH does not exists in .env!");
}
export const apiSchema = createSchema({
  "@post/Auth/register": {
    input: z.object({
      email: z.string(),
      password: z.string(),
      confirmPassword: z.string(),
    }),
    output: z.object({
      id: z.string(),
      email: z.string(),
      role: z.string(),
    }),
  },
  "@post/Auth/login": {
    input: z.object({
      email: z.string(),
      password: z.string(),
    }),
    output: z.object({
      accessToken: z.string(),
      refreshToken: z.string(),
      email: z.string(),
      role: z.string(),
      id: z.string(),
    }),
  },
  "@post/Auth/refresh-token": {
    input: z.object({
      userId: z.string(),
      refreshToken: z.string(),
    }),
    output: z.object({
      accessToken: z.string(),
      refreshToken: z.string(),
    }),
  },
  "@get/Auth/me": {
    output: z.object({
      id: z.string(),
      email: z.string(),
      role: z.string(),
    }),
  },
  "@get/Car": {
    output: z.array(z.object({
      id: z.number(),
      brand: z.string(),
      model: z.string(),
      year: z.number(),
      pricePerDay: z.number(),
      description: z.string().nullable(),
      imageUrl: z.string().nullable(),
    })),
  },
  "@get/Car/:id": {
    output: z.object({
      id: z.number(),
      brand: z.string(),
      model: z.string(),
      year: z.number(),
      pricePerDay: z.number(),
      description: z.string().nullable(),
      imageUrl: z.string().nullable(),
      reservations: z.array(
        z.object({
          startDateTime: z.string(),
          endDateTime: z.string(),
        })
      ),
    }),
  },
  "@post/Car": {
    input: z.object({
      brand: z.string(),
      model: z.string(),
      year: z.number(),
      pricePerDay: z.number(),
      description: z.string().nullable(),
      imageUrl: z.string().nullable(),
    }),
    output: z.object({
      id: z.number(),
      brand: z.string(),
      model: z.string(),
      year: z.number(),
      pricePerDay: z.number(),
      description: z.string().nullable(),
      imageUrl: z.string().nullable(),
    }),
  },
  "@put/Car/:id": {
    input: z.object({
      id: z.number(),
      brand: z.string(),
      model: z.string(),
      year: z.number(),
      pricePerDay: z.number(),
      description: z.string().nullable(),
      imageUrl: z.string().nullable(),
    }),
    output: z.object({
      id: z.number(),
      brand: z.string(),
      model: z.string(),
      year: z.number(),
      pricePerDay: z.number(),
      description: z.string().nullable(),
      imageUrl: z.string().nullable(),
    }),
  },
  "@delete/Car/:id": {
    output: z.object({
      success: z.boolean(),
    }),
  },
  "@get/Review/car/:carId": {
    output: z.array(z.object({
      id: z.number(),
      rating: z.number(),
      comment: z.string().nullable(),
      carId: z.number(),
      userId: z.string(),
      userEmail: z.string(),
      createdAt: z.string(),
    })),
  },
  "@post/Review": {
    input: z.object({
      carId: z.number(),
      rating: z.number(),
      comment: z.string().nullable(),
    }),
    output: z.object({
      id: z.number(),
      rating: z.number(),
      comment: z.string().nullable(),
      carId: z.number(),
      userId: z.string(),
      userEmail: z.string(),
      createdAt: z.string(),
    }),
  },
  "@put/Review/:id": {
    input: z.object({
      rating: z.number(),
      comment: z.string().nullable(),
    }),
    output: z.object({
      id: z.number(),
      rating: z.number(),
      comment: z.string().nullable(),
      carId: z.number(),
      userId: z.string(),
      userEmail: z.string(),
      createdAt: z.string(),
    }),
  },
  "@delete/Review/:id": {
    output: z.object({
      success: z.boolean(),
    }),
  },
  "@get/Review/all": {
    output: z.array(z.object({
      id: z.number(),
      rating: z.number(),
      comment: z.string().nullable(),
      carId: z.number(),
      userId: z.string(),
      userEmail: z.string(),
      createdAt: z.string(),
    })),
  },
  "@get/Reports/monthly-revenue": {
    output: z.object({
      year: z.number(),
      month: z.number(),
      totalReservations: z.number(),
      totalRevenue: z.number(),
      averageReservationValue: z.number(),
    }),
  },
  "@get/Reports/user-history/:userId": {
    output: z.array(z.object({
      id: z.number(),
      carId: z.number(),
      brand: z.string(),
      model: z.string(),
      startDateTime: z.string(),
      endDateTime: z.string(),
      totalPrice: z.number(),
      createdAt: z.string(),
      status: z.string(),
    })),
  },
  "@get/Reports/discount/:userId": {
    output: z.object({
      userId: z.string(),
      discountPercentage: z.number(),
    }),
  },
  "@get/Reports/reservation-logs": {
    output: z.array(z.object({
      id: z.number(),
      reservationId: z.number(),
      userId: z.string(),
      action: z.string(),
      logDate: z.string(),
    })),
  },
  "@get/Reservation/admin/all": {
    output: z.array(z.object({
      id: z.number(),
      carId: z.number(),
      carBrand: z.string(),
      carModel: z.string(),
      userId: z.string(),
      userEmail: z.string(),
      startDateTime: z.string(),
      endDateTime: z.string(),
      totalPrice: z.number(),
      createdAt: z.string(),
    })),
  },
  "@get/Reservation": {
    output: z.array(z.object({
      id: z.number(),
      carId: z.number(),
      carBrand: z.string(),
      carModel: z.string(),
      startDateTime: z.string(),
      endDateTime: z.string(),
      totalPrice: z.number(),
      createdAt: z.string(),
    })),
  },
  "@post/Reservation": {
    input: z.object({
      carId: z.number(),
      startDateTime: z.string(),
      endDateTime: z.string(),
    }),
    output: z.object({
      id: z.number(),
      carId: z.number(),
      carBrand: z.string(),
      carModel: z.string(),
      startDateTime: z.string(),
      endDateTime: z.string(),
      totalPrice: z.number(),
      createdAt: z.string(),
    }),
  },
  "@delete/Reservation/:id": {
    output: z.object({
      success: z.boolean(),
    }),
  },
  "@delete/Reservation/admin/:id": {
    output: z.object({
      success: z.boolean(),
    }),
  },
});

export const betterFetch = createFetch({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_PATH}/api`,
  schema: apiSchema,
  auth: {
    type: "Bearer",
    token: () => useAuthStore.getState().accessToken ?? "",
  },
});
