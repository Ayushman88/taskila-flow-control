
import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { TaskProvider, useTaskContext } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Clock,
  KanbanSquare,
  GanttChartSquare,
  BookOpen,
  Menu,
  ChevronRight,
  Edit,
  Trash2,
  Timer,
  File,
  ArrowLeft
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Organization {
  name: string;
  teamSize: string;
  plan: string;
}

// The main Project Details content
const ProjectDetailsContent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  const { 
    projects,
    getProject,
    getTasksByProject,
    updateProject
  } = useTaskContext();

  const project = getProject(id || "");
  const projectTasks = getTasksByProject(id || "");

  // Count tasks by status
  const todoCount = projectTasks.filter(t => t.status === "To Do").length;
  const inProgressCount = projectTasks.filter(t => t.status === "In Progress").length;
  const inReviewCount = projectTasks.filter(t => t.status === "In Review").length;
  const doneCount = projectTasks.filter(t => t.status === "Done").length;
  
  // Calculate completion percentage
  const completionPercentage = projectTasks.length > 0 
    ? Math.round((doneCount / projectTasks.length) * 100) 
    : 0;

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

    // Update project progress with calculated value
    if (project) {
      updateProject(project.id, { progress: completionPercentage });
    }
  }, [navigate, project, completionPercentage, updateProject]);
  
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

  if (!organization) return <div className="p-8">Loading...</div>;
  if (!project) return <div className="p-8">Project not found</div>;

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
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                <Clock className="h-5 w-5" />
                <span>Time Tracking</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                <FileText className="h-5 w-5" />
                <span>Files & Docs</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                <MessageSquare className="h-5 w-5" />
                <span>Chat</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                <BookOpen className="h-5 w-5" />
                <span>Notes</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                <Users className="h-5 w-5" />
                <span>Team</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
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
        <header className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden mr-2">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-indigo-800">Project Details</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex">
              <div className="relative mr-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  type="search" 
                  placeholder="Search tasks..." 
                  className="pl-8 w-64 bg-gray-50 border-gray-200" 
                />
              </div>
            </div>
            <div className="text-sm text-gray-600 hidden md:block">{userEmail}</div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </header>

        {/* Project details content */}
        <div className="p-6">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate("/dashboard")} 
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
            
            <div className="flex flex-wrap justify-between items-start">
              <div className="space-y-1 mb-4 md:mb-0">
                <div className="flex items-center">
                  <h1 className="text-3xl font-bold text-indigo-800">{project.name}</h1>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <Edit className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
                <p className="text-gray-500">{project.description}</p>
                <div className="flex space-x-4 text-sm text-gray-500 mt-2">
                  <div>Created: {new Date(project.createdAt).toLocaleDateString()}</div>
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
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Link to="/tasks">
                  <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                    <PlusCircle className="mr-2 h-5 w-5" /> Add Task
                  </Button>
                </Link>
                <Button variant="outline" className="gap-2">
                  <Users className="h-4 w-4" />
                  Invite Member
                </Button>
                <Button variant="outline" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </div>
            </div>
          </div>

          {/* Progress section */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="col-span-2">
                  <h3 className="text-lg font-semibold mb-2">Progress</h3>
                  <div className="flex items-center mb-4">
                    <div className="w-full mr-4">
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Completion</span>
                        <span>{completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full" 
                          style={{ width: `${completionPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {projectTasks.length} tasks in total • {doneCount} completed
                  </p>
                </div>
                
                <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-blue-50 border-none">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <div className="text-3xl font-bold text-blue-700">{todoCount}</div>
                      <div className="text-sm text-blue-600">To Do</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-amber-50 border-none">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <div className="text-3xl font-bold text-amber-700">{inProgressCount}</div>
                      <div className="text-sm text-amber-600">In Progress</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50 border-none">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <div className="text-3xl font-bold text-purple-700">{inReviewCount}</div>
                      <div className="text-sm text-purple-600">In Review</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-none">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <div className="text-3xl font-bold text-green-700">{doneCount}</div>
                      <div className="text-sm text-green-600">Done</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs 
            defaultValue="overview" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates on this project</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex">
                        <div className="mr-4 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <Edit className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium">Project created</p>
                          <p className="text-sm text-gray-500">Created on {new Date(project.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      {projectTasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="flex">
                          <div className="mr-4 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <PlusCircle className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">Task added: {task.title}</p>
                            <p className="text-sm text-gray-500">{new Date(task.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Frequently used tools</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                      <KanbanSquare className="h-5 w-5 text-indigo-500" />
                      <div className="text-left">
                        <div className="font-medium">Kanban Board</div>
                        <div className="text-xs text-gray-500">View task board</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                      <Timer className="h-5 w-5 text-purple-500" />
                      <div className="text-left">
                        <div className="font-medium">Time Tracking</div>
                        <div className="text-xs text-gray-500">Log hours worked</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                      <File className="h-5 w-5 text-blue-500" />
                      <div className="text-left">
                        <div className="font-medium">Add Document</div>
                        <div className="text-xs text-gray-500">Upload files</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                      <MessageSquare className="h-5 w-5 text-green-500" />
                      <div className="text-left">
                        <div className="font-medium">Team Chat</div>
                        <div className="text-xs text-gray-500">Discuss with team</div>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="tasks" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>Tasks</CardTitle>
                      <CardDescription>All tasks in this project</CardDescription>
                    </div>
                    <Link to="/tasks">
                      <Button size="sm">View All Tasks</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {projectTasks.length > 0 ? (
                    <div className="space-y-4">
                      {projectTasks.map((task) => (
                        <div key={task.id} className="flex items-start p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                          <div className={`h-5 w-5 rounded-full mr-3 flex-shrink-0 mt-0.5 ${
                            task.status === 'To Do' ? 'bg-blue-500' : 
                            task.status === 'In Progress' ? 'bg-amber-500' : 
                            task.status === 'In Review' ? 'bg-purple-500' : 
                            'bg-green-500'
                          }`}></div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{task.title}</h4>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                task.priority === 'Low' ? 'bg-blue-50 text-blue-700' : 
                                task.priority === 'Medium' ? 'bg-amber-50 text-amber-700' : 
                                'bg-red-50 text-red-700'
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                              <span>Status: {task.status}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <List className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-lg font-medium">No tasks yet</p>
                      <p className="text-sm text-gray-500 mb-4">Start by adding a task to this project</p>
                      <Link to="/tasks">
                        <Button>
                          <PlusCircle className="mr-2 h-5 w-5" /> Add Task
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="files" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Files</CardTitle>
                  <CardDescription>Documents and files related to this project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-lg font-medium">No files uploaded yet</p>
                    <p className="text-sm text-gray-500 mb-4">Upload documents or files related to this project</p>
                    <Button variant="outline">
                      <PlusCircle className="mr-2 h-5 w-5" /> Upload File
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="team" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>People working on this project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-lg font-medium">No team members yet</p>
                    <p className="text-sm text-gray-500 mb-4">Invite people to collaborate on this project</p>
                    <Button variant="outline">
                      <PlusCircle className="mr-2 h-5 w-5" /> Invite Team Member
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

// Wrap the Project Details content with the TaskProvider
const ProjectDetails = () => (
  <TaskProvider>
    <ProjectDetailsContent />
  </TaskProvider>
);

export default ProjectDetails;
