import React, { useState } from "react";

type PlanFeature = {
  text: string;
  included: boolean;
};

type Plan = {
  type: string;
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  buttonText: string;
};

type PricingCardProps = {
  plan: Plan;
  isMiddle: boolean;
};

const PricingCard: React.FC<PricingCardProps> = ({ plan, isMiddle }) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses = `
    relative overflow-hidden
    ${
      isMiddle
        ? "bg-gradient-to-br from-yellow-300 to-yellow-500"
        : "bg-gradient-to-br from-slate-800 to-slate-900"
    }
    rounded-3xl p-8 h-full
    transform transition-all duration-500
    ${isHovered ? "scale-105" : "scale-100"}
    flex flex-col items-center
  `;

  return (
    <div
      className={baseClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background circles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div
          className={`
          absolute w-64 h-64 rounded-full 
          ${isMiddle ? "bg-yellow-200" : "bg-slate-700"} 
          opacity-20 -top-32 -left-32
          transform transition-transform duration-700
          ${isHovered ? "scale-150" : "scale-100"}
        `}
        />
        <div
          className={`
          absolute w-64 h-64 rounded-full 
          ${isMiddle ? "bg-yellow-400" : "bg-slate-600"} 
          opacity-20 -bottom-32 -right-32
          transform transition-transform duration-700
          ${isHovered ? "scale-150" : "scale-100"}
        `}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <span
          className={`
          text-sm font-bold px-4 py-1 rounded-full mb-4
          ${isMiddle ? "bg-black text-yellow-300" : "bg-white text-black"}
          transform transition-all duration-300
          ${isHovered ? "translate-y-1" : ""}
        `}
        >
          {plan.type}
        </span>

        <h2
          className={`
          text-3xl font-bold mb-2
          ${isMiddle ? "text-black" : "text-white"}
        `}
        >
          {plan.name}
        </h2>

        <p
          className={`
          text-xl font-semibold mb-6
          ${isMiddle ? "text-black" : "text-white"}
        `}
        >
          {plan.price}
        </p>

        <p
          className={`
          text-center mb-8 text-sm
          ${isMiddle ? "text-black" : "text-gray-300"}
        `}
        >
          {plan.description}
        </p>

        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, index) => (
            <li
              key={index}
              className={`
                flex items-center space-x-2
                ${isMiddle ? "text-black" : "text-white"}
                transform transition-all duration-300
                ${isHovered ? "translate-x-2" : ""}
              `}
            >
              <span className="text-lg">{feature.included ? "✨" : "○"}</span>
              <span className={feature.included ? "" : "opacity-50"}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        <button
          className={`
          px-8 py-3 rounded-full font-bold
          transform transition-all duration-300
          ${
            isMiddle
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-white text-black hover:bg-gray-200"
          }
          ${isHovered ? "scale-105" : "scale-100"}
        `}
        >
          {plan.buttonText}
        </button>
      </div>
    </div>
  );
};

const Price: React.FC = () => {
  const plans: Plan[] = [
    {
      type: "STARTER",
      name: "Free Plan",
      price: "₹0",
      description:
        "Great for individuals and small teams getting started with Taskila.",
      features: [
        { text: "Create 1 Organization", included: true },
        { text: "Add up to 5 Users", included: true },
        { text: "Create Projects & Tasks", included: true },
        { text: "Advanced HR/Finance", included: false },
        { text: "AI-powered tasks", included: false },
      ],
      buttonText: "Get Started",
    },
    {
      type: "POPULAR",
      name: "Pro Plan",
      price: "₹400/month",
      description:
        "Perfect for growing teams needing role-based management & AI tools.",
      features: [
        { text: "Add up to 50 Users", included: true },
        { text: "Assign Roles (HR, Finance, Manager)", included: true },
        { text: "Use AI for Task Management", included: true },
        { text: "Unlimited Storage & Tasks", included: false },
      ],
      buttonText: "Get Pro",
    },
    {
      type: "ENTERPRISE",
      name: "Enterprise",
      price: "Custom",
      description:
        "Best for large businesses needing full control, integrations, and unlimited access.",
      features: [
        { text: "Unlimited Users", included: true },
        { text: "Full HR & Finance Tools", included: true },
        { text: "API Integrations", included: true },
        { text: "Fully Customizable", included: true },
      ],
      buttonText: "Contact Us",
    },
  ];

  return (
    <div className="min-h-screen bg-white p-8 md:p-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600 mb-4">
            Plans & Pricing
          </h1>
          <p className="text-lg text-gray-600">
            Choose the perfect plan for your team's needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard key={index} plan={plan} isMiddle={index === 1} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Price;
