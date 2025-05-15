
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import TaskList from "./pages/TaskList";
import TimeTracking from "./pages/TimeTracking";
import KanbanBoard from "./pages/KanbanBoard";
import GanttChart from "./pages/GanttChart";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import CreateOrganization from "./pages/CreateOrganization";
import Team from "./pages/Team";
import ProjectDetails from "./pages/ProjectDetails";
import Notes from "./pages/Notes";
import FilesAndDocs from "./pages/FilesAndDocs";
import Chat from "./pages/Chat";
import JoinOrganization from "./pages/JoinOrganization";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./hooks/use-toast";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Protected routes */}
          <Route path="/create-organization" element={<ProtectedRoute><CreateOrganization /></ProtectedRoute>} />
          <Route path="/join-organization" element={<ProtectedRoute><JoinOrganization /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
          <Route path="/time-tracking" element={<ProtectedRoute><TimeTracking /></ProtectedRoute>} />
          <Route path="/kanban" element={<ProtectedRoute><KanbanBoard /></ProtectedRoute>} />
          <Route path="/gantt" element={<ProtectedRoute><GanttChart /></ProtectedRoute>} />
          <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/project/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
          <Route path="/files" element={<ProtectedRoute><FilesAndDocs /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
