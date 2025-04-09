
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  FilePlus,
  FolderPlus,
  FolderOpen,
  File,
  FileImage,
  FileX,
  Folder,
  Share2,
  Download,
  Clock,
  ArrowLeft
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { TaskProvider, useTaskContext } from "@/context/TaskContext";
import UploadFileModal from "@/components/dashboard/UploadFileModal";
import CreateDocumentModal from "@/components/dashboard/CreateDocumentModal";

interface Organization {
  name: string;
  teamSize: string;
  plan: string;
}

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  projectId: string | null;
  url: string;
  thumbnailUrl?: string;
}

interface FolderItem {
  id: string;
  name: string;
  createdBy: string;
  createdDate: string;
  files: FileItem[];
}

// Sample files for demonstration
const sampleFiles: FileItem[] = [
  {
    id: "file1",
    name: "Project Requirements.pdf",
    type: "pdf",
    size: "2.4 MB",
    uploadedBy: "admin@example.com",
    uploadDate: "2023-04-01",
    projectId: null,
    url: "#"
  },
  {
    id: "file2",
    name: "Meeting Notes.docx",
    type: "docx",
    size: "1.2 MB",
    uploadedBy: "admin@example.com",
    uploadDate: "2023-04-02",
    projectId: null,
    url: "#"
  },
  {
    id: "file3",
    name: "Dashboard UI Mockup.png",
    type: "png",
    size: "4.7 MB",
    uploadedBy: "admin@example.com",
    uploadDate: "2023-04-03",
    projectId: null,
    url: "#",
    thumbnailUrl: "https://via.placeholder.com/300x200"
  },
  {
    id: "file4",
    name: "Product Roadmap.xlsx",
    type: "xlsx",
    size: "3.1 MB",
    uploadedBy: "admin@example.com",
    uploadDate: "2023-04-04",
    projectId: null,
    url: "#"
  },
  {
    id: "file5",
    name: "Logo Design.svg",
    type: "svg",
    size: "0.8 MB",
    uploadedBy: "admin@example.com",
    uploadDate: "2023-04-05",
    projectId: null,
    url: "#"
  }
];

// Sample folders for demonstration
const sampleFolders: FolderItem[] = [
  {
    id: "folder1",
    name: "Marketing Materials",
    createdBy: "admin@example.com",
    createdDate: "2023-03-15",
    files: sampleFiles.slice(0, 2)
  },
  {
    id: "folder2",
    name: "Design Assets",
    createdBy: "admin@example.com",
    createdDate: "2023-03-20",
    files: sampleFiles.slice(2, 4)
  },
  {
    id: "folder3",
    name: "Documentation",
    createdBy: "admin@example.com",
    createdDate: "2023-03-25",
    files: sampleFiles.slice(4)
  }
];

