import Image from "next/image";
import { useRouter } from "next/navigation";
import CarImg from "@/assets/images/car.png";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { i18n } from "@/lib/i18n";
import { useAuthStore } from "@/stores/auth-store";

type CarCardProps = {
  id: string;
  title: string;
  description: string;
  price: string;
};

const CarCard = ({ title, description, price }: CarCardProps) => {
  const router = useRouter();
  const isAuthed = useAuthStore((state) => state.isAuthenticated);

  const rent = () => {
    if (!isAuthed()) {
      router.push("/login");
    }
  };

  return (
    <Card className="corner-squircle">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Image
          alt={i18n.cars.carImageAlt}
          className="w-full object-contain"
          loading="eager"
          src={CarImg}
        />

        <CardDescription>{price}</CardDescription>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <Button className="w-full" onClick={rent}>
          {i18n.cars.rent}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CarCard;
