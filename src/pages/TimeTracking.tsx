
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  Play, 
  Pause, 
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
  Timer,
  StopCircle,
  RotateCcw,
  ArrowLeft
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { TaskProvider, useTaskContext } from "@/context/TaskContext";

interface TimeEntry {
  id: string;
  projectId: string;
  taskId: string | null;
  description: string;
  startTime: Date;
  endTime: Date | null;
  duration: number; // in seconds
  date: string;
  billable: boolean;
}

interface Organization {
  name: string;
  teamSize: string;
  plan: string;
}

const TimeTrackingContent = () => {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("today");
  const [activeTimer, setActiveTimer] = useState<TimeEntry | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [description, setDescription] = useState("");
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  
  const { projects } = useTaskContext();

  // Timer interval for ongoing tracking
  useEffect(() => {
    let interval: number | null = null;
    
    if (timerRunning && activeTimer) {
      interval = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, activeTimer]);

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
    
    // Load time entries from localStorage
    const savedEntries = localStorage.getItem("timeEntries");
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries);
      // Convert string dates back to Date objects
      const entries = parsed.map((entry: any) => ({
        ...entry,
        startTime: new Date(entry.startTime),
        endTime: entry.endTime ? new Date(entry.endTime) : null
      }));
      setTimeEntries(entries);
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

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get this week's entries
  const getThisWeekEntries = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday as start of week
    
    return timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startOfWeek && entryDate <= today;
    });
  };

  // Get this month's entries
  const getThisMonthEntries = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    return timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startOfMonth && entryDate <= today;
    });
  };

  // Start a new timer
  const startTimer = (projectId: string) => {
    if (timerRunning) {
      toast({
        title: "Timer Already Running",
        description: "Please stop the current timer before starting a new one.",
        variant: "destructive"
      });
      return;
    }
    
    const newTimer: TimeEntry = {
      id: crypto.randomUUID(),
      projectId,
      taskId: null,
      description: description,
      startTime: new Date(),
      endTime: null,
      duration: 0,
      date: getTodayDate(),
      billable: true
    };
    
    setActiveTimer(newTimer);
    setTimerRunning(true);
    setElapsedTime(0);
    
    toast({
      title: "Timer Started",
      description: `Tracking time for ${projects.find(p => p.id === projectId)?.name || 'Unknown Project'}`
    });
  };

  // Pause the current timer
  const pauseTimer = () => {
    if (!timerRunning || !activeTimer) return;
    
    setTimerRunning(false);
    
    toast({
      title: "Timer Paused",
      description: `You've tracked ${formatTime(elapsedTime)} so far`
    });
  };

  // Resume the current timer
  const resumeTimer = () => {
    if (timerRunning || !activeTimer) return;
    
    setTimerRunning(true);
    
    toast({
      title: "Timer Resumed",
      description: "Continuing to track time"
    });
  };

  // Stop and save the current timer
  const stopTimer = () => {
    if (!activeTimer) return;
    
    const endTime = new Date();
    const duration = elapsedTime;
    
    const completedEntry: TimeEntry = {
      ...activeTimer,
      endTime,
      duration,
      description: description || 'Unnamed time entry'
    };
    
    const updatedEntries = [...timeEntries, completedEntry];
    setTimeEntries(updatedEntries);
    
    // Save to localStorage
    localStorage.setItem("timeEntries", JSON.stringify(updatedEntries));
    
    setActiveTimer(null);
    setTimerRunning(false);
    setElapsedTime(0);
    setDescription("");
    
    toast({
      title: "Time Entry Saved",
      description: `Tracked ${formatTime(duration)} for ${projects.find(p => p.id === completedEntry.projectId)?.name || 'Unknown Project'}`
    });
  };

  // Reset the current timer without saving
  const resetTimer = () => {
    if (window.confirm("Are you sure you want to discard this time entry?")) {
      setActiveTimer(null);
      setTimerRunning(false);
      setElapsedTime(0);
      setDescription("");
      
      toast({
        title: "Timer Reset",
        description: "Time entry has been discarded"
      });
    }
  };

  // Calculate total time for a given period
  const calculateTotalTime = (entries: TimeEntry[]) => {
    return entries.reduce((total, entry) => total + entry.duration, 0);
  };

  // Get entries for a specific project
  const getProjectEntries = (projectId: string) => {
    return timeEntries.filter(entry => entry.projectId === projectId);
  };

  // Calculate percentage of time spent on a project
  const calculateProjectPercentage = (projectId: string, periodEntries: TimeEntry[]) => {
    const projectTime = calculateTotalTime(periodEntries.filter(entry => entry.projectId === projectId));
    const totalTime = calculateTotalTime(periodEntries);
    return totalTime === 0 ? 0 : Math.round((projectTime / totalTime) * 100);
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
              <Link to="/time-tracking" className="flex items-center space-x-3 px-3 py-2 rounded-md bg-indigo-700 text-white font-medium">
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
              <Link to="/team" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
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
            <h1 className="text-xl font-bold text-indigo-800">Time Tracking</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex">
              <div className="relative mr-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  type="search" 
                  placeholder="Search entries..." 
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

        {/* Time tracking content */}
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
                <h1 className="text-3xl font-bold text-indigo-800">Time Tracking</h1>
                <p className="text-gray-500">Track time for your projects and tasks</p>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Export Time Report
                </Button>
              </div>
            </div>
          </div>

          {/* Current Timer Card */}
          <Card className="mb-6 border-2 border-indigo-100">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">What are you working on?</label>
                    <Input
                      id="description"
                      placeholder="Enter a description..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={!!activeTimer && !timerRunning}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                    <select 
                      id="project" 
                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={!!activeTimer}
                    >
                      <option value="">Select a project</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center">
                  <div className="text-4xl font-mono font-bold mb-4">
                    {formatTime(elapsedTime)}
                  </div>
                  
                  <div className="flex gap-3">
                    {!activeTimer ? (
                      <Button 
                        onClick={() => startTimer(projects[0]?.id || 'no-project')} 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      >
                        <Play className="mr-2 h-5 w-5" /> Start Timer
                      </Button>
                    ) : timerRunning ? (
                      <Button variant="outline" onClick={pauseTimer}>
                        <Pause className="mr-2 h-5 w-5" /> Pause
                      </Button>
                    ) : (
                      <Button 
                        onClick={resumeTimer} 
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                      >
                        <Play className="mr-2 h-5 w-5" /> Resume
                      </Button>
                    )}
                    
                    {activeTimer && (
                      <>
                        <Button 
                          variant="outline" 
                          onClick={stopTimer} 
                          className="border-green-300 text-green-700 hover:bg-green-50"
                        >
                          <StopCircle className="mr-2 h-5 w-5" /> Save
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={resetTimer}
                          className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                          <RotateCcw className="mr-2 h-5 w-5" /> Reset
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time entries tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
              <TabsTrigger value="projects">By Project</TabsTrigger>
            </TabsList>
            
            <TabsContent value="today" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Today's Time Entries</span>
                    <span className="text-lg font-mono">
                      Total: {formatTime(calculateTotalTime(timeEntries.filter(entry => entry.date === getTodayDate())))}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {timeEntries.filter(entry => entry.date === getTodayDate()).length > 0 ? (
                    <div className="space-y-4">
                      {timeEntries
                        .filter(entry => entry.date === getTodayDate())
                        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                        .map(entry => (
                          <div key={entry.id} className="flex items-start p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="font-medium">{entry.description}</h4>
                                <span className="font-mono">{formatTime(entry.duration)}</span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {projects.find(p => p.id === entry.projectId)?.name || 'Unknown Project'}
                              </p>
                              <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>
                                  {new Date(entry.startTime).toLocaleTimeString()} - {entry.endTime ? new Date(entry.endTime).toLocaleTimeString() : 'Running'}
                                </span>
                                {entry.billable && <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Billable</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-lg font-medium">No time entries for today</p>
                      <p className="text-sm text-gray-500 mb-4">Start tracking your time to see entries here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="week" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>This Week's Time Entries</span>
                    <span className="text-lg font-mono">
                      Total: {formatTime(calculateTotalTime(getThisWeekEntries()))}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getThisWeekEntries().length > 0 ? (
                    <div className="space-y-4">
                      {getThisWeekEntries()
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map(entry => (
                          <div key={entry.id} className="flex items-start p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="font-medium">{entry.description}</h4>
                                <span className="font-mono">{formatTime(entry.duration)}</span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {projects.find(p => p.id === entry.projectId)?.name || 'Unknown Project'}
                              </p>
                              <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>{new Date(entry.date).toLocaleDateString()}</span>
                                {entry.billable && <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Billable</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-lg font-medium">No time entries for this week</p>
                      <p className="text-sm text-gray-500 mb-4">Start tracking your time to see entries here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="month" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>This Month's Time Entries</span>
                    <span className="text-lg font-mono">
                      Total: {formatTime(calculateTotalTime(getThisMonthEntries()))}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getThisMonthEntries().length > 0 ? (
                    <div className="space-y-4">
                      {getThisMonthEntries()
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map(entry => (
                          <div key={entry.id} className="flex items-start p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="font-medium">{entry.description}</h4>
                                <span className="font-mono">{formatTime(entry.duration)}</span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {projects.find(p => p.id === entry.projectId)?.name || 'Unknown Project'}
                              </p>
                              <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>{new Date(entry.date).toLocaleDateString()}</span>
                                {entry.billable && <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Billable</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-lg font-medium">No time entries for this month</p>
                      <p className="text-sm text-gray-500 mb-4">Start tracking your time to see entries here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="projects" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(project => {
                  const projectTime = calculateTotalTime(getProjectEntries(project.id));
                  const percentage = calculateProjectPercentage(project.id, timeEntries);
                  
                  return (
                    <Card key={project.id}>
                      <CardHeader className="pb-2">
                        <CardTitle>{project.name}</CardTitle>
                        <CardDescription>
                          {formatTime(projectTime)} tracked ({percentage}% of total time)
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <Progress value={percentage} className="h-2" />
                        </div>
                        
                        {getProjectEntries(project.id).length === 0 ? (
                          <div className="text-center py-4">
                            <p className="text-sm text-gray-500">No time tracked for this project yet</p>
                          </div>
                        ) : (
                          <div className="text-sm space-y-2">
                            {getProjectEntries(project.id)
                              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                              .slice(0, 3)
                              .map(entry => (
                                <div key={entry.id} className="flex justify-between py-1 border-b border-gray-100">
                                  <span>{entry.description}</span>
                                  <span className="font-mono">{formatTime(entry.duration)}</span>
                                </div>
                              ))}
                            
                            {getProjectEntries(project.id).length > 3 && (
                              <div className="text-center pt-2">
                                <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-800">
                                  View all entries
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

// Wrap with TaskProvider
const TimeTracking = () => (
  <TaskProvider>
    <TimeTrackingContent />
  </TaskProvider>
);

export default TimeTracking;
