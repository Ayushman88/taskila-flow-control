
import { useState, useEffect } from "react";
import ChatBot from "@/components/chatbot/ChatBot";
import { useTaskContext } from "@/context/TaskContext";

interface DashboardChatBotProps {
  organizationId: string;
}

const DashboardChatBot = ({ organizationId }: DashboardChatBotProps) => {
  const { tasks, projects } = useTaskContext();
  const [taskSummary, setTaskSummary] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    // Generate task summary
    if (tasks.length > 0 || projects.length > 0) {
      const highPriorityTasks = tasks.filter(task => task.priority === "High");
      const dueSoonTasks = tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const inOneWeek = new Date();
        inOneWeek.setDate(today.getDate() + 7);
        return dueDate <= inOneWeek && dueDate >= today;
      });
      
      const inProgressProjects = projects.filter(project => project.status === "In Progress");
      
      const summary = `You have ${highPriorityTasks.length} high priority tasks, ${dueSoonTasks.length} tasks due in the next week, and ${inProgressProjects.length} projects in progress.`;
      setTaskSummary(summary);
    }
  }, [tasks, projects]);

  return <ChatBot organizationId={organizationId} taskSummary={taskSummary} />;
};

export default DashboardChatBot;
