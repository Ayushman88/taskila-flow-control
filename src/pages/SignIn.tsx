import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { FcGoogle } from "react-icons/fc";

const SignIn = () => {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, user, loadUserOrganizations } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (user && !isRedirecting) {
      setIsRedirecting(true);
      handleSuccessfulAuth();
    }
  }, [user]);

  const handleSuccessfulAuth = async () => {
    try {
      // Load user's organizations
      const organizations = await loadUserOrganizations();
      
      if (organizations.length > 0) {
        // User has at least one organization, select it and redirect to dashboard
        localStorage.setItem("currentOrganizationId", organizations[0].id);
        navigate("/dashboard");
      } else {
        // User doesn't have organization, redirect to create one
        navigate("/create-organization");
      }
    } catch (error) {
      console.error("Error during redirection:", error);
      navigate("/create-organization");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      await signIn(email, password);
      
      toast({
        title: "Success!",
        description: "You've been signed in successfully.",
      });
      
      // The useEffect will handle redirection
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message || "An error occurred while signing in",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // The useEffect will handle redirection
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
    }
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
              
              <div className="relative flex items-center justify-center mt-4">
                <div className="border-t border-gray-300 flex-grow"></div>
                <div className="mx-4 text-sm text-gray-500">OR</div>
                <div className="border-t border-gray-300 flex-grow"></div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="w-full border border-gray-300 flex items-center justify-center gap-2"
                onClick={handleGoogleSignIn}
              >
                <FcGoogle className="h-5 w-5" />
                Sign in with Google
              </Button>
              
              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link 
                  to="/signup"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
