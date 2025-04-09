
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileList from "./FileList";
import FolderNavigation from "./FolderNavigation";

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

interface FileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filteredFiles: FileItem[];
  currentFolder: FolderItem | null;
  folders: FolderItem[];
  onFolderOpen: (folder: FolderItem) => void;
  onBackClick: () => void;
  onDeleteFile: (fileId: string) => void;
}

const FileTabs: React.FC<FileTabsProps> = ({
  activeTab,
  setActiveTab,
  filteredFiles,
  currentFolder,
  folders,
  onFolderOpen,
  onBackClick,
  onDeleteFile,
}) => {
  return (
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
        <FolderNavigation
          currentFolder={currentFolder}
          folders={folders}
          onFolderOpen={onFolderOpen}
          onBackClick={onBackClick}
        />

        <FileList files={filteredFiles} onDelete={onDeleteFile} />
      </TabsContent>
    </Tabs>
  );
};

export default FileTabs;
