
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import {
  FileText,
  FileImage,
  File,
  Share2,
  Download,
  FileX,
} from "lucide-react";

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

interface FileListProps {
  files: FileItem[];
  onDelete: (fileId: string) => void;
}

const FileList: React.FC<FileListProps> = ({ files, onDelete }) => {
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

  if (files.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700">No files found</h3>
        <p className="text-gray-500 mb-6">
          Upload files or create a document to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => (
        <Card
          key={file.id}
          className="overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="p-4 flex items-center">
            {getFileIcon(file.type)}
            <div className="ml-4">
              <h3 className="font-medium">{file.name}</h3>
              <p className="text-sm text-gray-500">{file.size}</p>
            </div>
          </div>
          {file.thumbnailUrl && (
            <div className="px-4 pb-3">
              <img
                src={file.thumbnailUrl}
                alt="Thumbnail"
                className="w-full rounded-md"
              />
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
                  onDelete(file.id);
                }}
              >
                <FileX className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default FileList;
