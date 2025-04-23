import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TaskProvider, useTaskContext, Task } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  BarChart2, 
  List, 
  LogOut, 
  PlusCircle, 
  Settings, 
  Users,
  FileText,
  MessageSquare,
  Search,
  Clock,
  KanbanSquare,
  GanttChartSquare,
  BookOpen,
  Menu,
  ChevronRight,
  ChevronDown,
  Filter,
  CalendarDays
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

interface Organization {
  name: string;
  teamSize: string;
  plan: string;
}

const getDaysBetween = (start: Date, end: Date) => {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((start.getTime() - end.getTime()) / millisecondsPerDay));
};

const getDayOfWeek = (date: Date) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
};

const TaskBar = ({ task, startDate, daysCount }: { 
  task: Task, 
  startDate: Date, 
  daysCount: number 
}) => {
  const taskStart = new Date(task.createdAt);
  const taskEnd = new Date(task.dueDate);
  
  const startDiff = getDaysBetween(startDate, taskStart);
  const duration = getDaysBetween(taskStart, taskEnd) + 1;
  
  if (startDiff + duration < 0 || startDiff > daysCount) {
    return null;
  }
  
  const leftPosition = Math.max(0, startDiff) * 40;
  const width = Math.min(duration, daysCount - startDiff) * 40;
  
  const statusColors = {
    "To Do": "bg-blue-400 border-blue-500",
    "In Progress": "bg-amber-400 border-amber-500",
    "In Review": "bg-purple-400 border-purple-500",
    "Done": "bg-green-400 border-green-500"
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`absolute h-6 rounded-md ${statusColors[task.status]} border cursor-pointer z-10`}
            style={{ 
              left: `${leftPosition}px`, 
              width: `${width}px`,
              top: '4px'
            }}
          >
            <div className="px-2 text-xs text-white truncate whitespace-nowrap">{task.title}</div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">{task.title}</p>
            <p className="text-xs">{task.description}</p>
            <div className="text-xs">
              <div>Status: {task.status}</div>
              <div>Priority: {task.priority}</div>
              <div>Start: {new Date(task.createdAt).toLocaleDateString()}</div>
              <div>Due: {new Date(task.dueDate).toLocaleDateString()}</div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const GanttChartContent = () => {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);
  
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [daysToShow, setDaysToShow] = useState<number>(14);
  
  const { 
    tasks, 
    projects,
    getTasksByProject 
  } = useTaskContext();

  const timelineDates = Array.from({ length: daysToShow }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return date;
  });

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/signin");
      return;
    }
    
    const user = JSON.parse(userStr);
    setUserEmail(user.email);
    
    const orgStr = localStorage.getItem("organization");
    if (orgStr) {
      setOrganization(JSON.parse(orgStr));
    }

    if (projects.length > 0) {
      setExpandedProjects(projects.map(p => p.id));
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setStartDate(today);
  }, [navigate, projects]);
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
    navigate("/");
  };

  const toggleProjectExpand = (projectId: string) => {
    setExpandedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId) 
        : [...prev, projectId]
    );
  };

  const moveDateRange = (days: number) => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + days);
    setStartDate(newDate);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!organization) return <div className="p-8">Loading...</div>;

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-indigo-800">Gantt Chart</h2>
            <p className="text-gray-500">View your project timeline</p>
          </div>
          
          <div className="flex gap-3">
            <Link to="/tasks">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                <PlusCircle className="mr-2 h-5 w-5" /> Add Task
              </Button>
            </Link>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        <Card className="mb-6 p-4 flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => moveDateRange(-7)}>
              Previous Week
            </Button>
            <Button variant="outline" size="sm" onClick={() => moveDateRange(-daysToShow)}>
              Previous {daysToShow} Days
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                setStartDate(today);
              }}
            >
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => moveDateRange(daysToShow)}>
              Next {daysToShow} Days
            </Button>
            <Button variant="outline" size="sm" onClick={() => moveDateRange(7)}>
              Next Week
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1" onClick={() => setDaysToShow(7)}>
              <CalendarDays className="h-4 w-4" />
              Week
            </Button>
            <Button variant="outline" size="sm" className="gap-1" onClick={() => setDaysToShow(14)}>
              <CalendarDays className="h-4 w-4" />
              2 Weeks
            </Button>
            <Button variant="outline" size="sm" className="gap-1" onClick={() => setDaysToShow(30)}>
              <CalendarDays className="h-4 w-4" />
              Month
            </Button>
          </div>
        </Card>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <div className="sticky top-0 bg-gray-50 border-b border-gray-200 z-10">
            <div className="flex">
              <div className="min-w-60 p-4 border-r border-gray-200 font-medium">
                Project / Task
              </div>
              <div className="flex">
                {timelineDates.map((date, index) => (
                  <div 
                    key={index} 
                    className={`w-10 flex-shrink-0 p-2 text-center text-xs border-r border-gray-200 ${
                      date.getDay() === 0 || date.getDay() === 6 ? 'bg-gray-100' : ''
                    }`}
                  >
                    <div className="font-medium">{getDayOfWeek(date)}</div>
                    <div>{date.getDate()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            {projects.map((project) => {
              const projectTasks = getTasksByProject(project.id);
              const isExpanded = expandedProjects.includes(project.id);
              
              return (
                <div key={project.id}>
                  <div 
                    className="flex hover:bg-gray-50 cursor-pointer border-b border-gray-200" 
                    onClick={() => toggleProjectExpand(project.id)}
                  >
                    <div className="min-w-60 p-4 border-r border-gray-200 flex items-center">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 mr-2 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 mr-2 text-gray-400" />
                      )}
                      <span className="font-medium">{project.name}</span>
                    </div>
                    
                    <div className="flex flex-1 relative">
                      {timelineDates.map((date, index) => (
                        <div 
                          key={index} 
                          className={`w-10 h-14 flex-shrink-0 border-r border-gray-200 ${
                            date.getDay() === 0 || date.getDay() === 6 ? 'bg-gray-50' : ''
                          }`}
                        ></div>
                      ))}
                      
                      <div 
                        className="absolute top-4 h-6 bg-indigo-200 border border-indigo-300 rounded-md"
                        style={{ 
                          left: '0px', 
                          width: `${daysToShow * 40}px`,
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  {isExpanded && projectTasks.map((task) => (
                    <div key={task.id} className="flex hover:bg-gray-50 border-b border-gray-200">
                      <div className="min-w-60 p-4 border-r border-gray-200 pl-10">
                        {task.title}
                      </div>
                      
                      <div className="flex flex-1 relative">
                        {timelineDates.map((date, index) => (
                          <div 
                            key={index} 
                            className={`w-10 h-14 flex-shrink-0 border-r border-gray-200 ${
                              date.getDay() === 0 || date.getDay() === 6 ? 'bg-gray-50' : ''
                            }`}
                          ></div>
                        ))}
                        
                        <TaskBar 
                          task={task} 
                          startDate={startDate} 
                          daysCount={daysToShow} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const GanttChart = () => (
  <TaskProvider>
    <GanttChartContent />
  </TaskProvider>
);

export default GanttChart;
