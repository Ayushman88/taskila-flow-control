
import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { FileUp, X, File, FileText, FileImage, FileArchive } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface UploadFileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type UploadedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
};

const UploadFileModal = ({ open, onOpenChange }: UploadFileModalProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (type: string) => {
    if (type.includes("image")) return <FileImage className="h-5 w-5 text-blue-500" />;
    if (type.includes("pdf") || type.includes("document")) 
      return <FileText className="h-5 w-5 text-red-500" />;
    if (type.includes("zip") || type.includes("compressed")) 
      return <FileArchive className="h-5 w-5 text-amber-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: uuidv4(),
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0
      }));
      setFiles([...files, ...newFiles]);
      
      // Simulate upload progress
      newFiles.forEach(file => {
        simulateFileUpload(file.id);
      });
    }
  };

  const simulateFileUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // When all files are complete, show success toast
        if (files.every(f => f.id === fileId || f.progress === 100) && 
            setFiles(prev => prev.map(f => f.id === fileId ? {...f, progress: 100} : f))) {
          toast({
            title: "Upload Complete",
            description: "Your files have been uploaded successfully",
          });
        }
      }
      
      setFiles(prev => prev.map(f => 
        f.id === fileId ? {...f, progress} : f
      ));
    }, 300);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).map(file => ({
        id: uuidv4(),
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0
      }));
      setFiles([...files, ...newFiles]);
      
      // Simulate upload progress
      newFiles.forEach(file => {
        simulateFileUpload(file.id);
      });
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleClose = () => {
    setFiles([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-indigo-800">Upload Files</DialogTitle>
          <DialogDescription>
            Upload files to your project. Drag and drop files or click to browse.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <FileUp className="h-10 w-10 text-indigo-500 mx-auto mb-2" />
            <h3 className="text-lg font-medium">
              {isDragging ? "Drop files here" : "Drag and drop files here"}
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-3">
              or
            </p>
            <input
              type="file"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleBrowseClick}
              className="mt-2"
            >
              Browse Files
            </Button>
          </div>

          {files.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Uploaded Files</h4>
              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center p-2 border rounded-md bg-gray-50">
                    <div className="mr-2">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                      </div>
                      <Progress value={file.progress} className="h-1 mt-1" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(file.id)}
                      className="ml-2 text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            disabled={files.length === 0 || files.some(f => f.progress < 100)}
            onClick={handleClose}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadFileModal;
