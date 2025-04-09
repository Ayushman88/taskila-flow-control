
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { TaskProvider, useTaskContext } from "@/context/TaskContext";
import UploadFileModal from "@/components/dashboard/UploadFileModal";
import CreateDocumentModal from "@/components/dashboard/CreateDocumentModal";

// Custom components
import Sidebar from "@/components/files/Sidebar";
import Header from "@/components/files/Header";
import ActionButtons from "@/components/files/ActionButtons";
import FileTabs from "@/components/files/FileTabs";

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
      {/* Sidebar */}
      <Sidebar
        organizationName={organization.name}
        organizationPlan={organization.plan}
        onLogout={handleLogout}
        isOpen={isMenuOpen}
      />

      {/* Main content */}
      <main className="flex-1">
        {/* Top bar */}
        <Header
          userEmail={userEmail}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          toggleMenu={toggleMenu}
          onLogout={handleLogout}
        />

        {/* Files content */}
        <div className="p-6">
          <ActionButtons
            onUploadClick={() => setUploadFileOpen(true)}
            onCreateDocClick={() => setCreateDocumentOpen(true)}
            onCreateFolderClick={createFolder}
          />

          <FileTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            filteredFiles={filteredFiles()}
            currentFolder={currentFolder}
            folders={folders}
            onFolderOpen={openFolder}
            onBackClick={goBack}
            onDeleteFile={deleteFile}
          />
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
