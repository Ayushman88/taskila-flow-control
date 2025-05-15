
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, X, Send, Loader2, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatBotProps {
  organizationId: string;
  taskSummary?: string;
}

const ChatBot = ({ organizationId, taskSummary }: ChatBotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Initialize chatbot with a welcome message
  useEffect(() => {
    if (taskSummary) {
      setMessages([
        {
          id: "welcome",
          content: "Hello! I'm your project assistant. I can help summarize tasks and answer questions about your projects.",
          sender: "bot",
          timestamp: new Date()
        },
        {
          id: "summary",
          content: `Here's a summary of your current tasks: ${taskSummary}`,
          sender: "bot",
          timestamp: new Date()
        }
      ]);
    } else {
      setMessages([
        {
          id: "welcome",
          content: "Hello! I'm your project assistant. How can I help you today?",
          sender: "bot",
          timestamp: new Date()
        }
      ]);
    }
  }, [taskSummary]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !user) return;

    // Add user message to chat
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: input,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // This would normally make an API call to a backend service
      // that integrates with Google's Gemini API.
      // For now, we'll simulate a response
      setTimeout(() => {
        const botReply: Message = {
          id: crypto.randomUUID(),
          content: getSimulatedResponse(input),
          sender: "bot",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botReply]);
        setIsLoading(false);
      }, 1000);
      
      // In a real implementation, you would make an API call like:
      /*
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          userId: user.uid,
          organizationId
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botReply: Message = {
          id: crypto.randomUUID(),
          content: data.reply,
          sender: "bot",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botReply]);
      } else {
        throw new Error('Failed to get response from chatbot');
      }
      */
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: "Sorry, I'm having trouble processing your request right now. Please try again later.",
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple rule-based responses (to be replaced with actual API calls)
  const getSimulatedResponse = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("task") && lowerMessage.includes("summary")) {
      return "Based on your current tasks, you have 3 high priority tasks due this week and 2 tasks that are overdue. Would you like me to list them for you?";
    } else if (lowerMessage.includes("project") && lowerMessage.includes("status")) {
      return "Your current projects are progressing well. The Website Redesign project is at 60% completion and on track to meet the deadline. The Mobile App Development project is just starting with 10% completion.";
    } else if (lowerMessage.includes("deadline") || lowerMessage.includes("due")) {
      return "Your nearest deadline is for the 'Design homepage mockup' task, which is due tomorrow. Would you like me to show you all upcoming deadlines?";
    } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! How can I assist you with your projects today?";
    } else if (lowerMessage.includes("thank")) {
      return "You're welcome! Is there anything else you'd like help with?";
    } else {
      return "I understand you're asking about " + message.slice(0, 20) + "... To provide a better answer, I'd need to connect to the Gemini API. In a real implementation, I would analyze your request and provide specific data from your projects.";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chatbot toggle button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-12 w-12 rounded-full shadow-lg",
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-indigo-500 hover:bg-indigo-600"
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>

      {/* Chatbot window */}
      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-80 sm:w-96 shadow-xl border-gray-200 max-h-[500px] flex flex-col">
          <CardHeader className="bg-indigo-500 text-white py-3 px-4">
            <CardTitle className="text-base font-medium flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              Project Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 overflow-y-auto flex-grow max-h-[350px]">
            <div className="space-y-3">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={cn(
                    "flex flex-col max-w-[85%] rounded-lg p-3 text-sm",
                    message.sender === "user" 
                      ? "bg-indigo-100 ml-auto" 
                      : "bg-gray-100 mr-auto"
                  )}
                >
                  {message.content}
                  <span className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {isLoading && (
                <div className="flex flex-col max-w-[85%] rounded-lg p-3 text-sm bg-gray-100">
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="p-2 border-t">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex w-full space-x-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="sm" 
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ChatBot;
