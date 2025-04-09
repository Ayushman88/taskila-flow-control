
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BarChart2, 
  List, 
  LogOut, 
  PlusCircle, 
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
  ArrowLeft,
  Send,
  Plus,
  MoreVertical,
  Paperclip,
  Smile,
  Image
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Avatar } from "@/components/ui/avatar";
import { TaskProvider, useTaskContext } from "@/context/TaskContext";

interface Organization {
  name: string;
  teamSize: string;
  plan: string;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isCurrentUser: boolean;
}

interface ChatChannel {
  id: string;
  name: string;
  type: "direct" | "channel";
  participants: string[];
  messages: ChatMessage[];
  unreadCount: number;
  lastActivity: string;
}

// Sample members for demonstration
const teamMembers = [
  {
    id: "user1",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Jane"
  },
  {
    id: "user2",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=John"
  },
  {
    id: "user3",
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex"
  }
];

// Sample channels for demonstration
const sampleChannels: ChatChannel[] = [
  {
    id: "channel1",
    name: "General",
    type: "channel",
    participants: ["admin@example.com", "jane.smith@example.com", "john.doe@example.com", "alex@example.com"],
    messages: [
      {
        id: "msg1",
        content: "Welcome to the General channel! This is where we discuss team-wide topics.",
        sender: "admin@example.com",
        timestamp: "2023-04-01T09:00:00Z",
        isCurrentUser: true
      },
      {
        id: "msg2",
        content: "Thanks for setting this up! Looking forward to working with everyone.",
        sender: "jane.smith@example.com",
        timestamp: "2023-04-01T09:05:00Z",
        isCurrentUser: false
      },
      {
        id: "msg3",
        content: "I've added the project timeline to our shared documents. Let me know if you have any questions!",
        sender: "admin@example.com",
        timestamp: "2023-04-01T09:10:00Z",
        isCurrentUser: true
      }
    ],
    unreadCount: 0,
    lastActivity: "2023-04-01T09:10:00Z"
  },
  {
    id: "channel2",
    name: "Project Alpha",
    type: "channel",
    participants: ["admin@example.com", "jane.smith@example.com", "alex@example.com"],
    messages: [
      {
        id: "msg4",
        content: "Let's use this channel to collaborate on Project Alpha.",
        sender: "admin@example.com",
        timestamp: "2023-04-02T10:00:00Z",
        isCurrentUser: true
      },
      {
        id: "msg5",
        content: "I've started working on the initial mockups. Will share by end of day.",
        sender: "alex@example.com",
        timestamp: "2023-04-02T10:15:00Z",
        isCurrentUser: false
      }
    ],
    unreadCount: 2,
    lastActivity: "2023-04-02T10:15:00Z"
  },
  {
    id: "dm1",
    name: "Jane Smith",
    type: "direct",
    participants: ["admin@example.com", "jane.smith@example.com"],
    messages: [
      {
        id: "msg6",
        content: "Hi Jane, do you have a moment to discuss the client presentation?",
        sender: "admin@example.com",
        timestamp: "2023-04-03T14:30:00Z",
        isCurrentUser: true
      },
      {
        id: "msg7",
        content: "Sure! I'm free now if you want to chat.",
        sender: "jane.smith@example.com",
        timestamp: "2023-04-03T14:32:00Z",
        isCurrentUser: false
      }
    ],
    unreadCount: 1,
    lastActivity: "2023-04-03T14:32:00Z"
  },
  {
    id: "dm2",
    name: "John Doe",
    type: "direct",
    participants: ["admin@example.com", "john.doe@example.com"],
    messages: [
      {
        id: "msg8",
        content: "Hey John, could you review the code I pushed this morning?",
        sender: "admin@example.com",
        timestamp: "2023-04-04T11:00:00Z",
        isCurrentUser: true
      },
      {
        id: "msg9",
        content: "Already on it! Will send feedback by lunch.",
        sender: "john.doe@example.com",
        timestamp: "2023-04-04T11:05:00Z",
        isCurrentUser: false
      }
    ],
    unreadCount: 0,
    lastActivity: "2023-04-04T11:05:00Z"
  }
];

