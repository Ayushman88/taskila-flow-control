
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
import { FileImage, Share2, Copy } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateWhiteboardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const templates = [
  { id: "blank", name: "Blank Canvas" },
  { id: "brainstorm", name: "Brainstorming Session" },
  { id: "wireframe", name: "Website Wireframe" },
  { id: "userflow", name: "User Flow Diagram" },
  { id: "mindmap", name: "Mind Map" },
  { id: "kanban", name: "Kanban Board" },
  { id: "retro", name: "Team Retrospective" },
];

const CreateWhiteboardModal = ({ open, onOpenChange }: CreateWhiteboardModalProps) => {
  const [name, setName] = useState("");
  const [template, setTemplate] = useState("blank");
  const [whiteboardUrl, setWhiteboardUrl] = useState("");
  const [isCreated, setIsCreated] = useState(false);

  const handleCreate = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Whiteboard name is required",
        variant: "destructive",
      });
      return;
    }

    // Generate a fake whiteboard URL
    const url = `https://whiteboard.app/${uuidv4().substring(0, 8)}`;
    setWhiteboardUrl(url);
    setIsCreated(true);
    
    toast({
      title: "Whiteboard Created",
      description: "Your whiteboard is ready!",
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(whiteboardUrl);
    toast({
      title: "Link Copied",
      description: "Whiteboard link copied to clipboard",
    });
  };

  const handleClose = () => {
    setName("");
    setTemplate("blank");
    setWhiteboardUrl("");
    setIsCreated(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-indigo-800 flex items-center">
            <FileImage className="mr-2 h-5 w-5" /> 
            Create Whiteboard
          </DialogTitle>
          <DialogDescription>
            Create a collaborative whiteboard for your team to brainstorm and visualize ideas.
          </DialogDescription>
        </DialogHeader>
        {!isCreated ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Whiteboard Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Project Brainstorm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="template">Template</Label>
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger id="template">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mt-4">
              {templates.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className={`border rounded-md p-3 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors ${
                    template === t.id ? "border-indigo-500 bg-indigo-50" : ""
                  }`}
                  onClick={() => setTemplate(t.id)}
                >
                  <div className="h-16 bg-gray-200 rounded-md mb-2 flex items-center justify-center text-gray-400">
                    <FileImage className="h-5 w-5" />
                  </div>
                  <p className="text-xs text-center font-medium">{t.name}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="rounded-md border bg-gray-50 p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">{name}</h3>
                <span className="text-xs text-gray-500">Just now</span>
              </div>
              
              <div className="h-40 bg-white rounded-md border flex items-center justify-center">
                <p className="text-gray-400">Whiteboard Preview</p>
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500">
                  <FileImage className="h-3.5 w-3.5 mr-1" />
                  <span>{templates.find(t => t.id === template)?.name}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs"
                  onClick={handleCopyLink}
                >
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy Link
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 bg-indigo-50 p-3 rounded-md">
              <Share2 className="h-5 w-5 text-indigo-600" />
              <div className="text-sm">
                <p className="font-medium text-indigo-900">Share this whiteboard</p>
                <p className="text-xs text-indigo-700">
                  Anyone with the link can view and edit this whiteboard
                </p>
              </div>
            </div>
            
            <div className="relative mt-2">
              <Input value={whiteboardUrl} readOnly className="pr-24" />
              <Button
                size="sm"
                className="absolute right-1 top-1 h-7"
                onClick={handleCopyLink}
              >
                Copy Link
              </Button>
            </div>
          </div>
        )}
        <DialogFooter>
          {!isCreated ? (
            <>
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
                onClick={handleCreate}
              >
                Create Whiteboard
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Close
              </Button>
              <Button
                type="button"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                onClick={() => {
                  window.open(whiteboardUrl, "_blank");
                }}
              >
                Open Whiteboard
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWhiteboardModal;
