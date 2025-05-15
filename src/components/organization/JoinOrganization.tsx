
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/integrations/firebase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { collection, query, where, getDocs, doc, setDoc, getDoc } from "firebase/firestore";

const JoinOrganization = () => {
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleJoinOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter an invite code",
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
      // Look for the invitation in the database
      const invitationsQuery = query(
        collection(db, 'organization_invitations'),
        where('code', '==', inviteCode.trim())
      );
      
      const querySnapshot = await getDocs(invitationsQuery);
      
      if (querySnapshot.empty) {
        toast({
          title: "Invalid Invite Code",
          description: "The invite code you entered is invalid or has expired",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      const invitationDoc = querySnapshot.docs[0];
      const invitationData = invitationDoc.data();
      const organizationId = invitationData.organization_id;
      
      // Check if the organization exists
      const orgRef = doc(db, 'organizations', organizationId);
      const orgDoc = await getDoc(orgRef);
      
      if (!orgDoc.exists()) {
        toast({
          title: "Error",
          description: "The organization no longer exists",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Check if user is already a member
      const membershipId = `${user.uid}_${organizationId}`;
      const membershipRef = doc(db, 'organization_members', membershipId);
      const membershipDoc = await getDoc(membershipRef);
      
      if (membershipDoc.exists()) {
        // User is already a member, just redirect to the dashboard
        localStorage.setItem("currentOrganizationId", organizationId);
        toast({
          title: "Success",
          description: "You are already a member of this organization. Redirecting to dashboard.",
        });
        navigate("/dashboard");
        return;
      }
      
      // Add user as a member of the organization
      await setDoc(doc(db, 'organization_members', membershipId), {
        organization_id: organizationId,
        user_id: user.uid,
        role: 'member',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      // Set as current organization
      localStorage.setItem("currentOrganizationId", organizationId);
      
      toast({
        title: "Success!",
        description: "You have successfully joined the organization.",
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error joining organization:", error);
      toast({
        title: "Error",
        description: "Failed to join organization. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <form onSubmit={handleJoinOrganization} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="inviteCode" className="block text-sm font-medium">
            Organization Invite Code
          </label>
          <Input
            id="inviteCode"
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Enter your invite code"
            required
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          disabled={isLoading}
        >
          {isLoading ? "Joining..." : "Join Organization"}
        </Button>
        <div className="text-center mt-4">
          <Button 
            variant="link" 
            type="button" 
            onClick={() => navigate("/create-organization")}
            className="text-indigo-600"
          >
            Or create your own organization
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JoinOrganization;
