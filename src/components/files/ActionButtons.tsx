
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FilePlus, FileText, FolderPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ActionButtonsProps {
  onUploadClick: () => void;
  onCreateDocClick: () => void;
  onCreateFolderClick: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onUploadClick,
  onCreateDocClick,
  onCreateFolderClick,
}) => {
  const navigate = useNavigate();

  return (
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
          <h1 className="text-3xl font-bold text-indigo-800">
            Files & Documents
          </h1>
          <p className="text-gray-500">
            Store and manage your files and documents
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <Button
            onClick={onUploadClick}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            <FilePlus className="mr-2 h-5 w-5" /> Upload File
          </Button>
          <Button
            onClick={onCreateDocClick}
            variant="outline"
            className="gap-2"
          >
            <FileText className="h-5 w-5" /> Create Document
          </Button>
          <Button
            onClick={onCreateFolderClick}
            variant="outline"
            className="gap-2"
          >
            <FolderPlus className="h-5 w-5" /> New Folder
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;
