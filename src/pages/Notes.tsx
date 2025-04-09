
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
  Edit,
  Trash2,
  Star,
  Tag,
  Share2,
  Bookmark,
  BrainCircuit
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { TaskProvider, useTaskContext } from "@/context/TaskContext";

interface Organization {
  name: string;
  teamSize: string;
  plan: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  projectId: string | null;
  isFavorite: boolean;
  color: string;
}

// Sample notes for demonstration
const sampleNotes: Note[] = [
  {
    id: "note1",
    title: "Project Kickoff Ideas",
    content: "- Define project scope\n- Identify key stakeholders\n- Establish project timeline\n- Set up communication channels\n- Discuss budget constraints",
    createdAt: "2023-03-15T10:00:00Z",
    updatedAt: "2023-03-15T10:30:00Z",
    tags: ["project", "planning"],
    projectId: null,
    isFavorite: true,
    color: "bg-amber-100"
  },
  {
    id: "note2",
    title: "Interview Questions",
    content: "1. Tell me about your experience with React.\n2. How do you handle state management?\n3. Describe your workflow with Git.\n4. How do you approach testing?\n5. What's your experience with Agile methodologies?",
    createdAt: "2023-03-18T14:20:00Z",
    updatedAt: "2023-03-18T15:45:00Z",
    tags: ["interview", "hiring"],
    projectId: null,
    isFavorite: false,
    color: "bg-blue-100"
  },
  {
    id: "note3",
    title: "Marketing Campaign Ideas",
    content: "Social Media:\n- Instagram stories with product demos\n- LinkedIn posts on industry trends\n- Twitter threads about customer success stories\n\nEmail Marketing:\n- Weekly newsletter with tips\n- Special promotion for existing customers\n- Re-engagement campaign for inactive users",
    createdAt: "2023-03-20T09:15:00Z",
    updatedAt: "2023-03-21T11:30:00Z",
    tags: ["marketing", "social media"],
    projectId: null,
    isFavorite: true,
    color: "bg-green-100"
  },
  {
    id: "note4",
    title: "Weekly Team Meeting Notes",
    content: "Attendees: John, Sarah, Mark, Lisa\n\nAgenda:\n1. Project status updates\n2. Blockers and challenges\n3. Next week priorities\n4. Open discussion\n\nAction Items:\n- John: Finalize the design specs\n- Sarah: Schedule user testing sessions\n- Mark: Investigate performance bottlenecks\n- Lisa: Prepare monthly report",
    createdAt: "2023-03-22T15:00:00Z",
    updatedAt: "2023-03-22T16:30:00Z",
    tags: ["meeting", "team"],
    projectId: null,
    isFavorite: false,
    color: "bg-purple-100"
  },
  {
    id: "note5",
    title: "Product Feature Brainstorm",
    content: "User Authentication:\n- Social login options\n- Two-factor authentication\n- Password reset flow\n\nDashboard:\n- Customizable widgets\n- Real-time metrics\n- Export functionality\n\nSettings:\n- Profile management\n- Notification preferences\n- Theme customization",
    createdAt: "2023-03-24T11:45:00Z",
    updatedAt: "2023-03-25T09:20:00Z",
    tags: ["product", "features", "brainstorm"],
    projectId: null,
    isFavorite: true,
    color: "bg-rose-100"
  }
];

