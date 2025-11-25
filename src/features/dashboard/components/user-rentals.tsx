import Image from "next/image";
import CarImg from "@/assets/images/car.png";
import { Card, CardContent } from "@/components/ui/card";

const UserRentals = () => (
  <div className="flex flex-col gap-4">
    <UserRental />
    <UserRental />
    <UserRental />
    <UserRental />
    <UserRental />
  </div>
);

const UserRental = () => (
  <Card>
    <CardContent className="flex flex-row items-center gap-8">
      <Image alt="sedan" height={65} src={CarImg} width={65} />
    </CardContent>
  </Card>
);

export default UserRentals;
