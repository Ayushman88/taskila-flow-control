
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { TaskProvider, useTaskContext } from "@/context/TaskContext";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatArea from "@/components/chat/ChatArea";
import Sidebar from "@/components/chat/Sidebar";

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

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  isOnline: boolean;
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

  if (!organization) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        organization={organization}
        isMenuOpen={isMenuOpen}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen">
        {/* Top bar */}
        <ChatHeader 
          userEmail={userEmail}
          toggleMenu={toggleMenu}
          handleLogout={handleLogout}
        />

        {/* Chat content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Chat sidebar */}
          <ChatSidebar 
            teamMembers={teamMembers}
            activeChat={activeChat}
            selectChat={selectChat}
            navigateBack={() => navigate("/dashboard")}
          />

          {/* Chat main area */}
          <ChatArea 
            activeChat={activeChat}
            activeChatUser={getActiveChatUser()}
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
            getChatMessages={getChatMessages}
          />
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
