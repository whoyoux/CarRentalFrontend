"use client";

import CarCard from "@/features/cars/components/car-card";
import useCars from "@/hooks/use-cars";
import { i18n } from "@/lib/i18n";

export default function Home() {
  const { cars, isLoading, error } = useCars();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{i18n.cars.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-destructive">{i18n.cars.loadError}</p>
      </div>
    );
  }

  if (!cars || cars.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{i18n.cars.noCars}</p>
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
            price={`$${car.pricePerDay} ${i18n.cars.perDay}`}
            imageUrl={car.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}

