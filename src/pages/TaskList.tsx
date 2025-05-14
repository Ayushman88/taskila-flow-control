import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TaskProvider, useTaskContext, Task } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
  Filter,
  ChevronDown,
  ArrowUpDown,
  Edit,
  Trash2,
  Flag
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { v4 as uuidv4 } from 'uuid';
import Sidebar from "@/components/dashboard/Sidebar";

interface Organization {
  id: string;
  name: string;
  team_size: string;
  plan: string;
  subscription_status?: string;
  created_at: string;
  updated_at: string;
}

const TaskListContent = () => {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [sortField, setSortField] = useState<keyof Task | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskProject, setNewTaskProject] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState<"To Do" | "In Progress" | "In Review" | "Done">("To Do");
  
  const { 
    tasks, 
    projects,
    addTask,
    updateTask,
    deleteTask
  } = useTaskContext();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/signin");
      return;
    }
    
    const user = JSON.parse(userStr);
    setUserEmail(user.email);
    
    // Try to get current org from localStorage
    const currentOrgId = localStorage.getItem("currentOrganizationId");
    
    if (currentOrgId) {
      // This is a mock implementation - in a real app, you would fetch from Firestore
      setOrganization({
        id: currentOrgId,
        name: organizationName || "My Organization",
        team_size: "small",
        plan: "Free",
        subscription_status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } else {
      // Fallback to organization from localStorage if exists
      const orgStr = localStorage.getItem("organization");
      if (orgStr) {
        const parsedOrg = JSON.parse(orgStr);
        setOrganization({
          id: "local-org-id",
          name: parsedOrg.name || "My Organization",
          team_size: "small",
          plan: parsedOrg.plan || "Free",
          subscription_status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setNewTaskDueDate(tomorrow.toISOString().split('T')[0]);

    if (projects.length > 0) {
      setNewTaskProject(projects[0].id);
    }
  }, [navigate, projects]);
  
  const filteredTasks = tasks.filter(task => {
    const searchFilter = searchQuery 
      ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const projectFilter = selectedProject === "all" || task.projectId === selectedProject;
    
    const statusFilter = selectedStatus === "all" || task.status === selectedStatus;
    
    const priorityFilter = selectedPriority === "all" || task.priority === selectedPriority;
    
    return searchFilter && projectFilter && statusFilter && priorityFilter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!sortField) return 0;
    
    if (sortField === "dueDate") {
      const dateA = new Date(a[sortField]);
      const dateB = new Date(b[sortField]);
      return sortDirection === "asc" 
        ? dateA.getTime() - dateB.getTime() 
        : dateB.getTime() - dateA.getTime();
    }
    
    if (sortField === "priority") {
      const priorityOrder = { "Low": 1, "Medium": 2, "High": 3 };
      const priorityA = priorityOrder[a[sortField] as "Low" | "Medium" | "High"];
      const priorityB = priorityOrder[b[sortField] as "Low" | "Medium" | "High"];
      return sortDirection === "asc" ? priorityA - priorityB : priorityB - priorityA;
    }
    
    const valueA = a[sortField] || "";
    const valueB = b[sortField] || "";
    
    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortDirection === "asc" 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    return 0;
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
    navigate("/");
  };

  const handleSort = (field: keyof Task) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleNewTask = () => {
    if (!newTaskTitle.trim()) {
      toast({
        title: "Error",
        description: "Task title cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (!newTaskProject) {
      toast({
        title: "Error",
        description: "Please select a project",
        variant: "destructive",
      });
      return;
    }

    const newTask: Task = {
      id: uuidv4(),
      title: newTaskTitle,
      description: newTaskDescription,
      status: newTaskStatus,
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
      projectId: newTaskProject,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addTask(newTask);
    
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskPriority("Medium");
    setNewTaskStatus("To Do");
    
    setIsNewTaskDialogOpen(false);
    
    toast({
      title: "Task created",
      description: "Your new task has been added."
    });
  };

  const handleTaskStatusChange = (taskId: string, completed: boolean) => {
    updateTask(taskId, { 
      status: completed ? "Done" : "To Do",
      updatedAt: new Date().toISOString()
    });
    
    toast({
      title: completed ? "Task completed" : "Task reopened",
      description: completed ? "Task marked as done" : "Task marked as to do"
    });
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    
    toast({
      title: "Task deleted",
      description: "The task has been permanently deleted"
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getProjectNameById = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : "Unknown Project";
  };

  const priorityColors = {
    Low: "text-blue-700 bg-blue-50",
    Medium: "text-amber-700 bg-amber-50",
    High: "text-red-700 bg-red-50"
  };

  const statusColors = {
    "To Do": "text-blue-700 bg-blue-50",
    "In Progress": "text-amber-700 bg-amber-50",
    "In Review": "text-purple-700 bg-purple-50",
    "Done": "text-green-700 bg-green-50"
  };

  if (!organization) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        organization={organization} 
        isMenuOpen={isMenuOpen}
        handleLogout={handleLogout}
      />

      <main className="flex-1">
        <header className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden mr-2">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-indigo-800">Task List</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex">
              <div className="relative mr-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  type="search" 
                  placeholder="Search tasks..." 
                  className="pl-8 w-64 bg-gray-50 border-gray-200" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="text-sm text-gray-600 hidden md:block">{userEmail}</div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </header>

        <div className="p-6">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div className="space-y-1 mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-indigo-800">Tasks</h2>
              <p className="text-gray-500">Manage and organize your tasks</p>
            </div>
            
            <div className="flex flex-wrap md:flex-nowrap gap-3">
              <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                    <PlusCircle className="mr-2 h-5 w-5" /> Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>
                      Add a new task to your project. Fill out the details below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input 
                        id="title" 
                        value={newTaskTitle} 
                        onChange={(e) => setNewTaskTitle(e.target.value)} 
                        placeholder="Task title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        value={newTaskDescription} 
                        onChange={(e) => setNewTaskDescription(e.target.value)} 
                        placeholder="Task description"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="project">Project</Label>
                        <Select value={newTaskProject} onValueChange={setNewTaskProject}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                          <SelectContent>
                            {projects.map(project => (
                              <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select 
                          value={newTaskStatus} 
                          onValueChange={(value) => setNewTaskStatus(value as "To Do" | "In Progress" | "In Review" | "Done")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="To Do">To Do</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="In Review">In Review</SelectItem>
                            <SelectItem value="Done">Done</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select 
                          value={newTaskPriority} 
                          onValueChange={(value) => setNewTaskPriority(value as "Low" | "Medium" | "High")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input 
                          id="dueDate" 
                          type="date" 
                          value={newTaskDueDate} 
                          onChange={(e) => setNewTaskDueDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsNewTaskDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleNewTask}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600"
                    >
                      Create Task
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="w-full md:w-40 h-10">
                    <SelectValue placeholder="Filter by project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full md:w-40 h-10">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="In Review">In Review</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger className="w-full md:w-40 h-10">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="block md:hidden mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                type="search" 
                placeholder="Search tasks..." 
                className="pl-8 w-full bg-gray-50 border-gray-200" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="w-12 px-4 py-3 text-left"></th>
                    <th className="px-4 py-3 text-left">
                      <Button 
                        variant="ghost" 
                        className="p-0 font-medium hover:bg-transparent" 
                        onClick={() => handleSort("title")}
                      >
                        Task
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                    <th className="px-4 py-3 text-left">Project</th>
                    <th className="px-4 py-3 text-left">
                      <Button 
                        variant="ghost" 
                        className="p-0 font-medium hover:bg-transparent" 
                        onClick={() => handleSort("status")}
                      >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Button 
                        variant="ghost" 
                        className="p-0 font-medium hover:bg-transparent" 
                        onClick={() => handleSort("priority")}
                      >
                        Priority
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Button 
                        variant="ghost" 
                        className="p-0 font-medium hover:bg-transparent" 
                        onClick={() => handleSort("dueDate")}
                      >
                        Due Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTasks.length > 0 ? (
                    sortedTasks.map((task) => (
                      <tr key={task.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <Checkbox 
                            checked={task.status === "Done"} 
                            onCheckedChange={(checked) => {
                              if (typeof checked === "boolean") {
                                handleTaskStatusChange(task.id, checked);
                              }
                            }}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{task.description}</div>
                        </td>
                        <td className="px-4 py-3">
                          {getProjectNameById(task.projectId)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                            <Flag className="mr-1 h-3 w-3" />
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3">{new Date(task.dueDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="flex items-center">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="flex items-center text-red-600" 
                                onClick={() => handleDeleteTask(task.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <List className="h-12 w-12 text-gray-300 mb-2" />
                          <p className="text-lg font-medium">No tasks found</p>
                          <p className="text-sm mb-4">Try adjusting your search or filters</p>
                          <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline">
                                <PlusCircle className="mr-2 h-4 w-4" /> Create a new task
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

const TaskList = () => (
  <TaskProvider>
    <TaskListContent />
  </TaskProvider>
);

export default TaskList;
