import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TaskProvider, useTaskContext, Task } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  ChevronDown,
  ChevronUp,
  Flag,
  AlertTriangle,
  Filter
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Organization {
  name: string;
  teamSize: string;
  plan: string;
}

// Component to display a single task card
const TaskCard = ({ task }: { task: Task }) => {
  const { updateTask } = useTaskContext();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    e.dataTransfer.setData("taskId", task.id);
  };

  const priorityColors = {
    Low: "bg-blue-50 text-blue-700",
    Medium: "bg-amber-50 text-amber-700",
    High: "bg-red-50 text-red-700",
  };

  const priorityIcons = {
    Low: <Flag className="h-3 w-3 text-blue-600" />,
    Medium: <Flag className="h-3 w-3 text-amber-600" />,
    High: <AlertTriangle className="h-3 w-3 text-red-600" />,
  };

  return (
    <div 
      className="mb-3 cursor-grab active:cursor-grabbing" 
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
    >
      <Card className="shadow-sm hover:shadow-md transition-shadow border border-gray-200">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">{task.title}</h3>
            <div className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]} flex items-center`}>
              {priorityIcons[task.priority]}
              <span className="ml-1">{task.priority}</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
          <div className="flex justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(task.dueDate).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Updated {new Date(task.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// The main Kanban board content
const KanbanBoardContent = () => {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskProject, setNewTaskProject] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState<"To Do" | "In Progress" | "In Review" | "Done">("To Do");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  
  const { 
    tasks, 
    projects,
    addTask, 
    updateTask,
    getTasksByStatus 
  } = useTaskContext();

  const todoTasks = getTasksByStatus("To Do");
  const inProgressTasks = getTasksByStatus("In Progress");
  const inReviewTasks = getTasksByStatus("In Review");
  const doneTasks = getTasksByStatus("Done");

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

    // Initialize the new task due date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setNewTaskDueDate(tomorrow.toISOString().split('T')[0]);

    // Set default project if available
    if (projects.length > 0) {
      setNewTaskProject(projects[0].id);
    }
  }, [navigate, projects]);
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
    navigate("/");
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
    
    // Reset form
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskPriority("Medium");
    setNewTaskStatus("To Do");
    
    setIsNewTaskDialogOpen(false);
    
    toast({
      title: "Task created",
      description: "Your new task has been added to the board."
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: Task["status"]) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    
    updateTask(taskId, { status, updatedAt: new Date().toISOString() });
    
    toast({
      title: "Task updated",
      description: `Task moved to ${status}`
    });
  };

  const handleAddTask = async (formData: any) => {
    try {
      if (!selectedProject) {
        toast({
          title: "Error",
          description: "Please select a project first",
          variant: "destructive",
        });
        return;
      }
      
      const newTask = await addTask({
        title: formData.title,
        description: formData.description || "",
        status: formData.status || "To Do",
        priority: formData.priority || "Medium",
        dueDate: formData.dueDate || new Date().toISOString(),
        projectId: selectedProject,
        // These fields will be added by the addTask function automatically
        // createdBy: user.uid,
        // organization_id: currentOrgId
      });
      
      setDialogOpen(false);
      toast({
        title: "Task Created",
        description: "Task created successfully",
      });
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
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
              <Link to="/kanban" className="flex items-center space-x-3 px-3 py-2 rounded-md bg-indigo-700 text-white font-medium">
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
            <h1 className="text-xl font-bold text-indigo-800">Kanban Board</h1>
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

        {/* Kanban board content */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-indigo-800">Kanban Board</h2>
              <p className="text-gray-500">Drag and drop tasks between columns to update their status</p>
            </div>
            
            <div className="flex gap-3">
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
                      onClick={handleAddTask}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600"
                    >
                      Create Task
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Kanban board */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* To Do Column */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-700 flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    To Do
                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {todoTasks.length}
                    </span>
                  </h3>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div 
                className="p-4 h-[calc(100vh-15rem)] overflow-y-auto"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "To Do")}
              >
                {todoTasks.length > 0 ? (
                  todoTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>No tasks yet</p>
                    <p className="text-xs mt-1">Drop tasks here or add a new task</p>
                  </div>
                )}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-700 flex items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                    In Progress
                    <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      {inProgressTasks.length}
                    </span>
                  </h3>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div 
                className="p-4 h-[calc(100vh-15rem)] overflow-y-auto"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "In Progress")}
              >
                {inProgressTasks.length > 0 ? (
                  inProgressTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>No tasks in progress</p>
                    <p className="text-xs mt-1">Drop tasks here to start working on them</p>
                  </div>
                )}
              </div>
            </div>

            {/* In Review Column */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-700 flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                    In Review
                    <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                      {inReviewTasks.length}
                    </span>
                  </h3>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div 
                className="p-4 h-[calc(100vh-15rem)] overflow-y-auto"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "In Review")}
              >
                {inReviewTasks.length > 0 ? (
                  inReviewTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>No tasks under review</p>
                    <p className="text-xs mt-1">Drop tasks here when ready for review</p>
                  </div>
                )}
              </div>
            </div>

            {/* Done Column */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-700 flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    Done
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      {doneTasks.length}
                    </span>
                  </h3>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div 
                className="p-4 h-[calc(100vh-15rem)] overflow-y-auto"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "Done")}
              >
                {doneTasks.length > 0 ? (
                  doneTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>No completed tasks</p>
                    <p className="text-xs mt-1">Tasks will appear here when done</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Wrap the Kanban board content with the TaskProvider
const KanbanBoard = () => (
  <TaskProvider>
    <KanbanBoardContent />
  </TaskProvider>
);

export default KanbanBoard;
