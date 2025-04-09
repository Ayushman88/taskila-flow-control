
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart2, 
  List, 
  LogOut, 
  PlusCircle, 
  Settings, 
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Search,
  KanbanSquare,
  GanttChartSquare,
  BookOpen,
  Menu,
  Clock,
  ArrowLeft,
  UserPlus,
  Shield,
  Mail,
  Phone,
  MessageCircle,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  User,
  Star
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { TaskProvider, useTaskContext } from "@/context/TaskContext";
import InviteTeamModal from "@/components/dashboard/InviteTeamModal";

interface Organization {
  name: string;
  teamSize: string;
  plan: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  department: string;
  joinedAt: string;
  recentActivity?: string;
  skills: string[];
  assignedTasks: number;
  completedTasks: number;
  productivity: number;
}

// Sample team members for demonstration
const sampleTeamMembers: TeamMember[] = [
  {
    id: "user1",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Product Manager",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Jane",
    status: "online",
    department: "Product",
    joinedAt: "2023-01-15",
    recentActivity: "Updated project timeline",
    skills: ["Strategy", "User Research", "Roadmapping"],
    assignedTasks: 12,
    completedTasks: 8,
    productivity: 85
  },
  {
    id: "user2",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Frontend Developer",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=John",
    status: "away",
    department: "Engineering",
    joinedAt: "2023-02-10",
    recentActivity: "Pushed code to main branch",
    skills: ["React", "TypeScript", "CSS"],
    assignedTasks: 15,
    completedTasks: 11,
    productivity: 78
  },
  {
    id: "user3",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "UX Designer",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex",
    status: "online",
    department: "Design",
    joinedAt: "2023-03-05",
    recentActivity: "Uploaded new mockups",
    skills: ["Figma", "User Testing", "Wireframing"],
    assignedTasks: 8,
    completedTasks: 7,
    productivity: 92
  },
  {
    id: "user4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "Backend Developer",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah",
    status: "offline",
    department: "Engineering",
    joinedAt: "2023-01-20",
    recentActivity: "Deployed API update",
    skills: ["Node.js", "Python", "MongoDB"],
    assignedTasks: 14,
    completedTasks: 12,
    productivity: 89
  },
  {
    id: "user5",
    name: "Michael Brown",
    email: "michael@example.com",
    role: "DevOps Engineer",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Michael",
    status: "online",
    department: "Engineering",
    joinedAt: "2023-02-28",
    recentActivity: "Set up CI/CD pipeline",
    skills: ["Docker", "AWS", "Kubernetes"],
    assignedTasks: 10,
    completedTasks: 7,
    productivity: 75
  }
];

// Sample invitations for demonstration
const sampleInvitations = [
  {
    id: "inv1",
    email: "david.wilson@example.com",
    role: "Marketing Specialist",
    sentAt: "2023-04-05",
    status: "pending"
  },
  {
    id: "inv2",
    email: "rebecca.jones@example.com",
    role: "Quality Assurance",
    sentAt: "2023-04-04",
    status: "pending"
  }
];