const FilesAndDocsContent = () => {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [files, setFiles] = useState<FileItem[]>(sampleFiles);
  const [folders, setFolders] = useState<FolderItem[]>(sampleFolders);
  const [currentFolder, setCurrentFolder] = useState<FolderItem | null>(null);
  
  // Modal states
  const [uploadFileOpen, setUploadFileOpen] = useState(false);
  const [createDocumentOpen, setCreateDocumentOpen] = useState(false);
  
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
    
    // Try to load files and folders from localStorage
    const savedFiles = localStorage.getItem("files");
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles));
    } else {
      // Save sample files to localStorage
      localStorage.setItem("files", JSON.stringify(sampleFiles));
    }
    
    const savedFolders = localStorage.getItem("folders");
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    } else {
      // Save sample folders to localStorage
      localStorage.setItem("folders", JSON.stringify(sampleFolders));
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

  const createFolder = () => {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
      const newFolder: FolderItem = {
        id: crypto.randomUUID(),
        name: folderName,
        createdBy: userEmail,
        createdDate: new Date().toISOString().split('T')[0],
        files: []
      };
      
      const updatedFolders = [...folders, newFolder];
      setFolders(updatedFolders);
      localStorage.setItem("folders", JSON.stringify(updatedFolders));
      
      toast({
        title: "Folder Created",
        description: `Folder "${folderName}" has been created successfully.`
      });
    }
  };

  const openFolder = (folder: FolderItem) => {
    setCurrentFolder(folder);
  };

  const goBack = () => {
    setCurrentFolder(null);
  };

  // Filter files based on search term and active tab
  const filteredFiles = () => {
    let result = currentFolder ? currentFolder.files : files;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(file => 
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply tab filter
    if (activeTab !== "all") {
      result = result.filter(file => {
        if (activeTab === "documents") {
          return ["pdf", "docx", "txt", "xlsx"].includes(file.type);
        } else if (activeTab === "images") {
          return ["png", "jpg", "jpeg", "svg", "gif"].includes(file.type);
        } else if (activeTab === "recent") {
          // Filter files uploaded in the last 7 days
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return new Date(file.uploadDate) >= sevenDaysAgo;
        }
        return true;
      });
    }
    
    return result;
  };

  // Get icon for file based on type
  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-10 w-10 text-red-500" />;
      case "docx":
        return <FileText className="h-10 w-10 text-blue-500" />;
      case "xlsx":
        return <FileText className="h-10 w-10 text-green-500" />;
      case "png":
      case "jpg":
      case "jpeg":
      case "svg":
      case "gif":
        return <FileImage className="h-10 w-10 text-purple-500" />;
      default:
        return <File className="h-10 w-10 text-gray-500" />;
    }
  };

  const deleteFile = (fileId: string) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      if (currentFolder) {
        // Delete from current folder
        const updatedFolder = {
          ...currentFolder,
          files: currentFolder.files.filter(file => file.id !== fileId)
        };
        
        const updatedFolders = folders.map(folder => 
          folder.id === currentFolder.id ? updatedFolder : folder
        );
        
        setFolders(updatedFolders);
        setCurrentFolder(updatedFolder);
        localStorage.setItem("folders", JSON.stringify(updatedFolders));
      } else {
        // Delete from main files list
        const updatedFiles = files.filter(file => file.id !== fileId);
        setFiles(updatedFiles);
        localStorage.setItem("files", JSON.stringify(updatedFiles));
      }
      
      toast({
        title: "File Deleted",
        description: "The file has been deleted successfully."
      });
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
              <Link to="/files" className="flex items-center space-x-3 px-3 py-2 rounded-md bg-indigo-700 text-white font-medium">
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
      <main className="flex-1">
        {/* Top bar */}
        <header className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden mr-2">
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
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </header>

        {/* Files content */}
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
                <h1 className="text-3xl font-bold text-indigo-800">Files & Documents</h1>
                <p className="text-gray-500">Store and manage your files and documents</p>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                <Button 
                  onClick={() => setUploadFileOpen(true)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  <FilePlus className="mr-2 h-5 w-5" /> Upload File
                </Button>
                <Button 
                  onClick={() => setCreateDocumentOpen(true)}
                  variant="outline" 
                  className="gap-2"
                >
                  <FileText className="h-5 w-5" /> Create Document
                </Button>
                <Button 
                  onClick={createFolder}
                  variant="outline" 
                  className="gap-2"
                >
                  <FolderPlus className="h-5 w-5" /> New Folder
                </Button>
              </div>
            </div>
          </div>

          {/* Current path / breadcrumb */}
          <div className="flex items-center py-2 mb-4 text-sm">
            <span className="text-gray-500 flex items-center">
              <Folder className="h-4 w-4 mr-1" /> 
              {currentFolder ? (
                <>
                  <button 
                    onClick={goBack} 
                    className="hover:text-indigo-600 hover:underline transition-colors"
                  >
                    Files
                  </button> 
                  <span className="mx-2">/</span> 
                  <span className="font-medium text-gray-700">{currentFolder.name}</span>
                </>
              ) : (
                <span className="font-medium text-gray-700">Files</span>
              )}
            </span>
          </div>

          {/* Tabs for different file types */}
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="all">All Files</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="space-y-4">
              {!currentFolder && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {folders.map(folder => (
                    <Card 
                      key={folder.id} 
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => openFolder(folder)}
                    >
                      <CardContent className="p-4 flex items-center">
                        <FolderOpen className="h-10 w-10 text-amber-500 mr-4" />
                        <div>
                          <h3 className="font-medium">{folder.name}</h3>
                          <p className="text-sm text-gray-500">{folder.files.length} files</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {/* Files grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFiles().length > 0 ? (
                  filteredFiles().map(file => (
                    <Card key={file.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-4 flex items-center">
                        {getFileIcon(file.type)}
                        <div className="ml-4">
                          <h3 className="font-medium">{file.name}</h3>
                          <p className="text-sm text-gray-500">{file.size}</p>
                        </div>
                      </div>
                      {file.thumbnailUrl && (
                        <div className="px-4 pb-3">
                          <img src={file.thumbnailUrl} alt="Thumbnail" className="w-full rounded-md" />
                        </div>
                      )}
                      <CardFooter className="flex justify-between border-t p-3 bg-gray-50">
                        <div className="text-xs text-gray-500">
                          Uploaded {new Date(file.uploadDate).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Download className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Share2 className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7" 
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteFile(file.id);
                            }}
                          >
                            <FileX className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700">No files found</h3>
                    <p className="text-gray-500 mb-6">Upload files or create a document to get started</p>
                    <div className="flex justify-center space-x-4">
                      <Button 
                        onClick={() => setUploadFileOpen(true)}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                      >
                        <FilePlus className="mr-2 h-5 w-5" /> Upload File
                      </Button>
                      <Button 
                        onClick={() => setCreateDocumentOpen(true)}
                        variant="outline"
                      >
                        <FileText className="mr-2 h-5 w-5" /> Create Document
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Modals */}
      <UploadFileModal 
        open={uploadFileOpen} 
        onOpenChange={setUploadFileOpen} 
      />
      
      <CreateDocumentModal 
        open={createDocumentOpen} 
        onOpenChange={setCreateDocumentOpen} 
      />
    </div>
  );
};

// Wrap with TaskProvider
const FilesAndDocs = () => (
  <TaskProvider>
    <FilesAndDocsContent />
  </TaskProvider>
);

export default FilesAndDocs;
