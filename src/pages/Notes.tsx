
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
  Plus,
  Trash2,
  Edit,
  ChevronDown,
  ArrowLeft
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
  tags: string[];
  color: string;
  lastEdited: string;
  projectId: string | null;
}

// Sample notes for demonstration
const sampleNotes: Note[] = [
  {
    id: "note1",
    title: "Project Kickoff Meeting Notes",
    content: `# Project Kickoff
- Timeline: 8 weeks
- Team: 4 developers, 1 designer
- Key goals: Improve user engagement by 20%

## Action Items
- Set up repository structure
- Create wireframes for dashboard
- Research API integration options`,
    tags: ["meeting", "project"],
    color: "bg-yellow-100",
    lastEdited: "2023-04-01",
    projectId: null
  },
  {
    id: "note2",
    title: "Feature Ideas",
    content: `# Future Features
1. Enhanced reporting dashboard
2. Mobile app integration
3. Team calendar with reminders
4. AI-powered task recommendations

Need to prioritize these for Q3 roadmap.`,
    tags: ["ideas", "roadmap"],
    color: "bg-blue-100",
    lastEdited: "2023-04-02",
    projectId: null
  },
  {
    id: "note3",
    title: "Client Feedback",
    content: `# Client Meeting Summary
Client would like the following changes:
- Simplified navigation
- Faster loading time for reports
- Additional export formats
- Custom branding options

Priority: High`,
    tags: ["client", "feedback"],
    color: "bg-green-100",
    lastEdited: "2023-04-03",
    projectId: null
  }
];

const noteColors = [
  { name: "Default", value: "bg-white" },
  { name: "Yellow", value: "bg-yellow-100" },
  { name: "Green", value: "bg-green-100" },
  { name: "Blue", value: "bg-blue-100" },
  { name: "Purple", value: "bg-purple-100" },
  { name: "Pink", value: "bg-pink-100" }
];

