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
// import useCar from "@/hooks/use-car";
import useUser from "@/hooks/use-user";

type RentCarProps = {
  carId: string;
};

const RentCar = ({ carId }: RentCarProps) => {
  const { user } = useUser();
  // const { data } = useCar();

  const isLoggedIn = user?.data;

  return (
    <ViewTransition>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center">
          <ViewTransition name={`car-img-${carId}`}>
            <div className="relative aspect-square w-full max-w-md">
              <Image alt="sedan" fill priority quality={100} src={CarImg} />
            </div>
          </ViewTransition>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>BMW M6 Competition</CardTitle>
              <CardDescription>Sports car {carId}</CardDescription>
              <CardContent className="flex flex-col gap-4 px-0">
                <p className="">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                  eleifend nibh ac mollis vestibulum. Fusce fringilla nisl ac
                  vestibulum dictum. Pellentesque nisl enim, ultricies et
                  pharetra et, dictum id felis. Sed finibus porta ultricies.
                  Duis faucibus tellus malesuada velit faucibus, sit amet
                  pharetra tortor vehicula.
                </p>
                <span className="text-right font-semibold text-xl">
                  <span className="text-red-500">$600</span> per day
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
