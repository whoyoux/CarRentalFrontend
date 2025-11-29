"use client";

import Image from "next/image";
import CarImg from "@/assets/images/car.png";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar } from "lucide-react";
import useUserReservations from "@/hooks/use-user-reservations";
import useCancelReservation from "@/hooks/use-cancel-reservation";
import type { Reservation } from "@/types";
import { i18n } from "@/lib/i18n";

const UserRentals = () => {
  const { reservations, isLoading } = useUserReservations();
  const cancelReservation = useCancelReservation();

  const handleCancel = async (id: number) => {
    if (!confirm(i18n.dashboard.myRentals.cancelConfirm)) return;
    await cancelReservation.mutateAsync(id);
  };

  const getReservationStatus = (startDate: string, endDate: string): string => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < now) return i18n.dashboard.myRentals.status.completed;
    if (start <= now && end >= now) return i18n.dashboard.myRentals.status.active;
    return i18n.dashboard.myRentals.status.upcoming;
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">{i18n.dashboard.myRentals.loading}</p>
        </CardContent>
      </Card>
    );
  }

  if (!reservations || reservations.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{i18n.dashboard.myRentals.title}</CardTitle>
          <CardDescription>{i18n.dashboard.myRentals.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">{i18n.dashboard.myRentals.noReservations}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{i18n.dashboard.myRentals.title}</CardTitle>
          <CardDescription>{i18n.dashboard.myRentals.description}</CardDescription>
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
                    <p className="text-sm text-muted-foreground">{i18n.dashboard.myRentals.totalPrice}</p>
                    <p className="font-semibold text-lg">${reservation.totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status === i18n.dashboard.myRentals.status.completed ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                        status === i18n.dashboard.myRentals.status.active ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
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
                        {i18n.dashboard.myRentals.cancel}
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
