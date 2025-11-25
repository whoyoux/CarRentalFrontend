import { notFound } from "next/navigation";
import RentCar from "@/features/rent-car/components/rent-car-page";

const RentCarPage = async (props: PageProps<"/rent/[carId]">) => {
  const { carId } = await props.params;

  if (!carId) {
    return notFound();
  }

  return <RentCar carId={carId} />;
};

export default RentCarPage;