const ChatContent = () => {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chatChannels, setChatChannels] = useState<ChatChannel[]>(sampleChannels);
  const [activeChannel, setActiveChannel] = useState<ChatChannel | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { projects } = useTaskContext();

  // Scroll to bottom of messages when channel changes or new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChannel]);

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
    
    // Set initial active channel
    if (chatChannels.length > 0) {
      setActiveChannel(chatChannels[0]);
    }
    
    // Try to load channels from localStorage
    const savedChannels = localStorage.getItem("chatChannels");
    if (savedChannels) {
      setChatChannels(JSON.parse(savedChannels));
    } else {
      // Save sample channels to localStorage
      localStorage.setItem("chatChannels", JSON.stringify(sampleChannels));
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

  // Format timestamp to a readable format
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get the date for message grouping
  const getMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Send a new message
  const sendMessage = () => {
    if (!newMessage.trim() || !activeChannel) return;
    
    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      content: newMessage,
      sender: userEmail,
      timestamp: new Date().toISOString(),
      isCurrentUser: true
    };
    
    const updatedChannel = {
      ...activeChannel,
      messages: [...activeChannel.messages, newMsg],
      lastActivity: new Date().toISOString()
    };
    
    const updatedChannels = chatChannels.map(channel => 
      channel.id === activeChannel.id ? updatedChannel : channel
    );
    
    setChatChannels(updatedChannels);
    setActiveChannel(updatedChannel);
    setNewMessage("");
    
    // Save to localStorage
    localStorage.setItem("chatChannels", JSON.stringify(updatedChannels));
    
    // Scroll to bottom
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Handle key press to send message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Create a new channel
  const createChannel = () => {
    const channelName = prompt("Enter channel name:");
    if (channelName) {
      const newChannel: ChatChannel = {
        id: crypto.randomUUID(),
        name: channelName,
        type: "channel",
        participants: [userEmail, ...teamMembers.map(member => member.email)],
        messages: [],
        unreadCount: 0,
        lastActivity: new Date().toISOString()
      };
      
      const updatedChannels = [...chatChannels, newChannel];
      setChatChannels(updatedChannels);
      setActiveChannel(newChannel);
      
      // Save to localStorage
      localStorage.setItem("chatChannels", JSON.stringify(updatedChannels));
      
      toast({
        title: "Channel Created",
        description: `Channel "${channelName}" has been created.`
      });
    }
  };

  // Start a new direct message
  const startDirectMessage = () => {
    // This would typically show a user selection UI
    // For simplicity, we'll just create a direct message with a random team member
    const randomIndex = Math.floor(Math.random() * teamMembers.length);
    const member = teamMembers[randomIndex];
    
    // Check if DM already exists
    const existingDM = chatChannels.find(
      channel => channel.type === "direct" && channel.participants.includes(member.email)
    );
    
    if (existingDM) {
      setActiveChannel(existingDM);
      return;
    }
    
    const newDM: ChatChannel = {
      id: crypto.randomUUID(),
      name: member.name,
      type: "direct",
      participants: [userEmail, member.email],
      messages: [],
      unreadCount: 0,
      lastActivity: new Date().toISOString()
    };
    
    const updatedChannels = [...chatChannels, newDM];
    setChatChannels(updatedChannels);
    setActiveChannel(newDM);
    
    // Save to localStorage
    localStorage.setItem("chatChannels", JSON.stringify(updatedChannels));
  };

  // Filter channels based on search term
  const filteredChannels = chatChannels.filter(channel => 
    channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get avatar for a sender
  const getAvatar = (email: string) => {
    if (email === userEmail) return "https://api.dicebear.com/7.x/adventurer/svg?seed=Admin";
    
    const member = teamMembers.find(m => m.email === email);
    return member ? member.avatar : `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`;
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
        <header className="bg-white p-4 shadow-sm flex justify-between items-center z-10">
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

        {/* Chat layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Channels sidebar */}
          <div className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  type="search" 
                  placeholder="Search chats..." 
                  className="pl-8 w-full bg-gray-50 border-gray-200" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="p-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-sm text-gray-500">CHANNELS</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={createChannel}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-1">
                {filteredChannels
                  .filter(channel => channel.type === "channel")
                  .map(channel => (
                    <button
                      key={channel.id}
                      className={`w-full px-3 py-2 text-left rounded-md text-sm flex items-center justify-between ${
                        activeChannel?.id === channel.id 
                          ? 'bg-indigo-100 text-indigo-800' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveChannel(channel)}
                    >
                      <span className="flex items-center">
                        <span className="font-medium"># {channel.name}</span>
                      </span>
                      {channel.unreadCount > 0 && (
                        <span className="bg-indigo-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {channel.unreadCount}
                        </span>
                      )}
                    </button>
                  ))}
              </div>
              
              <div className="flex justify-between items-center mt-4 mb-2">
                <h3 className="font-semibold text-sm text-gray-500">DIRECT MESSAGES</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={startDirectMessage}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-1">
                {filteredChannels
                  .filter(channel => channel.type === "direct")
                  .map(channel => (
                    <button
                      key={channel.id}
                      className={`w-full px-3 py-2 text-left rounded-md text-sm flex items-center justify-between ${
                        activeChannel?.id === channel.id 
                          ? 'bg-indigo-100 text-indigo-800' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveChannel(channel)}
                    >
                      <span className="flex items-center">
                        <span className="flex h-6 w-6 mr-2 relative">
                          <img 
                            src={getAvatar(channel.participants.find(p => p !== userEmail) || "")} 
                            className="rounded-full w-6 h-6"
                            alt={channel.name}
                          />
                        </span>
                        <span className="font-medium">{channel.name}</span>
                      </span>
                      {channel.unreadCount > 0 && (
                        <span className="bg-indigo-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {channel.unreadCount}
                        </span>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          </div>
          
          {/* Chat area */}
          <div className="flex-1 flex flex-col bg-gray-50">
            {activeChannel ? (
              <>
                {/* Chat header */}
                <div className="px-4 py-3 bg-white border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="mr-2 md:hidden">
                      <ArrowLeft className="h-5 w-5" onClick={() => setActiveChannel(null)} />
                    </Button>
                    <div>
                      <h2 className="font-semibold text-lg">
                        {activeChannel.type === "channel" ? `# ${activeChannel.name}` : activeChannel.name}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {activeChannel.participants.length} members
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Messages area */}
                <div className="flex-1 overflow-y-auto px-4 py-6">
                  {activeChannel.messages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700">No messages yet</h3>
                      <p className="text-gray-500 mb-6">
                        {activeChannel.type === "channel" 
                          ? `Be the first to send a message in #${activeChannel.name}` 
                          : `Start a conversation with ${activeChannel.name}`
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Group messages by date */}
                      {Array.from(
                        new Set(
                          activeChannel.messages.map(msg => 
                            getMessageDate(msg.timestamp)
                          )
                        )
                      ).map(date => (
                        <div key={date}>
                          <div className="flex items-center my-4">
                            <div className="flex-1 border-b border-gray-200"></div>
                            <span className="px-4 text-sm text-gray-500">{date}</span>
                            <div className="flex-1 border-b border-gray-200"></div>
                          </div>
                          
                          {/* Messages for this date */}
                          {activeChannel.messages
                            .filter(msg => getMessageDate(msg.timestamp) === date)
                            .map((message, index) => (
                              <div 
                                key={message.id} 
                                className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className={`max-w-[70%] flex ${message.isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                  {!message.isCurrentUser && (
                                    <div className="flex-shrink-0 mr-3">
                                      <Avatar className="h-8 w-8">
                                        <img src={getAvatar(message.sender)} alt="Avatar" />
                                      </Avatar>
                                    </div>
                                  )}
                                  <div>
                                    <div className={`
                                      px-4 py-2 rounded-lg 
                                      ${message.isCurrentUser 
                                        ? 'bg-indigo-600 text-white rounded-br-none' 
                                        : 'bg-white border border-gray-200 rounded-bl-none'
                                      }
                                    `}>
                                      {message.content}
                                    </div>
                                    <div className={`text-xs text-gray-500 mt-1 ${message.isCurrentUser ? 'text-right' : 'text-left'}`}>
                                      {formatTimestamp(message.timestamp)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
                
                {/* Message input */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="relative">
                    <Textarea
                      placeholder={`Message ${activeChannel.type === 'channel' ? '#' + activeChannel.name : activeChannel.name}...`}
                      className="min-h-[80px] pr-24"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                    />
                    <div className="absolute right-3 bottom-2 flex items-center space-x-1.5">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                        <Image className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                        <Smile className="h-5 w-5" />
                      </Button>
                      <Button 
                        onClick={sendMessage} 
                        className="h-8 bg-indigo-600 hover:bg-indigo-700"
                        disabled={!newMessage.trim()}
                      >
                        <Send className="h-4 w-4 mr-1" /> Send
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <Card className="w-96 text-center">
                  <CardContent className="pt-6">
                    <MessageSquare className="h-16 w-16 text-indigo-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Team Chat</h2>
                    <p className="text-gray-500 mb-6">Select a channel or direct message to start chatting</p>
                    <div className="flex justify-center space-x-4">
                      <Button onClick={createChannel}>
                        <PlusCircle className="mr-2 h-5 w-5" /> New Channel
                      </Button>
                      <Button variant="outline" onClick={startDirectMessage}>
                        <MessageSquare className="mr-2 h-5 w-5" /> New Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
