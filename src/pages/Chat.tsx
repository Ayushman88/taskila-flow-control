
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BarChart2, 
  List, 
  LogOut, 
  Settings, 
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Search,
  KanbanSquare,
  GanttChartSquare,
  BookOpen,
  Menu,
  Clock,
  Send,
  Smile,
  Paperclip,
  ArrowLeft 
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { TaskProvider, useTaskContext } from "@/context/TaskContext";

interface Organization {
  name: string;
  teamSize: string;
  plan: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  senderEmail: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

// Sample team members for demonstration
const sampleTeamMembers = [
  {
    id: "user1",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    role: "Product Manager",
    isOnline: true
  },
  {
    id: "user2",
    name: "John Doe",
    email: "john.doe@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    role: "Developer",
    isOnline: true
  },
  {
    id: "user3",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    role: "Designer",
    isOnline: false
  },
  {
    id: "user4",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    role: "Developer",
    isOnline: true
  }
];

const sampleMessages = [
  {
    id: "msg1",
    sender: "John Doe",
    senderEmail: "john.doe@example.com",
    content: "Hi, I've completed the frontend for the dashboard. Can you review it?",
    timestamp: new Date("2023-04-05T10:30:00"),
    read: true
  },
  {
    id: "msg2",
    sender: "You",
    senderEmail: "admin@example.com",
    content: "Sure, I'll take a look at it this afternoon.",
    timestamp: new Date("2023-04-05T10:35:00"),
    read: true
  },
  {
    id: "msg3",
    sender: "John Doe",
    senderEmail: "john.doe@example.com",
    content: "Great, thank you! Let me know if you have any questions.",
    timestamp: new Date("2023-04-05T10:40:00"),
    read: true
  },
  {
    id: "msg4",
    sender: "You",
    senderEmail: "admin@example.com",
    content: "Just reviewed it. Looks good! Just a few minor tweaks needed for the responsive layout.",
    timestamp: new Date("2023-04-05T14:20:00"),
    read: true
  },
  {
    id: "msg5",
    sender: "John Doe",
    senderEmail: "john.doe@example.com",
    content: "I'll fix those right away. Anything specific you'd like me to focus on?",
    timestamp: new Date("2023-04-05T14:25:00"),
    read: true
  }
];

const ChatContent = () => {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>("user2"); // Default to John Doe for demo
  const [messages, setMessages] = useState<ChatMessage[]>(sampleMessages);
  const [newMessage, setNewMessage] = useState("");
  const [teamMembers, setTeamMembers] = useState(sampleTeamMembers);
  
  const { projects } = useTaskContext();

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    const messagesContainer = document.getElementById("messages-container");
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/signin");
      return;
    }
    
    const user = JSON.parse(userStr);
    setUserEmail(user.email);
    
    // Get organization data
    const orgStr = localStorage.getItem("organization");
    if (orgStr) {
      setOrganization(JSON.parse(orgStr));
    }
    
