"use client";

import Image from "next/image";
import { ViewTransition } from "react";
import CarImg from "@/assets/images/car.png";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useCar from "@/hooks/use-car";
import useUser from "@/hooks/use-user";
import GoBackButton from "@/components/layout/go-back-button";

type RentCarProps = {
  carId: string;
};

const RentCar = ({ carId }: RentCarProps) => {
  const { user } = useUser();
  const { car, isLoading, error } = useCar(carId);

  const isLoggedIn = user?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading car details...</p>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-destructive">Failed to load car details. Please try again later.</p>
      </div>
    );
  }

  return (
    <ViewTransition>
      <div className="flex flex-col gap-8">
        <GoBackButton href="/" />
        <div className="flex flex-col items-center gap-8">
          <ViewTransition name={`car-img-${carId}`}>
            <Image
              alt={`${car.brand} ${car.model}`}
              className="aspect-square w-full object-cover w-full rounded-lg bg-muted"
              height={500}
              priority
              quality={100}
              src={car.imageUrl || CarImg}
              width={500}
            />
          </ViewTransition>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{car.brand} {car.model}</CardTitle>
              <CardDescription>{car.year} - {car.description || "Luxury vehicle"}</CardDescription>
              <CardContent className="flex flex-col gap-4 px-0">
                {car.description && (
                  <p className="">
                    {car.description}
                  </p>
                )}
                {car.reservations && car.reservations.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold">Upcoming Reservations:</h3>
                    <ul className="text-sm text-muted-foreground">
                      {car.reservations.map((reservation, index) => (
                        <li key={index}>
                          {new Date(reservation.startDateTime).toLocaleDateString()} - {new Date(reservation.endDateTime).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <span className="text-right font-semibold text-xl">
                  <span className="text-red-500">${car.pricePerDay}</span> per day
                </span>
                <Button className="w-full" disabled={!isLoggedIn}>
                  {isLoggedIn ? "Rent" : "Please log in first"}
                </Button>
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      </div>
    </ViewTransition>
  );
};

export default RentCar;
