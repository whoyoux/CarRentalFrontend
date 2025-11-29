// Types matching backend DTOs

export type Car = {
  id: number;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  description?: string | null;
  imageUrl?: string | null;
};

export type Reservation = {
  id: number;
  carId: number;
  carBrand: string;
  carModel: string;
  startDateTime: string;
  endDateTime: string;
  totalPrice: number;
  createdAt: string;
};

export type AdminReservation = {
  id: number;
  carId: number;
  carBrand: string;
  carModel: string;
  userId: string;
  userEmail: string;
  startDateTime: string;
  endDateTime: string;
  totalPrice: number;
  createdAt: string;
};

export type UserReservationHistory = {
  id: number;
  carId: number;
  brand: string;
  model: string;
  startDateTime: string;
  endDateTime: string;
  totalPrice: number;
  createdAt: string;
  status: string;
};

export type ReservationPeriod = {
  startDateTime: string;
  endDateTime: string;
};

export type CarDetails = {
  id: number;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  description?: string | null;
  imageUrl?: string | null;
  reservations: ReservationPeriod[];
};

export type MonthlyRevenueReport = {
  totalReservations: number;
  totalRevenue: number;
  averageReservationValue: number;
};

export type UserDiscount = {
  discountPercentage: number;
};

export type ErrorWithMessage = {
  message?: string;
};

export type ReservationLog = {
  id: number;
  reservationId: number;
  userId: string;
  action: string;
  logDate: string;
};

