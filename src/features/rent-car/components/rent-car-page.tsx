"use client";

import Image, { StaticImageData } from "next/image";
import { useEffect, useState, ViewTransition } from "react";
import CarImg from "@/assets/images/car.png";
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
import ReviewsSection from "@/features/cars/components/reviews-section";
import RentalCalendar from "./rental-calendar";
import useCreateReservation from "@/hooks/use-create-reservation";
import { i18n } from "@/lib/i18n";

type RentCarProps = {
  carId: string;
};

const RentCar = ({ carId }: RentCarProps) => {
  const { user } = useUser();
  const { car, isLoading, error } = useCar(carId);
  const [image, setImage] = useState<string | StaticImageData>(CarImg);
  const createReservation = useCreateReservation();

  useEffect(() => setImage(car?.imageUrl ?? CarImg), [car]);

  const isLoggedIn = user?.data;

  const handleRent = async (startDate: Date, endDate: Date) => {
    if (!car) return;

    // Set time to start of day for start date and end of day for end date
    const startDateTime = new Date(startDate);
    startDateTime.setHours(0, 0, 0, 0);
    
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);

    await createReservation.mutateAsync({
      carId: car.id,
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{i18n.rentCar.loading}</p>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-destructive">{i18n.rentCar.loadError}</p>
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
              src={image}
              width={500}
              onError={() => setImage(CarImg)}
            />
          </ViewTransition>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{car.brand} {car.model}</CardTitle>
              <CardDescription>{car.year}</CardDescription>
              <CardContent className="flex flex-col gap-4 px-0">
                {car.description && (
                  <p className="">
                    {car.description}
                  </p>
                )}
                {car.reservations && car.reservations.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold">{i18n.rentCar.upcomingReservations}</h3>
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
                  <span className="text-red-500">${car.pricePerDay}</span> {i18n.cars.perDay}
                </span>
              </CardContent>
            </CardHeader>
          </Card>
          {isLoggedIn ? (
            <RentalCalendar
              reservations={car.reservations || []}
              pricePerDay={car.pricePerDay}
              onRent={handleRent}
              isLoading={createReservation.isPending}
            />
          ) : (
            <Card className="w-full">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  {i18n.rentCar.loginRequired}
                </p>
              </CardContent>
            </Card>
          )}
          <ReviewsSection carId={carId} />
        </div>
      </div>
    </ViewTransition>
  );
};

export default RentCar;
