
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Folder, FolderOpen } from "lucide-react";

interface FolderItem {
  id: string;
  name: string;
  createdBy: string;
  createdDate: string;
  files: FileItem[];
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

interface FolderNavigationProps {
  currentFolder: FolderItem | null;
  folders: FolderItem[];
  onFolderOpen: (folder: FolderItem) => void;
  onBackClick: () => void;
}

const FolderNavigation: React.FC<FolderNavigationProps> = ({
  currentFolder,
  folders,
  onFolderOpen,
  onBackClick,
}) => {
  return (
    <>
      {/* Current path / breadcrumb */}
      <div className="flex items-center py-2 mb-4 text-sm">
        <span className="text-gray-500 flex items-center">
          <Folder className="h-4 w-4 mr-1" />
          {currentFolder ? (
            <>
              <button
                onClick={onBackClick}
                className="hover:text-indigo-600 hover:underline transition-colors"
              >
                Files
              </button>
              <span className="mx-2">/</span>
              <span className="font-medium text-gray-700">
                {currentFolder.name}
              </span>
            </>
          ) : (
            <span className="font-medium text-gray-700">Files</span>
          )}
        </span>
      </div>

      {/* Folders grid */}
      {!currentFolder && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {folders.map((folder) => (
            <Card
              key={folder.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onFolderOpen(folder)}
            >
              <CardContent className="p-4 flex items-center">
                <FolderOpen className="h-10 w-10 text-amber-500 mr-4" />
                <div>
                  <h3 className="font-medium">{folder.name}</h3>
                  <p className="text-sm text-gray-500">
                    {folder.files.length} files
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default FolderNavigation;
