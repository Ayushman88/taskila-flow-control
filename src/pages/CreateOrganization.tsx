import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import PricingTier from "@/components/onboarding/PricingTier";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/integrations/firebase/client";
import { doc, setDoc, addDoc, collection, getFirestore } from "firebase/firestore";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CreateOrganization = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [organizationName, setOrganizationName] = useState("");
  const [teamSize, setTeamSize] = useState("small");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const pricingTiers = [
    {
      plan: "Free",
      teamSize: "1-3 members",
      price: "₹0/month",
      amount: 0,
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
      amount: 20000, // Amount in paise (₹200)
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
      amount: 50000, // Amount in paise (₹500)
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

  const handleSubmit = async (e: React.FormEvent) => {
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

    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in first",
        variant: "destructive",
      });
      setIsSubmitting(false);
      navigate("/signin");
      return;
    }

    const selectedTier = pricingTiers[
      teamSize === "small" ? 0 : teamSize === "medium" ? 1 : 2
    ];

    try {
      // For free plan, create organization directly
      if (selectedTier.amount === 0) {
        await createOrganization();
        return;
      }

      // For paid plans, initialize Razorpay
      if (!isRazorpayLoaded) {
        throw new Error("Razorpay SDK not loaded");
      }

      // Create a Razorpay order
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_6fZRlRpRX5Mny0", // Replace with your Razorpay key
        amount: selectedTier.amount,
        currency: "INR",
        name: "Taskila",
        description: `Subscription for ${selectedTier.plan} plan`,
        handler: async (response: any) => {
          // Payment successful, create organization
          await createOrganization(response.razorpay_payment_id);
        },
        prefill: {
          name: user?.displayName || "",
          email: user?.email || "",
        },
        theme: {
          color: "#6366F1",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
      // Reset submitting state when the Razorpay modal is closed
      razorpay.on('payment.failed', function (response: any) {
        toast({
          title: "Payment Failed",
          description: response.error.description,
          variant: "destructive",
        });
        setIsSubmitting(false);
      });
      
    } catch (error: any) {
      console.error("Error processing payment:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const createOrganization = async (paymentId?: string) => {
    try {
      if (!user) {
        throw new Error("User is not authenticated");
      }
      
      const selectedPlan = teamSize === "small" ? "Free" : teamSize === "medium" ? "Pro" : "Enterprise";
      const teamSizeValue = teamSize === "small" ? "small" : teamSize === "medium" ? "medium" : "large";
      
      // Create organization in Firestore
      const orgRef = collection(db, 'organizations');
      const orgDoc = await addDoc(orgRef, {
        name: organizationName,
        team_size: teamSizeValue,
        plan: selectedPlan,
        payment_id: paymentId || null,
        subscription_status: 'active', // Mark as active regardless of plan type
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      console.log("Organization created with ID:", orgDoc.id);

      // Link user to organization with a predictable ID format (userId_orgId)
      const memberDocId = `${user.uid}_${orgDoc.id}`;
      await setDoc(doc(db, 'organization_members', memberDocId), {
        organization_id: orgDoc.id,
        user_id: user.uid,
        role: 'admin',
        created_at: new Date().toISOString()
      });

      console.log("Organization member link created with ID:", memberDocId);

      // Save organization to localStorage for immediate use
      localStorage.setItem("currentOrganizationId", orgDoc.id);
      
      toast({
        title: "Success!",
        description: "Your organization has been created.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error creating organization:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create organization",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto p-4 py-12 space-y-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Button>

        <div className="space-y-6">
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
            className="space-y-8 flex flex-col justify-center items-center"
          >
            <div className="space-y-2 w-full flex flex-col items-center justify-center">
              <Label htmlFor="organization-name">Organization Name</Label>
              <Input
                id="organization-name"
                placeholder="Enter organization name"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full max-w-md"
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
