
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart2,
  FileText,
  List,
  LogOut,
  Settings,
  Users,
  Calendar,
  MessageSquare,
  KanbanSquare,
  GanttChartSquare,
  BookOpen,
  Clock,
} from "lucide-react";

interface SidebarProps {
  organizationName: string;
  organizationPlan: string;
  onLogout: () => void;
  isMenuOpen: boolean;
}

const Sidebar = ({ organizationName, organizationPlan, onLogout, isMenuOpen }: SidebarProps) => (
  <aside
    className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isMenuOpen ? "w-64" : "w-0 md:w-64"
    } overflow-y-auto h-screen sticky top-0 shadow-sm hidden md:block`}
  >
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-indigo-800">{organizationName}</h2>
        <span className="inline-block mt-1 text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
          {organizationPlan} Plan
        </span>
      </div>

      <nav className="space-y-1">
        <Link to="/dashboard">
          <Button
            variant="ghost"
            className="w-full justify-start mb-1 font-normal"
          >
            <BarChart2 className="mr-2 h-5 w-5" /> Dashboard
          </Button>
        </Link>
        <Link to="/tasks">
          <Button
            variant="ghost"
            className="w-full justify-start mb-1 font-normal"
          >
            <List className="mr-2 h-5 w-5" /> Tasks
          </Button>
        </Link>
        <Link to="/kanban">
          <Button
            variant="ghost"
            className="w-full justify-start mb-1 font-normal"
          >
            <KanbanSquare className="mr-2 h-5 w-5" /> Kanban Board
          </Button>
        </Link>
        <Link to="/gantt">
          <Button
            variant="ghost"
            className="w-full justify-start mb-1 font-normal"
          >
            <GanttChartSquare className="mr-2 h-5 w-5" /> Gantt Chart
          </Button>
        </Link>
        <Link to="/files">
          <Button
            variant="ghost"
            className="w-full justify-start mb-1 font-normal"
          >
            <FileText className="mr-2 h-5 w-5" /> Files & Docs
          </Button>
        </Link>
        <Link to="/time-tracking">
          <Button
            variant="ghost"
            className="w-full justify-start mb-1 font-normal"
          >
            <Clock className="mr-2 h-5 w-5" /> Time Tracking
          </Button>
        </Link>
        <Link to="/chat">
          <Button
            variant="ghost"
            className="w-full justify-start mb-1 font-normal"
          >
            <MessageSquare className="mr-2 h-5 w-5" /> Chat
          </Button>
        </Link>
        <Link to="/notes">
          <Button
            variant="ghost"
            className="w-full justify-start mb-1 font-normal"
          >
            <BookOpen className="mr-2 h-5 w-5" /> Notes
          </Button>
        </Link>
        <Link to="/calendar">
          <Button
            variant="ghost"
            className="w-full justify-start mb-1 font-normal"
          >
            <Calendar className="mr-2 h-5 w-5" /> Calendar
          </Button>
        </Link>
        <Link to="/team">
          <Button
            variant="ghost"
            className="w-full justify-start mb-1 font-normal"
          >
            <Users className="mr-2 h-5 w-5" /> Team
          </Button>
        </Link>
        <Link to="/settings">
          <Button
            variant="ghost"
            className="w-full justify-start mb-1 font-normal"
          >
            <Settings className="mr-2 h-5 w-5" /> Settings
          </Button>
        </Link>
      </nav>
    </div>

    <div className="p-6 border-t border-gray-200 mt-auto">
      <Button
        variant="outline"
        className="w-full flex items-center justify-center"
        onClick={onLogout}
      >
        <LogOut className="mr-2 h-4 w-4" /> Logout
      </Button>
    </div>
  </aside>
);

export default Sidebar;
