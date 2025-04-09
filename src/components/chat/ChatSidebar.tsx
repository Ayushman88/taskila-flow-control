
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  isOnline: boolean;
}

interface ChatSidebarProps {
  teamMembers: TeamMember[];
  activeChat: string | null;
  selectChat: (userId: string) => void;
  navigateBack: () => void;
}

const ChatSidebar = ({ 
  teamMembers, 
  activeChat, 
  selectChat,
  navigateBack
}: ChatSidebarProps) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Button 
          variant="outline" 
          onClick={navigateBack} 
          className="mb-4 w-full"
        >
          <span className="mr-2">←</span> Back
        </Button>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            type="search" 
            placeholder="Search chats..." 
            className="pl-8 bg-gray-50 border-gray-200" 
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">
            Team Members
          </h3>
          <ul className="mt-2 space-y-1">
            {teamMembers.map(user => (
              <li key={user.id}>
                <button
                  onClick={() => selectChat(user.id)}
                  className={`w-full flex items-center px-2 py-2 text-sm rounded-md ${
                    activeChat === user.id ? 'bg-indigo-50 text-indigo-800' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    {user.isOnline && (
                      <span className="absolute bottom-0 right-1 block h-2 w-2 rounded-full bg-green-400 ring-1 ring-white"></span>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{user.role}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
