
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "In Review" | "Done";
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  assignedTo?: string;
  projectId: string;
  subtasks?: Task[];
  comments?: Comment[];
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  dueDate: string;
  team?: string[];
  createdAt: string;
}

interface TaskContextType {
  tasks: Task[];
  projects: Project[];
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getTasksByProject: (projectId: string) => Task[];
  getTasksByStatus: (status: Task["status"]) => Task[];
  getProject: (id: string) => Project | undefined;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Load initial data from localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    const storedProjects = localStorage.getItem("projects");

    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      // Initialize with sample tasks if none exist
      setTasks(sampleTasks);
    }

    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    } else {
      // Initialize with sample projects if none exist
      setProjects(sampleProjects);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const updateTask = (id: string, updatedFields: Partial<Task>) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, ...updatedFields, updatedAt: new Date().toISOString() } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const addProject = (project: Project) => {
    setProjects([...projects, project]);
  };

  const updateProject = (id: string, updatedFields: Partial<Project>) => {
    setProjects(projects.map((project) => (project.id === id ? { ...project, ...updatedFields } : project)));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id));
    // Also delete all tasks associated with this project
    setTasks(tasks.filter((task) => task.projectId !== id));
  };

  const getTasksByProject = (projectId: string) => {
    return tasks.filter((task) => task.projectId === projectId);
  };

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status);
  };

  const getProject = (id: string) => {
    return projects.find((project) => project.id === id);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        projects,
        addTask,
        updateTask,
        deleteTask,
        addProject,
        updateProject,
        deleteProject,
        getTasksByProject,
        getTasksByStatus,
        getProject,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};

// Sample data
const sampleProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Update the company website with new branding",
    status: "In Progress",
    progress: 60,
    dueDate: "2025-05-15",
    createdAt: "2025-03-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Create a mobile app for our customers",
    status: "To Do",
    progress: 10,
    dueDate: "2025-06-30",
    createdAt: "2025-03-15T09:30:00Z",
  },
  {
    id: "3",
    name: "Marketing Campaign",
    description: "Q2 digital marketing campaign planning",
    status: "In Progress",
    progress: 45,
    dueDate: "2025-04-30",
    createdAt: "2025-03-10T14:15:00Z",
  }
];

const sampleTasks: Task[] = [
  {
    id: "task1",
    title: "Design homepage mockup",
    description: "Create wireframes for the new homepage design",
    status: "In Progress",
    priority: "High",
    dueDate: "2025-04-20",
    projectId: "1",
    createdAt: "2025-03-05T11:30:00Z",
    updatedAt: "2025-03-06T09:15:00Z",
  },
  {
    id: "task2",
    title: "Develop landing page",
    description: "Implement the new landing page based on approved designs",
    status: "To Do",
    priority: "Medium",
    dueDate: "2025-04-25",
    projectId: "1",
    createdAt: "2025-03-07T10:20:00Z",
    updatedAt: "2025-03-07T10:20:00Z",
  },
  {
    id: "task3",
    title: "Create app wireframes",
    description: "Design initial wireframes for the mobile application",
    status: "Done",
    priority: "High",
    dueDate: "2025-03-30",
    projectId: "2",
    createdAt: "2025-03-16T13:45:00Z",
    updatedAt: "2025-03-29T16:20:00Z",
  },
  {
    id: "task4",
    title: "Research competitors",
    description: "Analyze competing applications and identify opportunities",
    status: "In Progress",
    priority: "Medium",
    dueDate: "2025-04-10",
    projectId: "2",
    createdAt: "2025-03-17T09:30:00Z",
    updatedAt: "2025-03-18T14:10:00Z",
  },
  {
    id: "task5",
    title: "Define target audience",
    description: "Create user personas for the marketing campaign",
    status: "Done",
    priority: "High",
    dueDate: "2025-03-25",
    projectId: "3",
    createdAt: "2025-03-11T11:00:00Z",
    updatedAt: "2025-03-24T16:45:00Z",
  },
  {
    id: "task6",
    title: "Create social media content calendar",
    description: "Plan out posts for the next 3 months",
    status: "In Progress",
    priority: "Medium",
    dueDate: "2025-04-15",
    projectId: "3",
    createdAt: "2025-03-12T10:15:00Z",
    updatedAt: "2025-03-14T09:50:00Z",
  },
  {
    id: "task7",
    title: "SEO optimization",
    description: "Improve website SEO based on keyword research",
    status: "To Do",
    priority: "Medium",
    dueDate: "2025-05-01",
    projectId: "1",
    createdAt: "2025-03-08T15:20:00Z",
    updatedAt: "2025-03-08T15:20:00Z",
  },
  {
    id: "task8",
    title: "Implement analytics tracking",
    description: "Set up Google Analytics and conversion tracking",
    status: "To Do",
    priority: "Low",
    dueDate: "2025-05-05",
    projectId: "1",
    createdAt: "2025-03-09T14:10:00Z",
    updatedAt: "2025-03-09T14:10:00Z",
  },
  {
    id: "task9",
    title: "Design app logo",
    description: "Create logo variations for the mobile app",
    status: "To Do",
    priority: "Medium",
    dueDate: "2025-04-20",
    projectId: "2",
    createdAt: "2025-03-18T11:30:00Z",
    updatedAt: "2025-03-18T11:30:00Z",
  },
  {
    id: "task10",
    title: "Prepare ad creative",
    description: "Design banner ads for the campaign",
    status: "To Do",
    priority: "High",
    dueDate: "2025-04-10",
    projectId: "3",
    createdAt: "2025-03-13T13:25:00Z",
    updatedAt: "2025-03-13T13:25:00Z",
  }
];
