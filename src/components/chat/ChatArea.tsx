
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, Smile } from "lucide-react";
import { MessageSquare } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  isOnline: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  senderEmail: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface ChatAreaProps {
  activeChat: string | null;
  activeChatUser: TeamMember | undefined;
  messages: ChatMessage[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendMessage: () => void;
  getChatMessages: () => ChatMessage[];
}

const ChatArea = ({
  activeChat,
  activeChatUser,
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  getChatMessages
}: ChatAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700">Select a conversation</h3>
          <p className="text-gray-500 mt-2 max-w-md">
            Choose a team member from the list to start chatting.
          </p>
        </div>
      </div>
    );
  }

  const chatMessages = getChatMessages();

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat header */}
      <div className="border-b border-gray-200 p-4 flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={activeChatUser?.avatarUrl} alt={activeChatUser?.name} />
          <AvatarFallback>{activeChatUser?.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{activeChatUser?.name}</div>
          <div className="text-xs text-gray-500 flex items-center">
            <span className={`h-2 w-2 rounded-full mr-1 ${activeChatUser?.isOnline ? 'bg-green-400' : 'bg-gray-300'}`}></span>
            {activeChatUser?.isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto" id="messages-container">
        {chatMessages.map((message, index) => {
          // Check if we need to display a date separator
          const showDateSeparator = index === 0 || 
            formatDate(message.timestamp) !== formatDate(chatMessages[index - 1].timestamp);
          
          return (
            <div key={message.id}>
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
                    <AvatarImage src={activeChatUser?.avatarUrl} alt={message.sender} />
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
            </div>
          );
        })}
        <div ref={messagesEndRef} />
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
    </div>
  );
};

export default ChatArea;
