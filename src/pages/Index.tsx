
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Briefcase, Calendar, FileText, Users, BarChart2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/create-organization");
  };

  const features = [
    { 
      icon: <Briefcase className="h-6 w-6 text-primary" />, 
      title: "Task & Project Management", 
      description: "Kanban boards, Gantt charts, and task lists for any type of project." 
    },
    { 
      icon: <FileText className="h-6 w-6 text-primary" />, 
      title: "Notes & Documents", 
      description: "Collaborative rich-text editor with file sharing capabilities." 
    },
    { 
      icon: <Calendar className="h-6 w-6 text-primary" />, 
      title: "Time Management", 
      description: "Track time, set deadlines, and sync with your calendar." 
    },
    { 
      icon: <Users className="h-6 w-6 text-primary" />, 
      title: "Team Collaboration", 
      description: "Chat, comments, @mentions, and real-time notifications." 
    },
    { 
      icon: <BarChart2 className="h-6 w-6 text-primary" />, 
      title: "Analytics & Reporting", 
      description: "Visualize progress and generate insightful reports." 
    },
  ];

  const pricingTiers = [
    {
      name: "Free",
      price: "₹0",
      description: "For small teams of 1-3 members",
      features: [
        "Basic task management",
        "2 projects",
        "File sharing (100MB)",
        "Basic reporting",
      ],
    },
    {
      name: "Pro",
      price: "₹200",
      description: "For growing teams of 4-10 members",
      features: [
        "Everything in Free",
        "Unlimited projects",
        "Advanced task management",
        "AI-powered features",
        "File sharing (10GB)",
        "Time tracking",
      ],
    },
    {
      name: "Enterprise",
      price: "₹500",
      description: "For large teams of 10+ members",
      features: [
        "Everything in Pro",
        "Custom workflows",
        "Advanced security",
        "Priority support",
        "File sharing (100GB)",
        "Custom integrations",
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Manage Any Project with Taskila</h1>
            <p className="text-xl md:text-2xl mb-8">
              The all-in-one project management solution for animation, startups, events, and everything in between.
            </p>
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-white text-purple-700 hover:bg-gray-100 text-lg px-8 py-6 h-auto"
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Everything You Need to Succeed</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-center text-gray-600 mb-12">Choose the plan that works for your team</p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <div key={index} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6 bg-white">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="text-3xl font-bold mb-2">{tier.price}<span className="text-lg font-normal text-gray-600">/month</span></div>
                  <p className="text-gray-600 mb-6">{tier.description}</p>
                  <Button 
                    className="w-full mb-6" 
                    variant={index === 1 ? "default" : "outline"}
                    onClick={handleGetStarted}
                  >
                    Get Started
                  </Button>
                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">Taskila</h2>
              <p className="text-gray-400">Project management for everyone</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Taskila. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
