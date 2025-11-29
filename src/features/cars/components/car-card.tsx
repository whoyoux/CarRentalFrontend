"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useState, ViewTransition } from "react";
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
  imageUrl?: string | null;
};

const CarCard = ({ id, title, description, price, imageUrl }: CarCardProps) => {
  const [image, setImage] = useState<string | StaticImageData>(imageUrl || CarImg);

  return (
    <Card className="corner-squircle h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="h-12 line-clamp-2 truncate">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ViewTransition name={`car-img-${id}`}>
          <Image
            alt={i18n.cars.carImageAlt}
            className="aspect-video w-full object-cover rounded-lg mb-4"
            loading="eager"
            quality={100}
            src={image}
            width={500}
            height={500}
            onError={() => setImage(CarImg)}
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
}

export default CarCard;
