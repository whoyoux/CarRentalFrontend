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
  imageUrl?: string;
};

const CarCard = ({ id, title, description, price, imageUrl }: CarCardProps) => (
  <Card className="corner-squircle">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <ViewTransition name={`car-img-${id}`}>
        <Image
          alt={i18n.cars.carImageAlt}
          className="aspect-video w-full object-cover rounded-lg mb-4"
          loading="eager"
          quality={100}
          src={imageUrl || CarImg}
          width={500}
          height={500}
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
