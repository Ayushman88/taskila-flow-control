
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { joinOrganizationWithCode } from "@/services/organization";
import { toast } from "@/hooks/use-toast";

const JoinOrganization = () => {
  const [joinCode, setJoinCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!joinCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid join code",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to join an organization",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const organizationId = await joinOrganizationWithCode(
        joinCode.trim(),
        user.uid,
        user.email || "",
        profile ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() : undefined
      );
      
      // Set as current organization
      localStorage.setItem("currentOrganizationId", organizationId);
      
      toast({
        title: "Success",
        description: "You have joined the organization",
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join organization",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Join an Organization</CardTitle>
        <CardDescription>Enter the organization join code to become a member</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleJoin} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="joinCode"
              placeholder="Enter organization code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Joining..." : "Join Organization"}
          </Button>
          
          <div className="text-center pt-2">
            <Button 
              variant="link"
              type="button"
              className="text-sm"
              onClick={() => navigate("/create-organization")}
            >
              Or create your own organization
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default JoinOrganization;