const TeamContent = () => {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(sampleTeamMembers);
  const [invitations, setInvitations] = useState(sampleInvitations);
  const [activeTab, setActiveTab] = useState("members");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  
  // Modal states
  const [inviteTeamOpen, setInviteTeamOpen] = useState(false);
  
  const { projects } = useTaskContext();

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
    
    // Try to load team members and invitations from localStorage
    const savedMembers = localStorage.getItem("teamMembers");
    if (savedMembers) {
      setTeamMembers(JSON.parse(savedMembers));
    } else {
      // Save sample members to localStorage
      localStorage.setItem("teamMembers", JSON.stringify(sampleTeamMembers));
    }
    
    const savedInvitations = localStorage.getItem("invitations");
    if (savedInvitations) {
      setInvitations(JSON.parse(savedInvitations));
    } else {
      // Save sample invitations to localStorage
      localStorage.setItem("invitations", JSON.stringify(sampleInvitations));
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Filter team members based on search term and selected department
  const filteredTeamMembers = teamMembers.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === "all" || member.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  // Get unique departments for filter
  const departments = ["all", ...new Set(teamMembers.map(member => member.department))];

  // Handle invitation actions
  const handleInvitation = (id: string, action: 'resend' | 'cancel') => {
    if (action === 'resend') {
      toast({
        title: "Invitation Resent",
        description: "The team invitation has been resent."
      });
    } else if (action === 'cancel') {
      if (window.confirm("Are you sure you want to cancel this invitation?")) {
        const updatedInvitations = invitations.filter(inv => inv.id !== id);
        setInvitations(updatedInvitations);
        localStorage.setItem("invitations", JSON.stringify(updatedInvitations));
        
        toast({
          title: "Invitation Cancelled",
          description: "The team invitation has been cancelled."
        });
      }
    }
  };

  // Remove a team member
  const removeMember = (id: string) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      const updatedMembers = teamMembers.filter(member => member.id !== id);
      setTeamMembers(updatedMembers);
      localStorage.setItem("teamMembers", JSON.stringify(updatedMembers));
      
      toast({
        title: "Team Member Removed",
        description: "The team member has been removed from your organization."
      });
    }
  };

  if (!organization) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - hidden on mobile unless toggled */}
      <aside className={`${isMenuOpen ? 'block' : 'hidden'} md:block w-64 bg-gradient-to-b from-indigo-800 to-purple-900 text-white fixed md:static h-screen z-50 transition-all duration-300 ease-in-out`}>
        <div className="p-4 border-b border-indigo-700">
          <h2 className="text-xl font-bold">{organization.name}</h2>
          <p className="text-sm text-indigo-200">{organization.plan} Plan</p>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <Link to="/dashboard" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                <BarChart2 className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/kanban" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                <KanbanSquare className="h-5 w-5" />
                <span>Kanban Board</span>
              </Link>
            </li>
            <li>
              <Link to="/gantt" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                <GanttChartSquare className="h-5 w-5" />
                <span>Gantt Chart</span>
              </Link>
            </li>
            <li>
              <Link to="/tasks" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                <List className="h-5 w-5" />
                <span>Task List</span>
              </Link>
            </li>
            <li>
              <Link to="/time-tracking" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                <Clock className="h-5 w-5" />
                <span>Time Tracking</span>
              </Link>
            </li>
            <li>
              <Link to="/files" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                <FileText className="h-5 w-5" />
                <span>Files & Docs</span>
              </Link>
            </li>
            <li>
              <Link to="/chat" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                <MessageSquare className="h-5 w-5" />
                <span>Chat</span>
              </Link>
            </li>
            <li>
              <Link to="/notes" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                <BookOpen className="h-5 w-5" />
                <span>Notes</span>
              </Link>
            </li>
            <li>
              <Link to="/team" className="flex items-center space-x-3 px-3 py-2 rounded-md bg-indigo-700 text-white font-medium">
                <Users className="h-5 w-5" />
                <span>Team</span>
              </Link>
            </li>
            <li>
              <Link to="/settings" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        {/* Top bar */}
        <header className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden mr-2">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-indigo-800">Team Management</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex">
              <div className="relative mr-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  type="search" 
                  placeholder="Search team members..." 
                  className="pl-8 w-64 bg-gray-50 border-gray-200" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="text-sm text-gray-600 hidden md:block">{userEmail}</div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </header>

        {/* Team content */}
        <div className="p-6">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate("/dashboard")} 
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
            
            <div className="flex flex-wrap justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-indigo-800">Team</h1>
                <p className="text-gray-500">Manage your team members and their access</p>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                <Button 
                  onClick={() => setInviteTeamOpen(true)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  <UserPlus className="mr-2 h-5 w-5" /> Invite Team Member
                </Button>
                <Button variant="outline" className="gap-2">
                  <Shield className="h-5 w-5" /> Manage Roles
                </Button>
              </div>
            </div>
          </div>

          {/* Team overview cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 flex items-center">
                <div className="bg-indigo-100 rounded-full p-3 mr-4">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Members</p>
                  <h3 className="text-2xl font-bold">{teamMembers.length}</h3>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center">
                <div className="bg-green-100 rounded-full p-3 mr-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Members</p>
                  <h3 className="text-2xl font-bold">
                    {teamMembers.filter(m => m.status !== "offline").length}
                  </h3>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center">
                <div className="bg-amber-100 rounded-full p-3 mr-4">
                  <Mail className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending Invites</p>
                  <h3 className="text-2xl font-bold">{invitations.length}</h3>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center">
                <div className="bg-purple-100 rounded-full p-3 mr-4">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Productivity</p>
                  <h3 className="text-2xl font-bold">
                    {Math.round(
                      teamMembers.reduce((sum, m) => sum + m.productivity, 0) / teamMembers.length
                    )}%
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for team management */}
          <Tabs defaultValue="members" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="members">Team Members</TabsTrigger>
              <TabsTrigger value="invitations">Invitations</TabsTrigger>
              <TabsTrigger value="departments">Departments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="members" className="space-y-4">
              {/* Department filter */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-sm font-medium text-gray-500">Filter by Department:</span>
                {departments.map(dept => (
                  <Button 
                    key={dept} 
                    variant={selectedDepartment === dept ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setSelectedDepartment(dept)}
                    className={selectedDepartment === dept ? "bg-indigo-600" : ""}
                  >
                    {dept === "all" ? "All Departments" : dept}
                  </Button>
                ))}
              </div>
              
              {/* Mobile search field */}
              <div className="md:hidden relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  type="search" 
                  placeholder="Search team members..." 
                  className="pl-8 w-full bg-gray-50 border-gray-200" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Team members list */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeamMembers.length > 0 ? (
                  filteredTeamMembers.map(member => (
                    <Card key={member.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center">
                              <div className="relative mr-4">
                                <Avatar className="h-16 w-16">
                                  <img src={member.avatar} alt={member.name} />
                                </Avatar>
                                <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                                  member.status === 'online' ? 'bg-green-500' : 
                                  member.status === 'away' ? 'bg-amber-500' : 'bg-gray-400'
                                }`}></div>
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{member.name}</h3>
                                <p className="text-sm text-gray-500">{member.role}</p>
                                <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-800">
                                  {member.department}
                                </span>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </div>
                          
                          <div className="mt-4 space-y-3">
                            <div className="flex items-center text-sm">
                              <Mail className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-gray-600">{member.email}</span>
                            </div>
                            
                            {member.recentActivity && (
                              <div className="text-sm text-gray-500">
                                <span className="font-medium">Recent Activity: </span>
                                {member.recentActivity}
                              </div>
                            )}
                            
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>Productivity</span>
                                <span>{member.productivity}%</span>
                              </div>
                              <Progress value={member.productivity} className="h-2" />
                            </div>
                            
                            <div className="flex flex-wrap gap-1">
                              {member.skills.map(skill => (
                                <span 
                                  key={skill} 
                                  className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 px-4 py-3 flex justify-between border-t">
                          <div className="text-xs text-gray-500">
                            Joined {new Date(member.joinedAt).toLocaleDateString()}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <MessageCircle className="h-4 w-4 mr-1" /> Message
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => removeMember(member.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" /> Remove
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700">No team members found</h3>
                    <p className="text-gray-500 mb-6">
                      {searchTerm || selectedDepartment !== "all" 
                        ? "Try adjusting your search or filters"
                        : "Invite team members to start collaborating"
                      }
                    </p>
                    {!searchTerm && selectedDepartment === "all" && (
                      <Button onClick={() => setInviteTeamOpen(true)}>
                        <UserPlus className="mr-2 h-5 w-5" /> Invite Team Member
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="invitations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Invitations</CardTitle>
                  <CardDescription>
                    Team members who have been invited but haven't joined yet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {invitations.length > 0 ? (
                    <div className="space-y-4">
                      {invitations.map(invitation => (
                        <div 
                          key={invitation.id} 
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium">{invitation.email}</h4>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-500">Role: {invitation.role}</span>
                              <span className="text-sm text-gray-500">
                                Sent on {new Date(invitation.sentAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleInvitation(invitation.id, 'resend')}
                            >
                              <Mail className="h-4 w-4 mr-2" /> Resend
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleInvitation(invitation.id, 'cancel')}
                            >
                              <XCircle className="h-4 w-4 mr-2" /> Cancel
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Mail className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-lg font-medium">No pending invitations</p>
                      <p className="text-sm text-gray-500 mb-4">All invitations have been accepted or cancelled</p>
                      <Button onClick={() => setInviteTeamOpen(true)}>
                        <UserPlus className="mr-2 h-5 w-5" /> Send New Invitation
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="departments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Departments</CardTitle>
                  <CardDescription>
                    Manage team structure and organization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {departments
                      .filter(dept => dept !== "all")
                      .map(dept => {
                        const membersInDept = teamMembers.filter(m => m.department === dept);
                        return (
                          <div key={dept} className="border rounded-lg overflow-hidden">
                            <div className="bg-gray-50 p-4 flex justify-between items-center border-b">
                              <div>
                                <h3 className="font-medium text-lg">{dept}</h3>
                                <p className="text-sm text-gray-500">{membersInDept.length} team members</p>
                              </div>
                              <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4 mr-2" /> Manage
                              </Button>
                            </div>
                            <div className="p-4">
                              <div className="space-y-3">
                                {membersInDept.map(member => (
                                  <div 
                                    key={member.id} 
                                    className="flex items-center justify-between p-3 bg-white border rounded-md"
                                  >
                                    <div className="flex items-center">
                                      <Avatar className="h-10 w-10 mr-3">
                                        <img src={member.avatar} alt={member.name} />
                                      </Avatar>
                                      <div>
                                        <h4 className="font-medium">{member.name}</h4>
                                        <p className="text-sm text-gray-500">{member.role}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                      <span>
                                        {member.completedTasks}/{member.assignedTasks} tasks
                                      </span>
                                      <span className={`flex items-center px-2 py-0.5 rounded-full text-xs ${
                                        member.status === 'online' ? 'bg-green-100 text-green-800' : 
                                        member.status === 'away' ? 'bg-amber-100 text-amber-800' : 
                                        'bg-gray-100 text-gray-800'
                                      }`}>
                                        {member.status}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t">
                  <Button variant="outline">
                    <PlusCircle className="mr-2 h-5 w-5" /> Add Department
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Modals */}
      <InviteTeamModal 
        open={inviteTeamOpen} 
        onOpenChange={setInviteTeamOpen} 
      />
    </div>
  );
};

// Wrap with TaskProvider
const Team = () => (
  <TaskProvider>
    <TeamContent />
  </TaskProvider>
);

export default Team;
