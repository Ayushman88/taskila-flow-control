import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  Menu,
  Save,
  Upload,
  User,
  CreditCard,
  Lock,
  Bell,
  Palette,
  Shield,
  LogOut,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { TaskProvider, useTaskContext } from "@/context/TaskContext";
import { useTheme } from "@/context/ThemeContext";
import CommonSidebar from "@/components/common/Sidebar";

interface Organization {
  name: string;
  teamSize?: string;
  plan: string;
  billingCycle: string;
  nextBillingDate: string;
}

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string | null;
  jobTitle: string;
  timezone: string;
  language: string;
  dateFormat: string;
  timeFormat: string;
}

const SettingsContent = () => {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const { theme, toggleTheme } = useTheme();
  
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [timezone, setTimezone] = useState("");
  const [language, setLanguage] = useState("");
  const [dateFormat, setDateFormat] = useState("");
  const [timeFormat, setTimeFormat] = useState("");
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [teamUpdates, setTeamUpdates] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  
  const [darkMode, setDarkMode] = useState(theme === "dark");
  const [compactView, setCompactView] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const { projects } = useTaskContext();

  useEffect(() => {
    setDarkMode(theme === "dark");
  }, [theme]);

  const handleDarkModeChange = (checked: boolean) => {
    setDarkMode(checked);
    toggleTheme();
  };

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/signin");
      return;
    }
    
    const userObj = JSON.parse(userStr);
    setUser({
      name: userObj.name || userObj.email.split('@')[0],
      email: userObj.email,
      avatarUrl: userObj.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userObj.email}`,
      jobTitle: userObj.jobTitle || "Product Manager",
      timezone: userObj.timezone || "America/New_York",
      language: userObj.language || "English",
      dateFormat: userObj.dateFormat || "MM/DD/YYYY",
      timeFormat: userObj.timeFormat || "12-hour"
    });
    
    setName(userObj.name || userObj.email.split('@')[0]);
    setJobTitle(userObj.jobTitle || "Product Manager");
    setTimezone(userObj.timezone || "America/New_York");
    setLanguage(userObj.language || "English");
    setDateFormat(userObj.dateFormat || "MM/DD/YYYY");
    setTimeFormat(userObj.timeFormat || "12-hour");
    
    const orgStr = localStorage.getItem("organization");
    if (orgStr) {
      setOrganization(JSON.parse(orgStr));
    } else {
      setOrganization({
        name: "My Organization",
        teamSize: "1-10",
        plan: "Free",
        billingCycle: "Monthly",
        nextBillingDate: "N/A"
      });
    }
  }, [navigate]);

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

  const saveProfile = () => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      name,
      jobTitle,
      timezone,
      language,
      dateFormat,
      timeFormat
    };
    
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated."
    });
  };

  const saveNotificationSettings = () => {
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated."
    });
  };

  const saveAppearanceSettings = () => {
    toast({
      title: "Appearance Settings Saved",
      description: "Your visual preferences have been updated."
    });
  };

  const changePassword = () => {
    if (!currentPassword) {
      toast({
        title: "Error",
        description: "Please enter your current password.",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "New password must be at least 8 characters.",
        variant: "destructive"
      });
      return;
    }
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    
    toast({
      title: "Password Updated",
      description: "Your password has been successfully changed."
    });
  };

  const enableTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    
    toast({
      title: twoFactorEnabled ? "Two-Factor Authentication Disabled" : "Two-Factor Authentication Enabled",
      description: twoFactorEnabled ? 
        "Your account is now less secure. We recommend re-enabling this feature." : 
        "Your account is now more secure."
    });
  };

  if (!user || !organization) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex dark:bg-slate-900 dark:text-white">
      <CommonSidebar 
        organizationName={organization.name} 
        organizationPlan={organization.plan} 
        onLogout={handleLogout}
        isMenuOpen={isMenuOpen}
      />

      <main className="flex-1">
        <header className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-10 dark:bg-slate-800">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden mr-2">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-indigo-800 dark:text-indigo-300">Settings</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 hidden md:block dark:text-gray-300">{user.email}</div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </header>

        <div className="p-6 dark:bg-slate-900">
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
                <h1 className="text-3xl font-bold text-indigo-800 dark:text-indigo-300">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your account and preferences</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="md:col-span-1 dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="p-0">
                <div className="md:hidden p-4">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
                      <TabsTrigger value="account" className="flex-1">Account</TabsTrigger>
                      <TabsTrigger value="notifications" className="flex-1">Notifications</TabsTrigger>
                      <TabsTrigger value="appearance" className="flex-1">Appearance</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="hidden md:block">
                  <nav className="py-2">
                    <ul className="space-y-1">
                      <li>
                        <button
                          onClick={() => setActiveTab("profile")}
                          className={`w-full text-left flex items-center space-x-3 px-4 py-2.5 ${
                            activeTab === "profile" ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          <User className="h-5 w-5" />
                          <span>Profile</span>
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => setActiveTab("account")}
                          className={`w-full text-left flex items-center space-x-3 px-4 py-2.5 ${
                            activeTab === "account" ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          <CreditCard className="h-5 w-5" />
                          <span>Account</span>
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => setActiveTab("security")}
                          className={`w-full text-left flex items-center space-x-3 px-4 py-2.5 ${
                            activeTab === "security" ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          <Lock className="h-5 w-5" />
                          <span>Security</span>
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => setActiveTab("notifications")}
                          className={`w-full text-left flex items-center space-x-3 px-4 py-2.5 ${
                            activeTab === "notifications" ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          <Bell className="h-5 w-5" />
                          <span>Notifications</span>
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => setActiveTab("appearance")}
                          className={`w-full text-left flex items-center space-x-3 px-4 py-2.5 ${
                            activeTab === "appearance" ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          <Palette className="h-5 w-5" />
                          <span>Appearance</span>
                        </button>
                      </li>
                    </ul>
                  </nav>
                  <Separator className="dark:bg-slate-700" />
                  <div className="p-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {organization.name}
                    </div>
                    <div className="mt-1 text-sm font-medium">
                      {organization.plan} Plan
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Billing {organization.billingCycle ? organization.billingCycle.toLowerCase() : 'monthly'}, renews {organization.nextBillingDate || 'N/A'}
                    </div>
                    <Button 
                      variant="outline"
                      className="mt-3 w-full text-xs h-8"
                      onClick={() => setActiveTab("account")}
                    >
                      Manage Subscription
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-3">
              {activeTab === "profile" && (
                <Card className="dark:bg-slate-800 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription className="dark:text-gray-400">Update your personal information and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="flex flex-col items-center">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
                          <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm" className="mt-4">
                          <Upload className="h-4 w-4 mr-2" /> Change Photo
                        </Button>
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                              id="name" 
                              value={name} 
                              onChange={(e) => setName(e.target.value)} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input 
                              id="email" 
                              value={user.email} 
                              disabled 
                              className="bg-gray-50" 
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="job-title">Job Title</Label>
                          <Input 
                            id="job-title" 
                            value={jobTitle} 
                            onChange={(e) => setJobTitle(e.target.value)} 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Preferences</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="timezone">Timezone</Label>
                          <select 
                            id="timezone" 
                            value={timezone} 
                            onChange={(e) => setTimezone(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="America/New_York">Eastern Time (ET)</option>
                            <option value="America/Chicago">Central Time (CT)</option>
                            <option value="America/Denver">Mountain Time (MT)</option>
                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                            <option value="Europe/London">GMT</option>
                            <option value="Europe/Paris">Central European Time</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="language">Language</Label>
                          <select 
                            id="language" 
                            value={language} 
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                            <option value="Portuguese">Portuguese</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="date-format">Date Format</Label>
                          <select 
                            id="date-format" 
                            value={dateFormat} 
                            onChange={(e) => setDateFormat(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="time-format">Time Format</Label>
                          <select 
                            id="time-format" 
                            value={timeFormat} 
                            onChange={(e) => setTimeFormat(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="12-hour">12-hour (1:30 PM)</option>
                            <option value="24-hour">24-hour (13:30)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t bg-gray-50 px-6 py-4 dark:bg-slate-900 dark:border-slate-700">
                    <Button onClick={saveProfile} className="bg-indigo-600 hover:bg-indigo-700">
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {activeTab === "account" && (
                <Card className="dark:bg-slate-800 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle>Account & Billing</CardTitle>
                    <CardDescription className="dark:text-gray-400">Manage your account and subscription details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Current Plan</h3>
                      
                      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-lg">{organization.plan} Plan</div>
                            <div className="text-sm text-gray-500">
                              Billed {organization.billingCycle ? organization.billingCycle.toLowerCase() : 'monthly'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-lg">
                              {organization.plan === "Free" ? "Free" : 
                               organization.plan === "Basic" ? "$10/month" : 
                               organization.plan === "Pro" ? "$25/month" : 
                               "$50/month"}
                            </div>
                            <div className="text-sm text-gray-500">Next billing: {organization.nextBillingDate || 'N/A'}</div>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-3">
                          <Button variant="outline" className="text-sm">Change Plan</Button>
                          {organization.plan !== "Free" && (
                            <Button variant="outline" className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                              Cancel Plan
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Payment Method</h3>
                      
                      {organization.plan === "Free" ? (
                        <div className="text-sm text-gray-500">
                          No payment method required for Free plan.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center p-3 border rounded-md">
                            <div className="h-10 w-14 bg-gradient-to-r from-blue-600 to-blue-800 rounded-md flex items-center justify-center text-white font-bold mr-3">
                              VISA
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">•••• •••• •••• 4242</div>
                              <div className="text-sm text-gray-500">Expires 12/2025</div>
                            </div>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </div>
                          
                          <Button variant="outline" size="sm">
                            <CreditCard className="mr-2 h-4 w-4" /> Add New Payment Method
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Billing History</h3>
                      
                      {organization.plan === "Free" ? (
                        <div className="text-sm text-gray-500">
                          No billing history for Free plan.
                        </div>
                      ) : (
                        <div className="border rounded-md overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Amount
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                  <span className="sr-only">View</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  Mar 1, 2023
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  $25.00
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Paid
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button className="text-indigo-600 hover:text-indigo-900">View</button>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  Feb 1, 2023
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  $25.00
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Paid
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button className="text-indigo-600 hover:text-indigo-900">View</button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "security" && (
                <Card className="dark:bg-slate-800 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription className="dark:text-gray-400">Manage your password and account security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Change Password</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input 
                            id="current-password" 
                            type="password" 
                            value={currentPassword} 
                            onChange={(e) => setCurrentPassword(e.target.value)} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input 
                            id="new-password" 
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input 
                            id="confirm-password" 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                          />
                        </div>
                        
                        <Button 
                          onClick={changePassword}
                          className="bg-indigo-600 hover:bg-indigo-700"
                        >
                          Update Password
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-500">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch 
                          checked={twoFactorEnabled} 
                          onCheckedChange={enableTwoFactor} 
                        />
                      </div>
                      
                      {twoFactorEnabled && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-md">
                          <p className="text-sm">
                            Two-factor authentication is enabled. You'll be asked for a verification code when signing in from a new device.
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                          >
                            Manage 2FA Settings
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Sessions</h3>
                      
                      <div className="border rounded-md overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 border-b">
                          <div className="font-medium">Current Session</div>
                          <div className="text-sm text-gray-500">
                            {new Date().toLocaleString()} - This Device
                          </div>
                        </div>
                        <div className="p-6">
                          <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                            Sign Out of All Sessions
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "notifications" && (
                <Card className="dark:bg-slate-800 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription className="dark:text-gray-400">Configure how and when you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-gray-500">
                            Receive notifications via email
                          </p>
                        </div>
                        <Switch 
                          checked={emailNotifications} 
                          onCheckedChange={setEmailNotifications} 
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Task Reminders</h3>
                          <p className="text-sm text-gray-500">
                            Get reminded about upcoming and overdue tasks
                          </p>
                        </div>
                        <Switch 
                          checked={taskReminders} 
                          onCheckedChange={setTaskReminders} 
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Team Updates</h3>
                          <p className="text-sm text-gray-500">
                            Receive notifications when team members make changes
                          </p>
                        </div>
                        <Switch 
                          checked={teamUpdates} 
                          onCheckedChange={setTeamUpdates} 
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Weekly Digest</h3>
                          <p className="text-sm text-gray-500">
                            Get a weekly summary of project activity and upcoming deadlines
                          </p>
                        </div>
                        <Switch 
                          checked={weeklyDigest} 
                          onCheckedChange={setWeeklyDigest} 
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t bg-gray-50 px-6 py-4 dark:bg-slate-900 dark:border-slate-700">
                    <Button 
                      onClick={saveNotificationSettings}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              {activeTab === "appearance" && (
                <Card className="dark:bg-slate-800 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription className="dark:text-gray-400">Customize the look and feel of the application</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Dark Mode</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Switch between light and dark theme
                          </p>
                        </div>
                        <Switch 
                          checked={darkMode} 
                          onCheckedChange={handleDarkModeChange} 
                        />
                      </div>
                      
                      <Separator className="dark:bg-slate-700" />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Compact View</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Reduce spacing for a more compact interface
                          </p>
                        </div>
                        <Switch 
                          checked={compactView} 
                          onCheckedChange={setCompactView} 
                        />
                      </div>
                      
                      <Separator className="dark:bg-slate-700" />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Animations</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enable or disable UI animations
                          </p>
                        </div>
                        <Switch 
                          checked={animationsEnabled} 
                          onCheckedChange={setAnimationsEnabled} 
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t bg-gray-50 px-6 py-4 dark:bg-slate-900 dark:border-slate-700">
                    <Button 
                      onClick={saveAppearanceSettings}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const Settings = () => (
  <TaskProvider>
    <SettingsContent />
  </TaskProvider>
);

export default Settings;