    // Try to load messages from localStorage
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      // Convert string dates back to Date objects
      const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(parsedMessages);
    } else {
      // Save sample messages to localStorage
      localStorage.setItem("chatMessages", JSON.stringify(sampleMessages));
    }
    
    // Load team members from localStorage
    const savedTeamMembers = localStorage.getItem("teamMembers");
    if (savedTeamMembers) {
      setTeamMembers(JSON.parse(savedTeamMembers));
    } else {
      // Save sample team members to localStorage
      localStorage.setItem("teamMembers", JSON.stringify(sampleTeamMembers));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const selectChat = (userId: string) => {
    setActiveChat(userId);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;
    
    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "You",
      senderEmail: userEmail,
      content: newMessage,
      timestamp: new Date(),
      read: true
    };
    
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setNewMessage("");
    
    // Save updated messages to localStorage
    localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
    
    // Simulate response after 1 second
    setTimeout(() => {
      const activeUser = teamMembers.find(user => user.id === activeChat);
      if (activeUser) {
        const responseMsg: ChatMessage = {
          id: crypto.randomUUID(),
          sender: activeUser.name,
          senderEmail: activeUser.email,
          content: `Thanks for your message! This is an automated response from ${activeUser.name}.`,
          timestamp: new Date(),
          read: false
        };
        
        const withResponse = [...updatedMessages, responseMsg];
        setMessages(withResponse);
        
        // Save to localStorage
        localStorage.setItem("chatMessages", JSON.stringify(withResponse));
      }
    }, 1000);
  };

  const getActiveChatUser = () => {
    return teamMembers.find(user => user.id === activeChat);
  };

  const getChatMessages = () => {
    if (!activeChat) return [];
    
    const activePerson = getActiveChatUser();
    if (!activePerson) return [];
    
    return messages.filter(msg => 
      (msg.senderEmail === activePerson.email || msg.senderEmail === userEmail) &&
      (msg.sender === activePerson.name || msg.sender === "You")
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!organization) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - hidden on mobile unless toggled */}
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

      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen">
        {/* Top bar */}
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

        {/* Chat content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Chat sidebar */}
          <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <Button 
                variant="outline" 
                onClick={() => navigate("/dashboard")} 
                className="mb-4 w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
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

          {/* Chat main area */}
          <div className="flex-1 flex flex-col bg-white">
            {activeChat ? (
              <>
                {/* Chat header */}
                <div className="border-b border-gray-200 p-4 flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={getActiveChatUser()?.avatarUrl} alt={getActiveChatUser()?.name} />
                    <AvatarFallback>{getActiveChatUser()?.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{getActiveChatUser()?.name}</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <span className={`h-2 w-2 rounded-full mr-1 ${getActiveChatUser()?.isOnline ? 'bg-green-400' : 'bg-gray-300'}`}></span>
                      {getActiveChatUser()?.isOnline ? 'Online' : 'Offline'}
                    </div>
                  </div>
                </div>

                {/* Messages area */}
                <div 
                  id="messages-container"
                  className="flex-1 p-4 overflow-y-auto"
                >
                  {getChatMessages().map((message, index) => {
                    // Check if we need to display a date separator
                    const showDateSeparator = index === 0 || 
                      formatDate(message.timestamp) !== formatDate(getChatMessages()[index - 1].timestamp);
                    
                    return (
                      <React.Fragment key={message.id}>
                        {showDateSeparator && (
                          <div className="flex justify-center my-4">
                            <span className="px-4 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-500">
                              {formatDate(message.timestamp)}
                            </span>
                          </div>
                        )}
                        <div className={`mb-4 flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                          {message.sender !== 'You' && (
                            <Avatar className="h-8 w-8 mr-2 mt-1">
                              <AvatarImage src={getActiveChatUser()?.avatarUrl} alt={message.sender} />
                              <AvatarFallback>{message.sender.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                          )}
                          <div className={`max-w-[70%] ${message.sender === 'You' ? 'bg-indigo-600 text-white' : 'bg-gray-100'} rounded-lg px-4 py-2`}>
                            <div className="text-sm">{message.content}</div>
                            <div className={`text-xs mt-1 ${message.sender === 'You' ? 'text-indigo-200' : 'text-gray-500'} text-right`}>
                              {formatTime(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Message input */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex items-end gap-2">
                    <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                      <Paperclip className="h-5 w-5 text-gray-500" />
                    </Button>
                    <Textarea 
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      className="flex-1 min-h-[80px] focus-visible:ring-indigo-500"
                    />
                    <Button 
                      size="icon" 
                      className="rounded-full h-10 w-10 bg-indigo-600 hover:bg-indigo-700"
                      onClick={sendMessage}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <div>Press Enter to send, Shift+Enter for new line</div>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-gray-500">
                      <Smile className="h-4 w-4 mr-1" /> 
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">Select a conversation</h3>
                  <p className="text-gray-500 mt-2 max-w-md">
                    Choose a team member from the list to start chatting.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// Wrap with TaskProvider
const Chat = () => (
  <TaskProvider>
    <ChatContent />
  </TaskProvider>
);

export default Chat;
