
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart2,
  List,
  LogOut,
  Settings,
  Users,
  Clock,
  FileText,
  MessageSquare,
  KanbanSquare,
  GanttChartSquare,
  BookOpen,
  Calendar,
} from "lucide-react";

interface SidebarProps {
  organizationName: string;
  organizationPlan: string;
  onLogout?: () => void;
  isMenuOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  organizationName,
  organizationPlan,
  onLogout,
  isMenuOpen,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(path);
  };

  return (
    <aside
      className={`${
        isMenuOpen ? "block" : "hidden"
      } md:block w-64 bg-gradient-to-b from-indigo-800 to-purple-900 text-white fixed md:static h-screen z-50 transition-all duration-300 ease-in-out`}
    >
      <div className="p-4 border-b border-indigo-700">
        <h2 className="text-xl font-bold">{organizationName}</h2>
        <p className="text-sm text-indigo-200">{organizationPlan} Plan</p>
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
                isActive("/dashboard")
                  ? "bg-indigo-700 text-white font-medium"
                  : "hover:bg-indigo-700 transition-colors"
              }`}
            >
              <BarChart2 className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/kanban"
              className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
                isActive("/kanban")
                  ? "bg-indigo-700 text-white font-medium"
                  : "hover:bg-indigo-700 transition-colors"
              }`}
            >
              <KanbanSquare className="h-5 w-5" />
              <span>Kanban Board</span>
            </Link>
          </li>
          <li>
            <Link
              to="/gantt"
              className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
                isActive("/gantt")
                  ? "bg-indigo-700 text-white font-medium"
                  : "hover:bg-indigo-700 transition-colors"
              }`}
            >
              <GanttChartSquare className="h-5 w-5" />
              <span>Gantt Chart</span>
            </Link>
          </li>
          <li>
            <Link
              to="/tasks"
              className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
                isActive("/tasks")
                  ? "bg-indigo-700 text-white font-medium"
                  : "hover:bg-indigo-700 transition-colors"
              }`}
            >
              <List className="h-5 w-5" />
              <span>Task List</span>
            </Link>
          </li>
          <li>
            <Link
              to="/time-tracking"
              className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
                isActive("/time-tracking")
                  ? "bg-indigo-700 text-white font-medium"
                  : "hover:bg-indigo-700 transition-colors"
              }`}
            >
              <Clock className="h-5 w-5" />
              <span>Time Tracking</span>
            </Link>
          </li>
          <li>
            <Link
              to="/files"
              className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
                isActive("/files")
                  ? "bg-indigo-700 text-white font-medium"
                  : "hover:bg-indigo-700 transition-colors"
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>Files & Docs</span>
            </Link>
          </li>
          <li>
            <Link
              to="/chat"
              className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
                isActive("/chat")
                  ? "bg-indigo-700 text-white font-medium"
                  : "hover:bg-indigo-700 transition-colors"
              }`}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Chat</span>
            </Link>
          </li>
          <li>
            <Link
              to="/notes"
              className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
                isActive("/notes")
                  ? "bg-indigo-700 text-white font-medium"
                  : "hover:bg-indigo-700 transition-colors"
              }`}
            >
              <BookOpen className="h-5 w-5" />
              <span>Notes</span>
            </Link>
          </li>
          <li>
            <Link
              to="/calendar"
              className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
                isActive("/calendar")
                  ? "bg-indigo-700 text-white font-medium"
                  : "hover:bg-indigo-700 transition-colors"
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span>Calendar</span>
            </Link>
          </li>
          <li>
            <Link
              to="/team"
              className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
                isActive("/team")
                  ? "bg-indigo-700 text-white font-medium"
                  : "hover:bg-indigo-700 transition-colors"
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Team</span>
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
                isActive("/settings")
                  ? "bg-indigo-700 text-white font-medium"
                  : "hover:bg-indigo-700 transition-colors"
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </li>
          {onLogout && (
            <li>
              <button
                onClick={onLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
