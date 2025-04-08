
import { useState } from "react";
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
import { Users, UserPlus, Mail, X, CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InviteTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type InvitedUser = {
  email: string;
  role: string;
  status: "pending" | "sent";
};

const InviteTeamModal = ({ open, onOpenChange }: InviteTeamModalProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>([]);

  const handleAddUser = () => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicates
    if (invitedUsers.some(user => user.email === email)) {
      toast({
        title: "Duplicate Email",
        description: "This email has already been added",
        variant: "destructive",
      });
      return;
    }

    setInvitedUsers([...invitedUsers, { email, role, status: "pending" }]);
    setEmail("");
  };

  const handleRemoveUser = (email: string) => {
    setInvitedUsers(invitedUsers.filter(user => user.email !== email));
  };

  const handleSendInvites = () => {
    if (invitedUsers.length === 0) {
      toast({
        title: "No Invites",
        description: "Please add at least one email to send invites",
        variant: "destructive",
      });
      return;
    }

    // Simulate sending invites
    setInvitedUsers(invitedUsers.map(user => ({ ...user, status: "sent" })));
    
    toast({
      title: "Invites Sent",
      description: `Successfully sent invites to ${invitedUsers.length} user(s)`,
    });

    setTimeout(() => {
      onOpenChange(false);
      setInvitedUsers([]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && email) {
      e.preventDefault();
      handleAddUser();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-indigo-800 flex items-center">
            <Users className="mr-2 h-5 w-5" /> 
            Invite Team Members
          </DialogTitle>
          <DialogDescription>
            Invite people to collaborate on your projects and tasks.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex mt-1">
                <div className="relative flex-1">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="team@example.com"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
            </div>
            <div className="w-32">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role" className="mt-1">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                type="button" 
                size="icon"
                className="mb-[1px]"
                onClick={handleAddUser}
                disabled={!email}
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {invitedUsers.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Invited Users</h4>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {invitedUsers.map((user) => (
                  <div key={user.email} className="flex items-center justify-between p-2 border rounded-md bg-gray-50">
                    <div className="flex items-center">
                      <div className="mr-2 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.email}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {user.status === "sent" ? (
                        <span className="text-green-500 text-xs flex items-center mr-2">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Sent
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRemoveUser(user.email)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
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
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            onClick={handleSendInvites}
          >
            Send Invites
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteTeamModal;
