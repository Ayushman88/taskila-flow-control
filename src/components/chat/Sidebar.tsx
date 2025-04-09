
import { Link } from "react-router-dom";
import { 
  BarChart2, 
  List, 
  LogOut, 
  Settings, 
  Users,
  Calendar,
  FileText,
  MessageSquare,
  KanbanSquare,
  GanttChartSquare,
  BookOpen,
  Clock
} from "lucide-react";

interface Organization {
  name: string;
  teamSize: string;
  plan: string;
}

interface SidebarProps {
  organization: Organization;
  isMenuOpen: boolean;
}

const Sidebar = ({ organization, isMenuOpen }: SidebarProps) => {
  return (
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
            <Link to="/time-tracking" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
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
            <Link to="/chat" className="flex items-center space-x-3 px-3 py-2 rounded-md bg-indigo-700 text-white font-medium">
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
  );
};

export default Sidebar;
