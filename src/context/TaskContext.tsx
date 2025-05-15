import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { collection, addDoc, updateDoc, deleteDoc, getDocs, doc, query, where } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";
import { useAuth } from "@/context/AuthContext";

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
  createdBy: string;
  organization_id: string;
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
  createdBy: string;
  organization_id: string;
}

interface TaskContextType {
  tasks: Task[];
  projects: Project[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "createdBy" | "organization_id">) => Promise<Task>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addProject: (project: Omit<Project, "id" | "createdAt" | "createdBy" | "organization_id">) => Promise<Project>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getTasksByProject: (projectId: string) => Task[];
  getTasksByStatus: (status: Task["status"]) => Task[];
  getProject: (id: string) => Project | undefined;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, currentOrganization } = useAuth();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, currentOrganization]);

  const loadData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const orgId = localStorage.getItem("currentOrganizationId");
      if (!orgId) {
        setTasks([]);
        setProjects([]);
        setIsLoading(false);
        return;
      }

      console.log("Loading data for organization:", orgId);

      // Load tasks
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('organization_id', '==', orgId)
      );
      const tasksSnapshot = await getDocs(tasksQuery);
      const loadedTasks: Task[] = [];
      
      tasksSnapshot.forEach(doc => {
        loadedTasks.push({ id: doc.id, ...doc.data() } as Task);
      });
      
      setTasks(loadedTasks);
      console.log("Loaded tasks:", loadedTasks.length);

      // Load projects
      const projectsQuery = query(
        collection(db, 'projects'),
        where('organization_id', '==', orgId)
      );
      const projectsSnapshot = await getDocs(projectsQuery);
      const loadedProjects: Project[] = [];
      
      projectsSnapshot.forEach(doc => {
        loadedProjects.push({ id: doc.id, ...doc.data() } as Project);
      });
      
      setProjects(loadedProjects);
      console.log("Loaded projects:", loadedProjects.length);
    } catch (error) {
      console.error("Error loading data from Firestore:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  const addTask = async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "createdBy" | "organization_id">) => {
    if (!user) throw new Error("User not authenticated");
    
    const orgId = localStorage.getItem("currentOrganizationId");
    if (!orgId) throw new Error("No organization selected");

    try {
      const now = new Date().toISOString();
      const taskWithMeta = {
        ...taskData,
        createdBy: user.uid,
        organization_id: orgId,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(collection(db, 'tasks'), taskWithMeta);
      
      const newTask: Task = {
        id: docRef.id,
        ...taskWithMeta
      };
      
      setTasks(prevTasks => [...prevTasks, newTask]);
      
      return newTask;
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  };

  const updateTask = async (id: string, updatedFields: Partial<Task>) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const taskRef = doc(db, 'tasks', id);
      
      const updates = {
        ...updatedFields,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(taskRef, updates);
      
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === id 
          ? { ...task, ...updatedFields, updatedAt: updates.updatedAt } 
          : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      await deleteDoc(doc(db, 'tasks', id));
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  };

  const addProject = async (projectData: Omit<Project, "id" | "createdAt" | "createdBy" | "organization_id">) => {
    if (!user) throw new Error("User not authenticated");
    
    const orgId = localStorage.getItem("currentOrganizationId");
    if (!orgId) throw new Error("No organization selected");

    try {
      const projectWithMeta = {
        ...projectData,
        createdBy: user.uid,
        organization_id: orgId,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'projects'), projectWithMeta);
      
      const newProject: Project = {
        id: docRef.id,
        ...projectWithMeta
      };
      
      setProjects(prevProjects => [...prevProjects, newProject]);
      
      return newProject;
    } catch (error) {
      console.error("Error adding project:", error);
      throw error;
    }
  };

  const updateProject = async (id: string, updatedFields: Partial<Project>) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const projectRef = doc(db, 'projects', id);
      await updateDoc(projectRef, updatedFields);
      
      setProjects(prevProjects =>
        prevProjects.map(project => project.id === id 
          ? { ...project, ...updatedFields } 
          : project)
      );
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      // Delete the project
      await deleteDoc(doc(db, 'projects', id));
      
      // Also delete all tasks associated with this project
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('projectId', '==', id)
      );
      
      const tasksSnapshot = await getDocs(tasksQuery);
      
      // Batch delete all tasks
      const deletePromises = tasksSnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      
      await Promise.all(deletePromises);
      
      // Update state
      setProjects(prevProjects => prevProjects.filter(project => project.id !== id));
      setTasks(prevTasks => prevTasks.filter(task => task.projectId !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  };

  const getTasksByProject = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter(task => task.status === status);
  };

  const getProject = (id: string) => {
    return projects.find(project => project.id === id);
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
        isLoading,
        refreshData
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
