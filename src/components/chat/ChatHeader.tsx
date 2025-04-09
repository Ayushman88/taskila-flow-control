
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Menu } from "lucide-react";

interface HeaderProps {
  userEmail: string;
  toggleMenu: () => void;
  handleLogout: () => void;
}

const Header = ({ userEmail, toggleMenu, handleLogout }: HeaderProps) => {
  return (
    <header className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden mr-2">
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-indigo-800">Chat</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600 hidden md:block">{userEmail}</div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