const NotesContent = () => {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteColor, setNoteColor] = useState("bg-white");
  const [noteTags, setNoteTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  
  const { projects } = useTaskContext();

  // Get all unique tags from notes
  const allTags = [...new Set(notes.flatMap(note => note.tags))];

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
      setNotes(sampleNotes);
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

  // Filter notes based on search term and selected tag
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag ? note.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  // Create a new note
  const createNewNote = () => {
    setActiveNote(null);
    setNoteTitle("New Note");
    setNoteContent("");
    setNoteColor("bg-white");
    setNoteTags([]);
    setEditMode(true);
  };

  // View a note
  const viewNote = (note: Note) => {
    setActiveNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteColor(note.color);
    setNoteTags([...note.tags]);
    setEditMode(false);
  };

  // Edit an existing note
  const editNote = () => {
    if (!activeNote) return;
    setEditMode(true);
  };

  // Save the current note
  const saveNote = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    
    if (activeNote) {
      // Update existing note
      const updatedNotes = notes.map(note => 
        note.id === activeNote.id ? 
          { ...note, title: noteTitle, content: noteContent, tags: noteTags, color: noteColor, lastEdited: currentDate } : 
          note
      );
      setNotes(updatedNotes);
      setActiveNote({ ...activeNote, title: noteTitle, content: noteContent, tags: noteTags, color: noteColor, lastEdited: currentDate });
      
      toast({
        title: "Note Updated",
        description: "Your note has been successfully updated."
      });
    } else {
      // Create new note
      const newNote: Note = {
        id: crypto.randomUUID(),
        title: noteTitle,
        content: noteContent,
        tags: noteTags,
        color: noteColor,
        lastEdited: currentDate,
        projectId: null
      };
      
      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      setActiveNote(newNote);
      
      toast({
        title: "Note Created",
        description: "Your new note has been created successfully."
      });
    }
    
    // Save to localStorage
    localStorage.setItem("notes", JSON.stringify(activeNote ? 
      notes.map(note => note.id === activeNote.id ? 
        { ...note, title: noteTitle, content: noteContent, tags: noteTags, color: noteColor, lastEdited: currentDate } : 
        note) : 
      [{ 
        id: crypto.randomUUID(), 
        title: noteTitle, 
        content: noteContent, 
        tags: noteTags, 
        color: noteColor, 
        lastEdited: currentDate,
        projectId: null
      }, ...notes]
    ));
    
    setEditMode(false);
  };

  // Delete the current note
  const deleteNote = () => {
    if (!activeNote) return;
    
    if (window.confirm("Are you sure you want to delete this note?")) {
      const updatedNotes = notes.filter(note => note.id !== activeNote.id);
      setNotes(updatedNotes);
      setActiveNote(null);
      setEditMode(false);
      
      // Save to localStorage
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      
      toast({
        title: "Note Deleted",
        description: "Your note has been deleted successfully."
      });
    }
  };

  // Add a tag to the current note
  const addTag = () => {
    if (!newTag.trim()) return;
    
    if (!noteTags.includes(newTag)) {
      setNoteTags([...noteTags, newTag]);
    }
    
    setNewTag("");
  };

  // Remove a tag from the current note
  const removeTag = (tagToRemove: string) => {
    setNoteTags(noteTags.filter(tag => tag !== tagToRemove));
  };

  // Filter notes by tag
  const filterByTag = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
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
      <main className="flex-1 flex flex-col h-screen">
        {/* Top bar */}
        <header className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden mr-2">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-indigo-800">Notes</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 hidden md:block">{userEmail}</div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </header>

        {/* Notes content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Notes list sidebar */}
          <div className="w-64 border-r border-gray-200 flex flex-col bg-white">
            <div className="p-4 border-b border-gray-200">
              <Button 
                variant="outline" 
                onClick={() => navigate("/dashboard")} 
                className="mb-4 w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button 
                onClick={createNewNote}
                className="w-full bg-indigo-600 hover:bg-indigo-700 mb-3"
              >
                <Plus className="mr-2 h-4 w-4" /> New Note
              </Button>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  type="search" 
                  placeholder="Search notes..." 
                  className="pl-8 bg-gray-50 border-gray-200" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Tags filter */}
            {allTags.length > 0 && (
              <div className="p-3 border-b border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Filter by tag
                </h3>
                <div className="flex flex-wrap gap-1">
                  {allTags.map(tag => (
                    <Button
                      key={tag}
                      variant="outline"
                      size="sm"
                      className={`text-xs py-0 h-6 ${selectedTag === tag ? 'bg-indigo-100 border-indigo-300' : ''}`}
                      onClick={() => filterByTag(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Notes list */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotes.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {filteredNotes.map(note => (
                    <li key={note.id}>
                      <button
                        onClick={() => viewNote(note)}
                        className={`w-full text-left p-3 hover:bg-gray-50 ${
                          activeNote?.id === note.id ? 'bg-indigo-50' : ''
                        }`}
                      >
                        <h3 className="font-medium text-gray-900 truncate">{note.title}</h3>
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {note.content.substring(0, 60)}...
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex flex-wrap gap-1">
                            {note.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {tag}
                              </span>
                            ))}
                            {note.tags.length > 2 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                +{note.tags.length - 2}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">{note.lastEdited}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No notes found</p>
                  <Button
                    onClick={createNewNote}
                    variant="link"
                    className="mt-2 text-indigo-600"
                  >
                    Create your first note
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Note editor/viewer */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeNote || editMode ? (
              <>
                {/* Note header */}
                <div className={`p-4 border-b border-gray-200 flex justify-between items-center ${noteColor}`}>
                  <div className="flex-1">
                    {editMode ? (
                      <Input
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        className="font-bold text-lg border-0 bg-transparent focus-visible:ring-0 px-0 h-auto"
                        placeholder="Note title"
                      />
                    ) : (
                      <h2 className="text-xl font-bold">{noteTitle}</h2>
                    )}
                    <div className="text-sm text-gray-500">
                      {activeNote && `Last edited: ${activeNote.lastEdited}`}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {editMode ? (
                      <>
                        <div className="relative">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                            className="gap-1"
                          >
                            Color <ChevronDown className="h-4 w-4" />
                          </Button>
                          {isColorPickerOpen && (
                            <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg p-2 z-10 border border-gray-200">
                              {noteColors.map(color => (
                                <button
                                  key={color.value}
                                  className={`w-full text-left px-3 py-2 rounded-md ${color.value} hover:bg-gray-100`}
                                  onClick={() => {
                                    setNoteColor(color.value);
                                    setIsColorPickerOpen(false);
                                  }}
                                >
                                  {color.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={saveNote}
                          size="sm"
                          className="bg-indigo-600 hover:bg-indigo-700"
                        >
                          Save
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={editNote}
                          className="gap-1"
                        >
                          <Edit className="h-4 w-4" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={deleteNote}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Note content */}
                <div className={`flex-1 overflow-y-auto p-4 ${noteColor}`}>
                  {editMode ? (
                    <Textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className="min-h-[500px] border-0 bg-transparent focus-visible:ring-0 p-0 resize-none"
                      placeholder="Write your note here... (Markdown is supported)"
                    />
                  ) : (
                    <div className="prose max-w-none">
                      {noteContent.split('\n').map((line, i) => (
                        <div key={i} className="mb-2">
                          {line.startsWith('# ') ? (
                            <h1 className="text-2xl font-bold">{line.substring(2)}</h1>
                          ) : line.startsWith('## ') ? (
                            <h2 className="text-xl font-bold">{line.substring(3)}</h2>
                          ) : line.startsWith('### ') ? (
                            <h3 className="text-lg font-bold">{line.substring(4)}</h3>
                          ) : line.startsWith('- ') ? (
                            <div className="flex">
                              <span className="mr-2">•</span>
                              <span>{line.substring(2)}</span>
                            </div>
                          ) : line.match(/^\d+\.\s/) ? (
                            <div className="flex">
                              <span className="mr-2">{line.match(/^\d+/)?.[0]}.</span>
                              <span>{line.replace(/^\d+\.\s/, '')}</span>
                            </div>
                          ) : (
                            <p>{line}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className={`border-t border-gray-200 p-4 ${noteColor}`}>
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-sm font-medium text-gray-700">Tags:</span>
                    {noteTags.map(tag => (
                      <div key={tag} className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                        {tag}
                        {editMode && (
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-gray-500 hover:text-gray-700"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    ))}
                    
                    {editMode && (
                      <div className="flex">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add tag"
                          className="h-8 w-32 text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addTag();
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={addTag}
                          className="h-8 ml-1"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-8">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">No note selected</h3>
                  <p className="text-gray-500 mb-4">Select a note from the sidebar or create a new one</p>
                  <Button
                    onClick={createNewNote}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus className="mr-2 h-5 w-5" /> Create New Note
                  </Button>
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
const Notes = () => (
  <TaskProvider>
    <NotesContent />
  </TaskProvider>
);

export default Notes;
