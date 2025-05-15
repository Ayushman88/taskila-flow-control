
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JoinOrganizationComponent from "@/components/organization/JoinOrganization";
import { useAuth } from "@/context/AuthContext";

const JoinOrganization = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/signin", { state: { from: "/join-organization" } });
    }
  }, [user, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-800">Join an Organization</h1>
        <JoinOrganizationComponent />
      </div>
    </div>
  );
};

export default JoinOrganization;
