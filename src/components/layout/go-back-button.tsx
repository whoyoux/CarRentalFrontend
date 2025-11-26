import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

type GoBackButtonProps = {
  href: string
}

const GoBackButton = ({ href }: GoBackButtonProps) => {
  return (
    <Link href={href}>
      <Button variant="outline">
        <ArrowLeft />
        Go back
      </Button>
    </Link>
  );
};

export default GoBackButton;
