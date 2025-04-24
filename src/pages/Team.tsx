import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart2,
  List,
  LogOut,
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
  Mail,
  Phone,
  UserPlus,
  MoreHorizontal,
  ArrowLeft,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import InviteTeamModal from "@/components/dashboard/InviteTeamModal";
import { TaskProvider } from "@/context/TaskContext";

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
  department: string;
  avatarUrl: string;
  phone?: string;
  joinedDate: string;
  status: "active" | "invited" | "inactive";
  projects: string[];
}

// Sample team members for demonstration
const sampleTeamMembers: TeamMember[] = [
  {
    id: "user1",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Product Manager",
    department: "Product",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    phone: "+1 (555) 123-4567",
    joinedDate: "2023-01-15",
    status: "active",
    projects: ["project1", "project3"],
  },
  {
    id: "user2",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Lead Developer",
    department: "Engineering",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    phone: "+1 (555) 987-6543",
    joinedDate: "2023-01-10",
    status: "active",
    projects: ["project1", "project2"],
  },
  {
    id: "user3",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    role: "UX Designer",
    department: "Design",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    joinedDate: "2023-02-05",
    status: "active",
    projects: ["project2"],
  },
  {
    id: "user4",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "Frontend Developer",
    department: "Engineering",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    phone: "+1 (555) 456-7890",
    joinedDate: "2023-02-20",
    status: "active",
    projects: ["project1", "project3"],
  },
  {
    id: "user5",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    role: "Content Strategist",
    department: "Marketing",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    joinedDate: "2023-03-10",
    status: "invited",
    projects: [],
  },
];

const departments = [
  "All",
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Operations",
];

// Sample projects for demonstration
const sampleProjects = [
  { id: "project1", name: "Website Redesign" },
  { id: "project2", name: "Mobile App Development" },
  { id: "project3", name: "Marketing Campaign" },
];

const TeamContent = () => {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [inviteOpen, setInviteOpen] = useState(false);

  // Completely bypass the TaskContext and use sample projects directly
  const projects = sampleProjects;

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

    // Try to load team members from localStorage
    const savedTeamMembers = localStorage.getItem("teamMembers");
    if (savedTeamMembers) {
      setTeamMembers(JSON.parse(savedTeamMembers));
    } else {
      // Save sample team members to localStorage
      localStorage.setItem("teamMembers", JSON.stringify(sampleTeamMembers));
      setTeamMembers(sampleTeamMembers);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Filter team members based on search term and selected department
  const filteredTeamMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All" || member.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Count members by department
  const departmentCounts = departments.reduce((acc, department) => {
    if (department === "All") {
      acc[department] = teamMembers.length;
    } else {
      acc[department] = teamMembers.filter(
        (member) => member.department === department
      ).length;
    }
    return acc;
  }, {} as Record<string, number>);

  // Get project name by id
  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    return project ? project.name : "Unknown Project";
  };

  if (!organization) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - hidden on mobile unless toggled */}
      <aside
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:block w-64 bg-gradient-to-b from-indigo-800 to-purple-900 text-white fixed md:static h-screen z-50 transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 border-b border-indigo-700">
          <h2 className="text-xl font-bold">{organization.name}</h2>
          <p className="text-sm text-indigo-200">{organization.plan} Plan</p>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <Link
                to="/dashboard"
                className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <BarChart2 className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/kanban"
                className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <KanbanSquare className="h-5 w-5" />
                <span>Kanban Board</span>
              </Link>
            </li>
            <li>
              <Link
                to="/gantt"
                className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <GanttChartSquare className="h-5 w-5" />
                <span>Gantt Chart</span>
              </Link>
            </li>
            <li>
              <Link
                to="/tasks"
                className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <List className="h-5 w-5" />
                <span>Task List</span>
              </Link>
            </li>
            <li>
              <Link
                to="/time-tracking"
                className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <Clock className="h-5 w-5" />
                <span>Time Tracking</span>
              </Link>
            </li>
            <li>
              <Link
                to="/files"
                className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <FileText className="h-5 w-5" />
                <span>Files & Docs</span>
              </Link>
            </li>
            <li>
              <Link
                to="/chat"
                className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Chat</span>
              </Link>
            </li>
            <li>
              <Link
                to="/notes"
                className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <BookOpen className="h-5 w-5" />
                <span>Notes</span>
              </Link>
            </li>
            <li>
              <Link
                to="/team"
                className="flex items-center space-x-3 px-3 py-2 rounded-md bg-indigo-700 text-white font-medium"
              >
                <Users className="h-5 w-5" />
                <span>Team</span>
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
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
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="md:hidden mr-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-indigo-800">Team</h1>
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
            <div className="text-sm text-gray-600 hidden md:block">
              {userEmail}
            </div>
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
                <h1 className="text-3xl font-bold text-indigo-800">
                  Team Members
                </h1>
                <p className="text-gray-500">
                  Manage your team and their access
                </p>
              </div>

              <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                <Button
                  onClick={() => setInviteOpen(true)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  <UserPlus className="mr-2 h-5 w-5" /> Invite Team Member
                </Button>
              </div>
            </div>
          </div>

          {/* Department filter */}
          <div className="mb-6 overflow-x-auto">
            <div className="inline-flex min-w-full">
              {departments.map((department) => (
                <button
                  key={department}
                  onClick={() => setSelectedDepartment(department)}
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                    selectedDepartment === department
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
                  }`}
                >
                  {department} ({departmentCounts[department] || 0})
                </button>
              ))}
            </div>
          </div>

          {/* Mobile search - only visible on small screens */}
          <div className="md:hidden mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search team members..."
                className="pl-8 w-full bg-gray-50 border-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeamMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 mr-3">
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback>
                          {member.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <CardDescription>{member.role}</CardDescription>
                      </div>
                    </div>
                    <div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">{member.email}</span>
                    </div>
                    {member.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-600">{member.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">{member.department}</span>
                    </div>

                    <div className="pt-2">
                      <div className="text-sm font-medium text-gray-500 mb-2">
                        Projects:
                      </div>
                      {member.projects && member.projects.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {member.projects.map((projectId) => (
                            <span
                              key={projectId}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                              {getProjectName(projectId)}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">
                          No projects assigned
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-gray-50 flex justify-between">
                  <div className="text-xs text-gray-500">
                    Joined {new Date(member.joinedDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.status === "active"
                          ? "bg-green-100 text-green-800"
                          : member.status === "invited"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {member.status === "active"
                        ? "Active"
                        : member.status === "invited"
                        ? "Invited"
                        : "Inactive"}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Empty state */}
          {filteredTeamMembers.length === 0 && (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200 mt-6">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">
                No team members found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {searchTerm || selectedDepartment !== "All"
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : "You don't have any team members yet."}
              </p>
              <Button
                onClick={() => setInviteOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <UserPlus className="mr-2 h-5 w-5" /> Invite Team Member
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Invite team member modal */}
      <InviteTeamModal open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  );
};

// Use Team component without dependency on TaskContext hook
const Team = () => <TeamContent />;

export default Team;
