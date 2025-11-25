"use client";

import CarCard from "@/features/cars/components/car-card";

const CAR_EXAMPLE = {
  id: "test123",
  title: "BMW M6 Competition",
  description: "Sports car",
  price: "$600 per day",
};

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      <div className="grid grid-cols-2 gap-4">
        <CarCard {...CAR_EXAMPLE} id={"test"} />
        <CarCard {...CAR_EXAMPLE} id={"test2"} />
        <CarCard {...CAR_EXAMPLE} id={"test3"} />
        <CarCard {...CAR_EXAMPLE} />
      </div>
    </div>
  );
}
