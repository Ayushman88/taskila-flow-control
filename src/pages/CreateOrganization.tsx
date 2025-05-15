import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import PricingTier from "@/components/onboarding/PricingTier";

const CreateOrganization = () => {
  const navigate = useNavigate();
  const [organizationName, setOrganizationName] = useState("");
  const [teamSize, setTeamSize] = useState("small");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pricingTiers = [
    {
      plan: "Free",
      teamSize: "1-3 members",
      price: "₹0/month",
      features: [
        "Basic task management",
        "Up to 3 team members",
        "1 Organization",
        "Basic templates",
      ],
    },
    {
      plan: "Pro",
      teamSize: "4-10 members",
      price: "₹200/month",
      features: [
        "Advanced task management",
        "Up to 10 team members",
        "Multiple Organizations",
        "Custom templates",
        "Priority support",
      ],
    },
    {
      plan: "Enterprise",
      teamSize: "10+ members",
      price: "₹500/month",
      features: [
        "Enterprise-grade security",
        "Unlimited team members",
        "Advanced analytics",
        "24/7 support",
        "Custom integrations",
        "API access",
      ],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!organizationName.trim()) {
      toast({
        title: "Error",
        description: "Please enter an organization name",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      localStorage.setItem(
        "organization",
        JSON.stringify({
          name: organizationName,
          teamSize,
          plan:
            teamSize === "small"
              ? "Free"
              : teamSize === "medium"
              ? "Pro"
              : "Enterprise",
        })
      );

      toast({
        title: "Success!",
        description: "Your organization has been created.",
      });

      navigate("/signin");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto p-4 py-12 space-y-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Button>

        <div className="space-y-6n">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Create Your Organization
            </h1>
            <p className="text-muted-foreground">
              Choose a plan that best fits your team's needs
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-8 flex flex-col justify-center mt-10"
          >
            <div className="space-y-2 flex flex-col gap-4 justify-center items-center">
              <Label htmlFor="organization-name text-center">
                Organization Name
              </Label>
              <Input
                id="organization-name"
                placeholder="Enter organization name"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="max-w-md mx-auto"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingTiers.map((tier, idx) => (
                <PricingTier
                  key={tier.plan}
                  plan={tier.plan}
                  teamSize={tier.teamSize}
                  price={tier.price}
                  features={tier.features}
                  isSelected={
                    (teamSize === "small" && idx === 0) ||
                    (teamSize === "medium" && idx === 1) ||
                    (teamSize === "large" && idx === 2)
                  }
                  onClick={() =>
                    setTeamSize(
                      idx === 0 ? "small" : idx === 1 ? "medium" : "large"
                    )
                  }
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full max-w-md mx-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Organization"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganization;
