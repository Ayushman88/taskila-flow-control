
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BarChart2, 
  CheckCircle2, 
  Clock, 
  FileText, 
  List, 
  LogOut, 
  PlusCircle, 
  Settings, 
  Users 
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Organization {
  name: string;
  teamSize: string;
  plan: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  
  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/signin");
      return;
    }
    
    const user = JSON.parse(userStr);
    setUserEmail(user.email);
    
    // Get organization data
    const orgStr = localStorage.getItem("organization");
    if (orgStr) {
      setOrganization(JSON.parse(orgStr));
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
    navigate("/");
  };

  if (!organization) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">{organization.name}</h2>
          <p className="text-sm text-gray-500">{organization.plan} Plan</p>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md bg-gray-100 text-primary font-medium">
                <BarChart2 className="h-5 w-5" />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
                <List className="h-5 w-5" />
                <span>Tasks</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
                <Clock className="h-5 w-5" />
                <span>Time Tracking</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
                <FileText className="h-5 w-5" />
                <span>Files & Docs</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
                <Users className="h-5 w-5" />
                <span>Team</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        {/* Top bar */}
        <header className="bg-white p-4 shadow-sm flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">{userEmail}</div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="p-6">
          {/* Overview section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-gray-500 mb-2">Tasks</h3>
                <div className="flex justify-between items-end">
                  <div className="text-3xl font-bold">0</div>
                  <div className="text-gray-500 text-sm">No tasks yet</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-gray-500 mb-2">Projects</h3>
                <div className="flex justify-between items-end">
                  <div className="text-3xl font-bold">0</div>
                  <div className="text-gray-500 text-sm">No projects yet</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-gray-500 mb-2">Team Members</h3>
                <div className="flex justify-between items-end">
                  <div className="text-3xl font-bold">1</div>
                  <div className="text-gray-500 text-sm">Just you for now</div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick actions */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-auto py-6 justify-start">
                <PlusCircle className="mr-2 h-5 w-5" /> Create New Task
              </Button>
              <Button variant="outline" className="h-auto py-6 justify-start">
                <PlusCircle className="mr-2 h-5 w-5" /> Create New Project
              </Button>
              <Button variant="outline" className="h-auto py-6 justify-start">
                <Users className="mr-2 h-5 w-5" /> Invite Team Members
              </Button>
              <Button variant="outline" className="h-auto py-6 justify-start">
                <FileText className="mr-2 h-5 w-5" /> Create Document
              </Button>
            </div>
          </section>

          {/* Get started section */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Get Started</h2>
            <p className="text-gray-600 mb-6">Complete these steps to set up your workspace:</p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Create your organization</h3>
                  <p className="text-gray-500">You've created {organization.name}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full border-2 text-gray-300 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">2</div>
                <div>
                  <h3 className="font-medium">Create your first project</h3>
                  <p className="text-gray-500">Set up a project to organize your tasks</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full border-2 text-gray-300 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">3</div>
                <div>
                  <h3 className="font-medium">Invite team members</h3>
                  <p className="text-gray-500">Collaborate with your team in real-time</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
