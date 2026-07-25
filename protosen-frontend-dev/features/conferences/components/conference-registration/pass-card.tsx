import { CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface PassCardProps {
  name: string;
  price: number;
  features: string[];
  color?: "blue" | "purple" | "green";
  isSelected?: boolean;
  className?: string;
}

const PassCard = ({
  name,
  price,
  features,
  color,
  isSelected = false,
  className,
}: PassCardProps) => {
  const colorStyles = {
    blue: {
      border: isSelected ? "border-blue-500" : "",
      header: "bg-blue-50",
      title: "text-blue-700",
      price: "text-blue-700",
      check: "text-blue-500",
    },
    purple: {
      border: isSelected ? "border-purple-500" : "",
      header: "bg-purple-50",
      title: "text-purple-700",
      price: "text-purple-700",
      check: "text-purple-500",
    },
    green: {
      border: isSelected ? "border-green-500" : "",
      header: "bg-green-50",
      title: "text-green-700",
      price: "text-green-700",
      check: "text-green-500",
    },
  };

  // const style = colorStyles[color];

  return (
    <Card
      className={cn(
        "relative flex flex-col bg-white border-border dark:bg-slate-950 h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-md",
        isSelected ? "shadow-md ring-2 ring-offset-2 border-primary" : "",
        className
      )}
    >
      {isSelected && (
        <div className="absolute top-2 right-2">
          <CheckCircle className="h-5 w-5 text-primary" />
        </div>
      )}

      <CardHeader className={`pb-2`}>
        <CardTitle className={`text-xl text-foreground`}>{name}</CardTitle>
        <CardDescription className="flex items-baseline">
          <span className={`text-3xl font-bold `}>{price}FCFA</span>
          <span className="ml-1 text-muted-foreground">/ participant</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow pt-2">
        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-start">
              <CheckCircle className={`h-5 w-5 mr-2 text-primary`} />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PassCard;
