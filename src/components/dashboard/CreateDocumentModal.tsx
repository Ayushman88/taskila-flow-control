
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, FileText, File, Table } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface CreateDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type DocTemplate = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
};

const documentTemplates: DocTemplate[] = [
  { 
    id: "blank", 
    name: "Blank Document", 
    icon: <FileText className="h-6 w-6 text-blue-500" />,
    description: "Start from scratch with a blank document"
  },
  { 
    id: "notes", 
    name: "Meeting Notes", 
    icon: <BookOpen className="h-6 w-6 text-green-500" />,
    description: "Template for taking meeting notes with pre-formatted sections"
  },
  { 
    id: "report", 
    name: "Project Report", 
    icon: <File className="h-6 w-6 text-purple-500" />,
    description: "Standardized project report format with sections and charts"
  },
  { 
    id: "table", 
    name: "Data Table", 
    icon: <Table className="h-6 w-6 text-amber-500" />,
    description: "Create a structured table for organizing data"
  },
];

const CreateDocumentModal = ({ open, onOpenChange }: CreateDocumentModalProps) => {
  const [docName, setDocName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("blank");
  const [docType, setDocType] = useState("doc");

  const handleCreateDocument = () => {
    if (!docName.trim()) {
      toast({
        title: "Error",
        description: "Document name is required",
        variant: "destructive",
      });
      return;
    }

    // In a real application, this would create a document in the database
    // and redirect to the document editor
    const docId = uuidv4();
    
    toast({
      title: "Document Created",
      description: `"${docName}" has been created successfully.`,
    });
    
    // Reset form
    setDocName("");
    setSelectedTemplate("blank");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-indigo-800 flex items-center">
            <FileText className="mr-2 h-5 w-5" /> 
            Create Document
          </DialogTitle>
          <DialogDescription>
            Create a new document to add to your project.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="docName">Document Name</Label>
            <Input
              id="docName"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="Untitled Document"
            />
          </div>
          
          <Tabs defaultValue="doc" value={docType} onValueChange={setDocType}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="doc">Document</TabsTrigger>
              <TabsTrigger value="spreadsheet">Spreadsheet</TabsTrigger>
              <TabsTrigger value="presentation">Presentation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="doc" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {documentTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`border rounded-md p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedTemplate === template.id ? "border-indigo-500 bg-indigo-50" : ""
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-center space-x-3">
                      {template.icon}
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-xs text-gray-500">{template.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="spreadsheet" className="h-[200px] flex items-center justify-center bg-gray-50 rounded-md">
              <div className="text-center">
                <Table className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <h3 className="font-medium">Spreadsheet Templates</h3>
                <p className="text-sm text-gray-500">Coming soon</p>
              </div>
            </TabsContent>
            
            <TabsContent value="presentation" className="h-[200px] flex items-center justify-center bg-gray-50 rounded-md">
              <div className="text-center">
                <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <h3 className="font-medium">Presentation Templates</h3>
                <p className="text-sm text-gray-500">Coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            onClick={handleCreateDocument}
          >
            Create Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDocumentModal;
