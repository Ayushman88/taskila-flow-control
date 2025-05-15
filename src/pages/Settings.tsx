
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Menu, Bell, Shield, Mail, User, Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/layout/Sidebar";

interface Organization {
  id: string;
  name: string;
  plan: string;
}

const Settings = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }

    // Get organization data from localStorage
    const orgId = localStorage.getItem("currentOrganizationId");
    if (!orgId) {
      navigate("/create-organization");
      return;
    }

    // Get organization details
    const orgDetails = JSON.parse(localStorage.getItem("organization") || "{}");
    if (orgDetails) {
      setOrganization(orgDetails);
    }
  }, [navigate, user]);

  const handleLogout = () => {
    signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!organization) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        organizationName={organization.name}
        organizationPlan={organization.plan}
        onLogout={handleLogout}
        isMenuOpen={isMenuOpen}
      />

      {/* Main content */}
      <main className="flex-1">
        {/* Top bar */}
        <header className="bg-white p-4 shadow-sm flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden mr-2">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-800">Settings</h1>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-4">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>

        {/* Settings content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Settings menu */}
            <div className="col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-col">
                    <button
                      className={`flex items-center space-x-2 p-3 ${
                        activeTab === "account" ? "bg-indigo-50 text-indigo-700" : ""
                      }`}
                      onClick={() => setActiveTab("account")}
                    >
                      <User className="h-4 w-4" />
                      <span>Account</span>
                    </button>
                    <button
                      className={`flex items-center space-x-2 p-3 ${
                        activeTab === "notifications" ? "bg-indigo-50 text-indigo-700" : ""
                      }`}
                      onClick={() => setActiveTab("notifications")}
                    >
                      <Bell className="h-4 w-4" />
                      <span>Notifications</span>
                    </button>
                    <button
                      className={`flex items-center space-x-2 p-3 ${
                        activeTab === "organization" ? "bg-indigo-50 text-indigo-700" : ""
                      }`}
                      onClick={() => setActiveTab("organization")}
                    >
                      <Database className="h-4 w-4" />
                      <span>Organization</span>
                    </button>
                    <button
                      className={`flex items-center space-x-2 p-3 ${
                        activeTab === "security" ? "bg-indigo-50 text-indigo-700" : ""
                      }`}
                      onClick={() => setActiveTab("security")}
                    >
                      <Shield className="h-4 w-4" />
                      <span>Security</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Settings content */}
            <div className="col-span-1 md:col-span-3">
              {activeTab === "account" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="Your name" 
                        defaultValue={`${profile?.first_name || ''} ${profile?.last_name || ''}`} 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Email" defaultValue={user?.email || ""} disabled />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="avatar">Profile Picture</Label>
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                          {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-8 w-8 text-indigo-500" />
                          )}
                        </div>
                        <Button variant="outline">Upload New</Button>
                      </div>
                    </div>
                    <Separator />
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>
              )}

              {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Email Notifications</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-tasks" className="flex-1">Task assignments</Label>
                          <Switch 
                            id="email-tasks" 
                            checked={emailNotifications} 
                            onCheckedChange={setEmailNotifications} 
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-comments" className="flex-1">Comments and mentions</Label>
                          <Switch id="email-comments" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-reminders" className="flex-1">Due date reminders</Label>
                          <Switch id="email-reminders" defaultChecked />
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="font-medium">Push Notifications</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-all" className="flex-1">All notifications</Label>
                          <Switch 
                            id="push-all" 
                            checked={pushNotifications}
                            onCheckedChange={setPushNotifications}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-mentions" className="flex-1">Only mentions</Label>
                          <Switch id="push-mentions" />
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <Button>Save Preferences</Button>
                  </CardContent>
                </Card>
              )}

              {activeTab === "organization" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Organization Settings</CardTitle>
                    <CardDescription>Manage your organization</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="org-name">Organization Name</Label>
                      <Input id="org-name" defaultValue={organization?.name} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="org-plan">Subscription Plan</Label>
                      <Select defaultValue={organization?.plan}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Free">Free</SelectItem>
                          <SelectItem value="Pro">Pro</SelectItem>
                          <SelectItem value="Enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="font-medium">Danger Zone</h3>
                      <Button variant="destructive">Delete Organization</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "security" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p>Protect your account with 2FA</p>
                          <p className="text-sm text-gray-500">Not enabled</p>
                        </div>
                        <Button variant="outline">Setup 2FA</Button>
                      </div>
                    </div>
                    <Separator />
                    <Button>Update Password</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
