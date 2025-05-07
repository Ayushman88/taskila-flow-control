
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BarChart2, 
  CheckCircle2, 
  Clock, 
  FileText, 
  List, 
  Search,
  Edit,
  Trash2,
  KanbanSquare,
  GanttChartSquare,
  BookOpen,
  FileUp,
  BrainCircuit,
  Timer,
  GitBranch,
  Lock,
  Menu
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TaskProvider, useTaskContext } from "@/context/TaskContext";
import CreateProjectModal from "@/components/dashboard/CreateProjectModal";
import UploadFileModal from "@/components/dashboard/UploadFileModal";
import InviteTeamModal from "@/components/dashboard/InviteTeamModal";
import ScheduleMeetingModal from "@/components/dashboard/ScheduleMeetingModal";
import CreateWhiteboardModal from "@/components/dashboard/CreateWhiteboardModal";
import CreateDocumentModal from "@/components/dashboard/CreateDocumentModal";
import { useAuth } from "@/context/AuthContext";
import { getUserOrganizations, Organization } from "@/services/dashboard";
import Sidebar from "@/components/layout/Sidebar";

const DashboardContent = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { projects, deleteProject } = useTaskContext();
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [uploadFileOpen, setUploadFileOpen] = useState(false);
  const [inviteTeamOpen, setInviteTeamOpen] = useState(false);
  const [scheduleMeetingOpen, setScheduleMeetingOpen] = useState(false);
  const [createWhiteboardOpen, setCreateWhiteboardOpen] = useState(false);
  const [createDocumentOpen, setCreateDocumentOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserOrganization();
    }
  }, [user]);

  const loadUserOrganization = async () => {
    try {
      if (user) {
        const organizations = await getUserOrganizations();
        if (organizations && organizations.length > 0) {
          setOrganization(organizations[0]);
        }
      }
    } catch (error) {
      console.error("Error loading user organization:", error);
      toast({
        title: "Error",
        description: "Failed to load organization data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleDeleteProject = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProject(id);
      toast({
        title: "Project Deleted",
        description: `"${name}" has been deleted.`,
      });
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">No Organization Found</h2>
          <p className="mb-6 text-gray-600">You don't seem to have an organization yet. Create one to get started.</p>
          <Button 
            onClick={() => navigate('/create-organization')}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            Create Organization
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        organizationName={organization.name} 
        organizationPlan={organization.plan} 
        onLogout={handleLogout}
        isMenuOpen={isMenuOpen}
      />

      {/* Main content */}
      <main className="flex-1">
        {/* Top bar */}
        <header className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden mr-2">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-indigo-800">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex">
              <div className="relative mr-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  type="search" 
                  placeholder="Search..." 
                  className="pl-8 w-64 bg-gray-50 border-gray-200" 
                />
              </div>
            </div>
            <div className="text-sm text-gray-600 hidden md:block">{user?.email}</div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
            </Button>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="p-6">
          {/* Create new button row */}
          <div className="mb-6 flex flex-wrap gap-3">
            <Button 
              onClick={() => setCreateProjectOpen(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Create New Project
            </Button>
            <Link to="/tasks">
              <Button variant="outline" className="border-indigo-200 text-indigo-700">
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Create Task
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-indigo-200 text-indigo-700"
              onClick={() => setUploadFileOpen(true)}
            >
              <FileUp className="mr-2 h-5 w-5" /> Upload File
            </Button>
            <Button 
              variant="outline" 
              className="border-indigo-200 text-indigo-700"
              onClick={() => setInviteTeamOpen(true)}
            >
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              Invite Team Member
            </Button>
          </div>

          {/* Overview section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-indigo-800">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-blue-700 flex items-center">
                    <List className="mr-2 h-5 w-5" /> Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{projects.reduce((acc, project) => {
                    const projectTasks = projects.length;
                    return acc + projectTasks;
                  }, 0)}</div>
                  <div className="text-gray-500 text-sm">Open tasks across all projects</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-purple-500 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-purple-700 flex items-center">
                    <FileText className="mr-2 h-5 w-5" /> Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{projects.length}</div>
                  <div className="text-gray-500 text-sm">{projects.filter(p => p.status === "In Progress").length} active, {projects.filter(p => p.status === "To Do").length} in planning</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-green-700 flex items-center">
                    <Clock className="mr-2 h-5 w-5" /> Hours Logged
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">24.5</div>
                  <div className="text-gray-500 text-sm">This week</div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Projects section */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-indigo-800">Your Projects</h2>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-indigo-200 text-indigo-700"
                onClick={() => setCreateProjectOpen(true)}
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                New Project
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <Card key={project.id} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow">
                  <div className={`h-2 w-full ${project.status === 'In Progress' ? 'bg-amber-500' : project.status === 'To Do' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex justify-between">
                      <span>{project.name}</span>
                      <div className="flex space-x-1">
                        <button className="text-gray-400 hover:text-indigo-700">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-gray-400 hover:text-red-500"
                          onClick={() => handleDeleteProject(project.id, project.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2">
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <div>Due: {new Date(project.dueDate).toLocaleDateString()}</div>
                      <div className={`
                        ${project.status === 'In Progress' ? 'text-amber-600 bg-amber-50' : 
                          project.status === 'To Do' ? 'text-blue-600 bg-blue-50' : 
                          'text-green-600 bg-green-50'} 
                        px-2 py-0.5 rounded-full text-xs font-medium
                      `}>
                        {project.status}
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link to={`/project/${project.id}`}>
                        <Button variant="outline" size="sm" className="w-full border-indigo-200 text-indigo-700">
                          View Project
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Add new project card */}
              <Card 
                className="border-dashed border-2 border-gray-300 bg-gray-50 hover:bg-white transition-colors hover:border-indigo-300 cursor-pointer flex items-center justify-center min-h-[220px]" 
                onClick={() => setCreateProjectOpen(true)}
              >
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <svg className="h-12 w-12 text-indigo-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  <p className="text-lg font-medium text-indigo-600">Create New Project</p>
                  <p className="text-gray-500 mt-1">Start tracking a new endeavor</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Features Showcase */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-indigo-800">Features Available</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/kanban">
                <Card className="hover:shadow-md transition-shadow bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-indigo-700 flex items-center">
                      <KanbanSquare className="mr-2 h-5 w-5 text-indigo-500" /> Task Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-600">
                    Kanban boards, lists, and Gantt charts for any project type
                  </CardContent>
                </Card>
              </Link>
              
              <Card 
                className="hover:shadow-md transition-shadow bg-gradient-to-r from-purple-50 to-pink-50 cursor-pointer"
                onClick={() => setCreateDocumentOpen(true)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-purple-700 flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-purple-500" /> Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">
                  Collaborative rich-text editors with file sharing
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow bg-gradient-to-r from-green-50 to-teal-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-green-700 flex items-center">
                    <Timer className="mr-2 h-5 w-5 text-green-500" /> Time Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">
                  Log hours, set deadlines, and sync with your calendar
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow bg-gradient-to-r from-amber-50 to-yellow-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-amber-700 flex items-center">
                    <svg className="mr-2 h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    Communication
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">
                  Chat, comments, @mentions, and notifications
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow bg-gradient-to-r from-red-50 to-orange-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-red-700 flex items-center">
                    <BarChart2 className="mr-2 h-5 w-5 text-red-500" /> Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">
                  Track progress and generate insightful reports
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow bg-gradient-to-r from-cyan-50 to-blue-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-cyan-700 flex items-center">
                    <BrainCircuit className="mr-2 h-5 w-5 text-cyan-500" /> AI Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">
                  Smart summaries, reports, and task recommendations
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow bg-gradient-to-r from-emerald-50 to-green-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-emerald-700 flex items-center">
                    <GitBranch className="mr-2 h-5 w-5 text-emerald-500" /> Integrations
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">
                  Connect with GitHub, Slack, Google Drive, and more
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow bg-gradient-to-r from-violet-50 to-purple-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-violet-700 flex items-center">
                    <Lock className="mr-2 h-5 w-5 text-violet-500" /> Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">
                  2FA login, activity logs, and role-based permissions
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-indigo-800">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/tasks">
                <Button className="h-auto py-6 justify-start bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 w-full">
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  Create New Task
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="h-auto py-6 justify-start border-indigo-200 text-indigo-700 hover:bg-indigo-50 w-full"
                onClick={() => setScheduleMeetingOpen(true)}
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Schedule Meeting
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-6 justify-start border-indigo-200 text-indigo-700 hover:bg-indigo-50 w-full"
                onClick={() => setCreateWhiteboardOpen(true)}
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Create Whiteboard
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-6 justify-start border-indigo-200 text-indigo-700 hover:bg-indigo-50 w-full"
                onClick={() => setCreateDocumentOpen(true)}
              >
                <BookOpen className="mr-2 h-5 w-5" /> Create Document
              </Button>
            </div>
          </section>

          {/* Get started section */}
          <section className="bg-gradient-to-r from-white to-indigo-50 p-6 rounded-lg shadow-sm border border-indigo-100">
            <h2 className="text-2xl font-bold mb-4 text-indigo-800">Get Started</h2>
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
                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">2</div>
                <div>
                  <h3 className="font-medium">Create your first project</h3>
                  <p className="text-gray-500">Set up a project to organize your tasks</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full border-2 border-indigo-300 text-indigo-300 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">3</div>
                <div>
                  <h3 className="font-medium">Invite team members</h3>
                  <p className="text-gray-500">Collaborate with your team in real-time</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Modals */}
      <CreateProjectModal 
        open={createProjectOpen} 
        onOpenChange={setCreateProjectOpen} 
      />
      
      <UploadFileModal 
        open={uploadFileOpen} 
        onOpenChange={setUploadFileOpen} 
      />
      
      <InviteTeamModal 
        open={inviteTeamOpen} 
        onOpenChange={setInviteTeamOpen} 
      />
      
      <ScheduleMeetingModal 
        open={scheduleMeetingOpen} 
        onOpenChange={setScheduleMeetingOpen} 
      />
      
      <CreateWhiteboardModal 
        open={createWhiteboardOpen} 
        onOpenChange={setCreateWhiteboardOpen} 
      />
      
      <CreateDocumentModal 
        open={createDocumentOpen} 
        onOpenChange={setCreateDocumentOpen} 
      />
    </div>
  );
};

// Wrap the dashboard content with the TaskProvider
const Dashboard = () => (
  <TaskProvider>
    <DashboardContent />
  </TaskProvider>
);

export default Dashboard;
