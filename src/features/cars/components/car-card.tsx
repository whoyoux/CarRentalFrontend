import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import CarImg from "@/assets/images/car.png";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { i18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type CarCardProps = {
  id: string;
  title: string;
  description: string;
  price: string;
};

const CarCard = ({ id, title, description, price }: CarCardProps) => (
  <Card className="corner-squircle">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <ViewTransition name={`car-img-${id}`}>
        <Image
          alt={i18n.cars.carImageAlt}
          className="aspect-video w-full object-cover"
          loading="eager"
          quality={100}
          src={CarImg}
        />
      </ViewTransition>

      <CardDescription>{price}</CardDescription>
    </CardContent>

    <CardFooter className="flex-col gap-2">
      <Link
        className={cn(buttonVariants({ variant: "default" }), "w-full")}
        href={`/rent/${id}`}
      >
        {i18n.cars.rent}
      </Link>
    </CardFooter>
  </Card>
);

export default CarCard;
