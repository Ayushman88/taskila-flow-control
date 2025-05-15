
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!email.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // Store user info (in a real app, this would validate against a database)
      localStorage.setItem("user", JSON.stringify({ email }));
      
      toast({
        title: "Success!",
        description: "You've been signed in successfully.",
      });

      // Redirect to dashboard
      navigate("/dashboard");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      <div className="container max-w-md mx-auto p-4 py-12">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Button>

        <div className="bg-white rounded-lg shadow-md p-6 border border-indigo-100">
          <h1 className="text-2xl font-bold mb-6 text-indigo-800">Sign In to Taskila</h1>
          
          <p className="mb-6 text-gray-600">
            Welcome back! Please sign in to continue.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-indigo-200 focus-visible:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-indigo-200 focus-visible:ring-indigo-500"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
              
              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <button 
                  type="button"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