const NotesContent = () => {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>(sampleNotes);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [tempNoteTitle, setTempNoteTitle] = useState("");
  const [tempNoteContent, setTempNoteContent] = useState("");
  const [tempNoteColor, setTempNoteColor] = useState("bg-white");
  
  const { projects } = useTaskContext();

  // Available note colors
  const noteColors = [
    { name: "White", value: "bg-white" },
    { name: "Amber", value: "bg-amber-100" },
    { name: "Blue", value: "bg-blue-100" },
    { name: "Green", value: "bg-green-100" },
    { name: "Purple", value: "bg-purple-100" },
    { name: "Rose", value: "bg-rose-100" },
    { name: "Indigo", value: "bg-indigo-100" },
    { name: "Cyan", value: "bg-cyan-100" }
  ];

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
    
    // Try to load notes from localStorage
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      // Save sample notes to localStorage
      localStorage.setItem("notes", JSON.stringify(sampleNotes));
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

  // Create a new note
  const createNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "Untitled Note",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      projectId: null,
      isFavorite: false,
      color: "bg-white"
    };
    
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    
    // Start editing the new note
    setEditingNote(newNote);
    setTempNoteTitle("Untitled Note");
    setTempNoteContent("");
    setTempNoteColor("bg-white");
  };

  // Delete a note
  const deleteNote = (id: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      
      if (editingNote && editingNote.id === id) {
        setEditingNote(null);
      }
      
      toast({
        title: "Note Deleted",
        description: "Your note has been permanently deleted."
      });
    }
  };

  // Toggle favorite status of a note
  const toggleFavorite = (id: string) => {
    const updatedNotes = notes.map(note => 
      note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
    );
    
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    
    // Update editing note if it's the same one
    if (editingNote && editingNote.id === id) {
      setEditingNote({ ...editingNote, isFavorite: !editingNote.isFavorite });
    }
  };

  // Start editing a note
  const startEditing = (note: Note) => {
    setEditingNote(note);
    setTempNoteTitle(note.title);
    setTempNoteContent(note.content);
    setTempNoteColor(note.color);
  };

  // Save edited note
  const saveNote = () => {
    if (!editingNote) return;
    
    const updatedNote: Note = {
      ...editingNote,
      title: tempNoteTitle || "Untitled Note",
      content: tempNoteContent,
      updatedAt: new Date().toISOString(),
      color: tempNoteColor
    };
    
    const updatedNotes = notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    );
    
    setNotes(updatedNotes);
    setEditingNote(updatedNote);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    
    toast({
      title: "Note Saved",
      description: "Your changes have been saved successfully."
    });
  };

  // Add a tag to a note
  const addTag = () => {
    if (!editingNote) return;
    
    const tag = prompt("Enter a tag name:");
    if (!tag) return;
    
    // Don't add duplicate tags
    if (editingNote.tags.includes(tag)) {
      toast({
        title: "Tag already exists",
        description: `The tag "${tag}" is already added to this note.`,
        variant: "destructive"
      });
      return;
    }
    
    const updatedTags = [...editingNote.tags, tag];
    const updatedNote = { ...editingNote, tags: updatedTags };
    
    const updatedNotes = notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    );
    
    setNotes(updatedNotes);
    setEditingNote(updatedNote);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    
    toast({
      title: "Tag Added",
      description: `Added tag "${tag}" to your note.`
    });
  };

  // Remove a tag from a note
  const removeTag = (tag: string) => {
    if (!editingNote) return;
    
    const updatedTags = editingNote.tags.filter(t => t !== tag);
    const updatedNote = { ...editingNote, tags: updatedTags };
    
    const updatedNotes = notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    );
    
    setNotes(updatedNotes);
    setEditingNote(updatedNote);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  // Filter notes based on active tab and search term
  const filteredNotes = () => {
    return notes.filter(note => {
      // Apply tab filter
      if (activeTab === "favorites" && !note.isFavorite) return false;
      
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          note.title.toLowerCase().includes(searchLower) ||
          note.content.toLowerCase().includes(searchLower) ||
          note.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
              <Link to="/chat" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                <MessageSquare className="h-5 w-5" />
                <span>Chat</span>
              </Link>
            </li>
            <li>
              <Link to="/notes" className="flex items-center space-x-3 px-3 py-2 rounded-md bg-indigo-700 text-white font-medium">
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
      <main className="flex-1">
        {/* Top bar */}
        <header className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden mr-2">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-indigo-800">Notes</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex">
              <div className="relative mr-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  type="search" 
                  placeholder="Search notes..." 
                  className="pl-8 w-64 bg-gray-50 border-gray-200" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="text-sm text-gray-600 hidden md:block">{userEmail}</div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </header>

        {/* Notes content */}
        <div className="p-6">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate("/dashboard")} 
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
            
            <div className="flex flex-wrap justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-indigo-800">Notes</h1>
                <p className="text-gray-500">Organize your thoughts and ideas</p>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                <Button 
                  onClick={createNote}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  <PlusCircle className="mr-2 h-5 w-5" /> New Note
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => {
                    // Generate note with AI suggestion - simulated
                    const aiSuggestion: Note = {
                      id: crypto.randomUUID(),
                      title: "AI Generated Meeting Notes",
                      content: "# Meeting Summary\n\n## Key Points\n- Discussed Q2 objectives\n- Reviewed current project status\n- Assigned new tasks\n\n## Action Items\n- [ ] Follow up with clients\n- [ ] Prepare presentation\n- [ ] Schedule next meeting",
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      tags: ["ai", "meeting"],
                      projectId: null,
                      isFavorite: false,
                      color: "bg-indigo-100"
                    };
                    
                    const updatedNotes = [aiSuggestion, ...notes];
                    setNotes(updatedNotes);
                    localStorage.setItem("notes", JSON.stringify(updatedNotes));
                    
                    toast({
                      title: "AI Note Created",
                      description: "Generated a new note with AI suggestions."
                    });
                  }}
                >
                  <BrainCircuit className="h-5 w-5" /> AI Suggestions
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Notes list section */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>My Notes</CardTitle>
                    <span className="text-sm text-gray-500">{notes.length} notes</span>
                  </div>
                </CardHeader>
                <CardContent className="pb-0">
                  <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="all">All Notes</TabsTrigger>
                      <TabsTrigger value="favorites">Favorites</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <div className="relative my-3">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input 
                      type="search" 
                      placeholder="Search notes..." 
                      className="pl-8 bg-gray-50 border-gray-200" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="max-h-[600px] overflow-y-auto pr-2">
                    {filteredNotes().length > 0 ? (
                      <div className="space-y-2">
                        {filteredNotes().map(note => (
                          <div 
                            key={note.id} 
                            className={`p-3 rounded-md cursor-pointer border transition-colors ${
                              editingNote && editingNote.id === note.id 
                                ? 'border-indigo-500 bg-indigo-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            } ${note.color}`}
                            onClick={() => startEditing(note)}
                          >
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium">{note.title}</h3>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(note.id);
                                }}
                              >
                                <Star 
                                  className={`h-4 w-4 ${note.isFavorite ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}`} 
                                />
                              </Button>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{note.content}</p>
                            {note.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {note.tags.map(tag => (
                                  <span 
                                    key={tag} 
                                    className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="text-xs text-gray-400 mt-2">
                              Updated {new Date(note.updatedAt).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-lg font-medium">No notes found</p>
                        <p className="text-sm text-gray-500 mb-4">
                          {searchTerm 
                            ? "Try a different search term" 
                            : activeTab === "favorites" 
                              ? "You haven't marked any notes as favorites yet" 
                              : "Create your first note to get started"
                          }
                        </p>
                        {!searchTerm && (
                          <Button onClick={createNote}>
                            <PlusCircle className="mr-2 h-5 w-5" /> New Note
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Note editor section */}
            <div className="md:col-span-2">
              {editingNote ? (
                <Card className={`${tempNoteColor} h-full flex flex-col`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Input 
                        value={tempNoteTitle} 
                        onChange={(e) => setTempNoteTitle(e.target.value)}
                        className="text-lg font-bold bg-transparent border-0 p-0 h-auto focus-visible:ring-0"
                        placeholder="Note title"
                      />
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => toggleFavorite(editingNote.id)}
                        >
                          <Star 
                            className={`h-5 w-5 ${editingNote.isFavorite ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}`} 
                          />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteNote(editingNote.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-xs text-gray-500">
                        Created: {formatDate(editingNote.createdAt)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Updated: {formatDate(editingNote.updatedAt)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="border-t border-b border-gray-200 py-2 flex flex-wrap gap-2 my-2">
                      <div className="flex items-center">
                        <Button variant="ghost" size="sm" onClick={addTag} className="h-8 px-2">
                          <Tag className="h-4 w-4 mr-2" /> Add Tag
                        </Button>
                      </div>
                      
                      {editingNote.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="flex items-center bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-full"
                        >
                          {tag}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4 ml-1 hover:bg-gray-200 rounded-full" 
                            onClick={() => removeTag(tag)}
                          >
                            <span className="text-xs">×</span>
                          </Button>
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <Textarea 
                        value={tempNoteContent} 
                        onChange={(e) => setTempNoteContent(e.target.value)}
                        className="flex-1 bg-transparent border-0 p-0 focus-visible:ring-0 resize-none min-h-[300px]"
                        placeholder="Write your note here..."
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-gray-200 pt-3 flex justify-between">
                    <div className="flex flex-wrap gap-1">
                      {noteColors.map(color => (
                        <button
                          key={color.value}
                          className={`w-6 h-6 rounded-full ${color.value} border ${
                            tempNoteColor === color.value ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-300'
                          }`}
                          title={color.name}
                          onClick={() => setTempNoteColor(color.value)}
                        />
                      ))}
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Share2 className="h-4 w-4" /> Share
                      </Button>
                      <Button onClick={saveNote}>
                        Save Note
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <Bookmark className="h-16 w-16 text-indigo-200 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">No note selected</h2>
                    <p className="text-gray-500 mb-6">Select a note to view and edit, or create a new one</p>
                    <Button onClick={createNote}>
                      <PlusCircle className="mr-2 h-5 w-5" /> Create a New Note
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Wrap with TaskProvider
const Notes = () => (
  <TaskProvider>
    <NotesContent />
  </TaskProvider>
);

export default Notes;
