
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, LogOut } from "lucide-react";

interface HeaderProps {
  userEmail: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  toggleMenu: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  userEmail,
  searchTerm,
  setSearchTerm,
  toggleMenu,
  onLogout,
}) => {
  return (
    <header className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMenu}
          className="md:hidden mr-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-indigo-800">Files & Documents</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex">
          <div className="relative mr-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search files..."
              className="pl-8 w-64 bg-gray-50 border-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="text-sm text-gray-600 hidden md:block">{userEmail}</div>
        <Button variant="outline" size="sm" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
