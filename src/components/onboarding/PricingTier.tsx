
import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PricingTierProps {
  plan: string;
  teamSize: string;
  price: string;
  features: string[];
  isSelected: boolean;
  onClick: () => void;
}

const PricingTier: React.FC<PricingTierProps> = ({
  plan,
  teamSize,
  price,
  features,
  isSelected,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative cursor-pointer group rounded-xl p-6 transition-all duration-300",
        "border-2 hover:shadow-lg",
        isSelected
          ? "border-primary bg-primary/5 shadow-lg"
          : "border-border hover:border-primary/50"
      )}
    >
      <div className="space-y-4">
        <Badge variant={isSelected ? "default" : "secondary"} className="uppercase">
          {plan}
        </Badge>
        
        <div>
          <p className="text-2xl font-bold">{price}</p>
          <p className="text-muted-foreground">{teamSize}</p>
        </div>

        <ul className="space-y-2">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {isSelected && (
        <div className="absolute -top-3 -right-3">
          <Badge className="bg-primary">Selected</Badge>
        </div>
      )}
    </div>
  );
};

export default PricingTier;
