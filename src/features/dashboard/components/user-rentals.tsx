"use client";

import Image from "next/image";
import CarImg from "@/assets/images/car.png";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar } from "lucide-react";
import useUserReservations from "@/hooks/use-user-reservations";
import useCancelReservation from "@/hooks/use-cancel-reservation";
import type { Reservation } from "@/types";

const UserRentals = () => {
  const { reservations, isLoading } = useUserReservations();
  const cancelReservation = useCancelReservation();

  const handleCancel = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this reservation?")) return;
    await cancelReservation.mutateAsync(id);
  };

  const getReservationStatus = (startDate: string, endDate: string): string => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < now) return "Completed";
    if (start <= now && end >= now) return "Active";
    return "Upcoming";
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">Loading reservations...</p>
        </CardContent>
      </Card>
    );
  }

  if (!reservations || reservations.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>My Rentals</CardTitle>
          <CardDescription>Your active and past reservations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">No reservations found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>My Rentals</CardTitle>
          <CardDescription>Your active and past reservations</CardDescription>
        </CardHeader>
      </Card>
      {reservations.map((reservation: Reservation) => {
        const status = getReservationStatus(reservation.startDateTime, reservation.endDateTime);
        const endDate = new Date(reservation.endDateTime);
        const now = new Date();
        // Can only cancel if end date is in the future
        const canCancel = endDate > now;

        return (
          <Card key={reservation.id} className="w-full">
            <CardContent className="flex flex-row items-center gap-6">
              <div className="relative">
                <Image
                  alt={`${reservation.carBrand} ${reservation.carModel}`}
                  height={100}
                  src={CarImg}
                  width={100}
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="font-semibold text-lg">
                    {reservation.carBrand} {reservation.carModel}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(reservation.startDateTime).toLocaleDateString()} - {new Date(reservation.endDateTime).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Price</p>
                    <p className="font-semibold text-lg">${reservation.totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status === "Completed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                        status === "Active" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                          "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }`}>
                      {status}
                    </span>
                    {canCancel && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancel(reservation.id)}
                        disabled={cancelReservation.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default UserRentals;
