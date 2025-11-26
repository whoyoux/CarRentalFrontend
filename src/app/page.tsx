"use client";

import CarCard from "@/features/cars/components/car-card";
import useCars from "@/hooks/use-cars";

export default function Home() {
  const { cars, isLoading, error } = useCars();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading cars...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-destructive">Failed to load cars. Please try again later.</p>
      </div>
    );
  }

  if (!cars || cars.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">No cars available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <div className="grid grid-cols-2 gap-4">
        {cars.map((car) => (
          <CarCard
            key={car.id}
            id={car.id.toString()}
            title={`${car.brand} ${car.model}`}
            description={car.description || `${car.year}`}
            price={`$${car.pricePerDay} per day`}
            imageUrl={car.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}

