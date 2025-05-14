
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { TaskProvider, useTaskContext } from "@/context/TaskContext";
import UploadFileModal from "@/components/dashboard/UploadFileModal";
import CreateDocumentModal from "@/components/dashboard/CreateDocumentModal";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "@/integrations/firebase/client";

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

const FilesAndDocsContent = () => {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [currentFolder, setCurrentFolder] = useState<FolderItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [uploadFileOpen, setUploadFileOpen] = useState(false);
  const [createDocumentOpen, setCreateDocumentOpen] = useState(false);
  
  const { projects } = useTaskContext();

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        navigate("/signin");
        return;
      }
      
      const orgId = localStorage.getItem("currentOrganizationId");
      if (!orgId) {
        console.error("No organization ID found");
        return;
      }
      
      // Query files for the current organization
      const filesQuery = query(
        collection(db, "files"),
        where("organizationId", "==", orgId)
      );
      
      const filesSnapshot = await getDocs(filesQuery);
      
      const fetchedFiles: FileItem[] = [];
      
      filesSnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedFiles.push({
          id: doc.id,
          name: data.name,
          type: data.type.split('/')[1] || data.type,
          size: formatFileSize(data.size),
          uploadedBy: data.uploadedBy,
          uploadDate: data.uploadDate,
          projectId: data.projectId || null,
          url: data.base64Data || "#",
          thumbnailUrl: data.thumbnailUrl || undefined
        });
      });
      
      setFiles(fetchedFiles);
      
      // Try to load folders from localStorage for now
      // In a real app, you would fetch these from Firestore too
      const savedFolders = localStorage.getItem("folders");
      if (savedFolders) {
        setFolders(JSON.parse(savedFolders));
      }
      
    } catch (error) {
      console.error("Error fetching files:", error);
      toast({
        title: "Error",
        description: "Failed to load files. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

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
    
    // Fetch files from Firestore
    fetchFiles();
    
  }, [navigate]);

  // Refresh files when modal closes
  useEffect(() => {
    if (!uploadFileOpen && !createDocumentOpen) {
      fetchFiles();
    }
  }, [uploadFileOpen, createDocumentOpen]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

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

  const deleteFile = async (fileId: string) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        // Delete from Firestore
        await deleteDoc(doc(db, "files", fileId));
        
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
          setFiles(files.filter(file => file.id !== fileId));
        }
        
        toast({
          title: "File Deleted",
          description: "The file has been deleted successfully."
        });
        
        // Refresh files list
        fetchFiles();
        
      } catch (error) {
        console.error("Error deleting file:", error);
        toast({
          title: "Error",
          description: "Failed to delete file. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading files...</div>;
  if (!organization) return <div className="p-8">Loading organization data...</div>;

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
