
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart2, 
  List, 
  LogOut, 
  PlusCircle, 
  Settings as SettingsIcon, 
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Search,
  KanbanSquare,
  GanttChartSquare,
  BookOpen,
  Menu,
  Clock,
  ArrowLeft,
  User,
  Building,
  Lock,
  Bell,
  CreditCard,
  LifeBuoy,
  Globe,
  FileUp,
  Gift,
  Heart,
  Save,
  Check,
  X,
  Mail,
  Phone,
  Shield,
  Briefcase,
  Upload
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { TaskProvider } from "@/context/TaskContext";

interface Organization {
  name: string;
  teamSize: string;
  plan: string;
  website?: string;
  industry?: string;
  description?: string;
  logo?: string;
}

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
  phone?: string;
  timeZone?: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  taskAssigned: boolean;
  taskUpdated: boolean;
  projectDeadlines: boolean;
  comments: boolean;
  dailyDigest: boolean;
  weeklyDigest: boolean;
}

const SettingsContent = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    taskAssigned: true,
    taskUpdated: true,
    projectDeadlines: true,
    comments: true,
    dailyDigest: false,
    weeklyDigest: true
  });
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    timeZone: "UTC",
    avatar: ""
  });
  
  const [organizationForm, setOrganizationForm] = useState({
    name: "",
    website: "",
    industry: "",
    description: "",
    logo: ""
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/signin");
      return;
    }
    
    const user = JSON.parse(userStr);
    
    // Set user profile
    const userProfile: UserProfile = {
      name: user.name || "Admin User",
      email: user.email,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}`,
      role: "Administrator",
      phone: user.phone || "",
      timeZone: user.timeZone || "UTC"
    };
    
    setUserProfile(userProfile);
    
    // Set profile form initial values
    setProfileForm({
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone || "",
      timeZone: userProfile.timeZone || "UTC",
      avatar: userProfile.avatar
    });
    
    // Get organization data
    const orgStr = localStorage.getItem("organization");
    if (orgStr) {
      const org = JSON.parse(orgStr);
      setOrganization(org);
      
      // Set organization form initial values
      setOrganizationForm({
        name: org.name,
        website: org.website || "",
        industry: org.industry || "",
        description: org.description || "",
        logo: org.logo || ""
      });
    }
    
    // Get notification settings
    const notifStr = localStorage.getItem("notificationSettings");
    if (notifStr) {
      setNotificationSettings(JSON.parse(notifStr));
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

  // Handle profile form submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userProfile) return;
    
    const updatedProfile = {
      ...userProfile,
      name: profileForm.name,
      phone: profileForm.phone,
      timeZone: profileForm.timeZone
    };
    
    // Update user in localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const updatedUser = {
        ...user,
        name: profileForm.name,
        phone: profileForm.phone,
        timeZone: profileForm.timeZone
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
    
    setUserProfile(updatedProfile);
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully."
    });
  };

  // Handle organization form submission
  const handleOrganizationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!organization) return;
    
    const updatedOrg = {
      ...organization,
      name: organizationForm.name,
      website: organizationForm.website,
      industry: organizationForm.industry,
      description: organizationForm.description,
      logo: organizationForm.logo
    };
    
    setOrganization(updatedOrg);
    localStorage.setItem("organization", JSON.stringify(updatedOrg));
    
    toast({
      title: "Organization Updated",
      description: "Your organization information has been updated successfully."
    });
  };

  // Handle password form submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive"
      });
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would call an API to update the password
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully."
    });
    
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  // Handle notification settings change
  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    const updatedSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(updatedSettings);
    localStorage.setItem("notificationSettings", JSON.stringify(updatedSettings));
    
    toast({
      title: "Notification Settings Updated",
      description: `You've ${value ? 'enabled' : 'disabled'} ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} notifications.`
    });
  };

  // Plans data for subscription tab
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "Up to 5 team members",
        "3 projects",
        "Basic task management",
        "1GB storage"
      ],
      current: organization?.plan === "Free"
    },
    {
      name: "Pro",
      price: "$12",
      period: "per user/month",
      features: [
        "Unlimited team members",
        "Unlimited projects",
        "Advanced task management",
        "10GB storage",
        "Time tracking",
        "Reporting and analytics"
      ],
      current: organization?.plan === "Pro"
    },
    {
      name: "Enterprise",
      price: "$29",
      period: "per user/month",
      features: [
        "Everything in Pro",
        "Unlimited storage",
        "Advanced security",
        "Custom integrations",
        "Dedicated support",
        "SSO and SAML"
      ],
      current: organization?.plan === "Enterprise"
    }
  ];

  if (!userProfile || !organization) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - hidden on mobile unless toggled */}
      <aside className={`${isMenuOpen ? 'block' : 'hidden'} md:block w-64 bg-gradient-to-b from-indigo-800 to-purple-900 text-white fixed md:static h-screen z-50 transition-all duration-300 ease-in-out`}>
        <div className="p-4 border-b border-indigo-700">
          <h2 className="text-xl font-bold">{organization.name}</h2>
          <p className="text-sm text-indigo-200">{organization.plan} Plan</p>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <Link to="/dashboard" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                <BarChart2 className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/kanban" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                <KanbanSquare className="h-5 w-5" />
                <span>Kanban Board</span>
              </Link>
            </li>
            <li>
              <Link to="/gantt" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                <GanttChartSquare className="h-5 w-5" />
                <span>Gantt Chart</span>
              </Link>
            </li>
            <li>
              <Link to="/tasks" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                <List className="h-5 w-5" />
                <span>Task List</span>
              </Link>
            </li>
            <li>
              <Link to="/time-tracking" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                <Clock className="h-5 w-5" />
                <span>Time Tracking</span>
              </Link>
            </li>
            <li>
              <Link to="/files" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                <FileText className="h-5 w-5" />
                <span>Files & Docs</span>
              </Link>
            </li>
            <li>
              <Link to="/chat" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                <MessageSquare className="h-5 w-5" />
                <span>Chat</span>
              </Link>
            </li>
            <li>
              <Link to="/notes" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                <BookOpen className="h-5 w-5" />
                <span>Notes</span>
              </Link>
            </li>
            <li>
              <Link to="/team" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                <Users className="h-5 w-5" />
                <span>Team</span>
              </Link>
            </li>
            <li>
              <Link to="/settings" className="flex items-center space-x-3 px-3 py-2 rounded-md bg-indigo-700 text-white font-medium">
                <SettingsIcon className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        {/* Top bar */}
        <header className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden mr-2">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-indigo-800">Settings</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 hidden md:block">{userProfile.email}</div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </header>

        {/* Settings content */}
        <div className="p-6">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate("/dashboard")} 
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
            
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-indigo-800">Settings</h1>
              <p className="text-gray-500">Manage your account and organization settings</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Settings navigation */}
            <div className="md:w-64 flex-shrink-0">
              <Card>
                <CardContent className="p-0">
                  <nav className="space-y-1 p-3">
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start ${activeTab === "profile" ? "bg-indigo-50 text-indigo-600" : ""}`}
                      onClick={() => setActiveTab("profile")}
                    >
                      <User className="h-5 w-5 mr-3" />
                      <span>Profile</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start ${activeTab === "organization" ? "bg-indigo-50 text-indigo-600" : ""}`}
                      onClick={() => setActiveTab("organization")}
                    >
                      <Building className="h-5 w-5 mr-3" />
                      <span>Organization</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start ${activeTab === "password" ? "bg-indigo-50 text-indigo-600" : ""}`}
                      onClick={() => setActiveTab("password")}
                    >
                      <Lock className="h-5 w-5 mr-3" />
                      <span>Password</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start ${activeTab === "notifications" ? "bg-indigo-50 text-indigo-600" : ""}`}
                      onClick={() => setActiveTab("notifications")}
                    >
                      <Bell className="h-5 w-5 mr-3" />
                      <span>Notifications</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start ${activeTab === "subscription" ? "bg-indigo-50 text-indigo-600" : ""}`}
                      onClick={() => setActiveTab("subscription")}
                    >
                      <CreditCard className="h-5 w-5 mr-3" />
                      <span>Subscription</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start ${activeTab === "integrations" ? "bg-indigo-50 text-indigo-600" : ""}`}
                      onClick={() => setActiveTab("integrations")}
                    >
                      <Globe className="h-5 w-5 mr-3" />
                      <span>Integrations</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start ${activeTab === "support" ? "bg-indigo-50 text-indigo-600" : ""}`}
                      onClick={() => setActiveTab("support")}
                    >
                      <LifeBuoy className="h-5 w-5 mr-3" />
                      <span>Support</span>
                    </Button>
                  </nav>
                </CardContent>
              </Card>
              
              {/* Plan info card */}
              <Card className="mt-4 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="mr-3 bg-white/20 p-2 rounded-full">
                      <Gift className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold">{organization.plan} Plan</h3>
                      {organization.plan === "Free" ? (
                        <p className="text-xs text-indigo-200">Upgrade for more features</p>
                      ) : (
                        <p className="text-xs text-indigo-200">Renews on May 1, 2023</p>
                      )}
                    </div>
                  </div>
                  
                  {organization.plan === "Free" && (
                    <div className="mt-4">
                      <p className="text-sm mb-2">Plan usage</p>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Team members: 3/5</span>
                            <span>60%</span>
                          </div>
                          <Progress value={60} className="h-1.5 bg-white/20" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Projects: 2/3</span>
                            <span>67%</span>
                          </div>
                          <Progress value={67} className="h-1.5 bg-white/20" />
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-4 bg-white text-indigo-700 hover:bg-indigo-100"
                        onClick={() => setActiveTab("subscription")}
                      >
                        Upgrade Now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Settings content area */}
            <div className="flex-1">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="space-y-2">
                          <Avatar className="h-24 w-24">
                            <img src={profileForm.avatar} alt={profileForm.name} />
                          </Avatar>
                          <Button variant="outline" size="sm" className="w-full">
                            <Upload className="h-4 w-4 mr-2" /> Change Photo
                          </Button>
                        </div>
                        
                        <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                              <Input 
                                id="name" 
                                value={profileForm.name} 
                                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                              <Input 
                                id="email" 
                                type="email" 
                                value={profileForm.email} 
                                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                required
                                disabled
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                              <Input 
                                id="phone" 
                                type="tel" 
                                value={profileForm.phone} 
                                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label htmlFor="timeZone" className="text-sm font-medium">Time Zone</label>
                              <select 
                                id="timeZone" 
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={profileForm.timeZone}
                                onChange={(e) => setProfileForm({ ...profileForm, timeZone: e.target.value })}
                              >
                                <option value="UTC">UTC (Coordinated Universal Time)</option>
                                <option value="EST">EST (Eastern Standard Time)</option>
                                <option value="CST">CST (Central Standard Time)</option>
                                <option value="MST">MST (Mountain Standard Time)</option>
                                <option value="PST">PST (Pacific Standard Time)</option>
                                <option value="GMT">GMT (Greenwich Mean Time)</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Account Role</label>
                            <div className="flex items-center gap-2 p-3 rounded-md bg-gray-50 border border-gray-100">
                              <Shield className="h-5 w-5 text-indigo-600" />
                              <span>{userProfile.role}</span>
                              <span className="text-xs text-gray-500 ml-2">Admin has full access to all settings</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline">Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
              
              {/* Organization Tab */}
              {activeTab === "organization" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Organization Settings</CardTitle>
                    <CardDescription>
                      Manage your organization details and branding
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleOrganizationSubmit} className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="space-y-2">
                          <div className="h-24 w-24 rounded-md bg-gray-100 flex items-center justify-center border">
                            {organizationForm.logo ? (
                              <img 
                                src={organizationForm.logo} 
                                alt={organizationForm.name} 
                                className="max-h-full max-w-full"
                              />
                            ) : (
                              <Building className="h-10 w-10 text-gray-400" />
                            )}
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            <Upload className="h-4 w-4 mr-2" /> Upload Logo
                          </Button>
                        </div>
                        
                        <div className="flex-1 space-y-4">
                          <div className="space-y-2">
                            <label htmlFor="org-name" className="text-sm font-medium">Organization Name</label>
                            <Input 
                              id="org-name" 
                              value={organizationForm.name} 
                              onChange={(e) => setOrganizationForm({ ...organizationForm, name: e.target.value })}
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label htmlFor="website" className="text-sm font-medium">Website</label>
                              <Input 
                                id="website" 
                                type="url" 
                                placeholder="https://example.com"
                                value={organizationForm.website} 
                                onChange={(e) => setOrganizationForm({ ...organizationForm, website: e.target.value })}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label htmlFor="industry" className="text-sm font-medium">Industry</label>
                              <select 
                                id="industry" 
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={organizationForm.industry}
                                onChange={(e) => setOrganizationForm({ ...organizationForm, industry: e.target.value })}
                              >
                                <option value="">Select an industry</option>
                                <option value="Technology">Technology</option>
                                <option value="Finance">Finance</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Education">Education</option>
                                <option value="Manufacturing">Manufacturing</option>
                                <option value="Retail">Retail</option>
                                <option value="Services">Services</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium">Description</label>
                            <Textarea 
                              id="description" 
                              placeholder="Brief description of your organization"
                              value={organizationForm.description} 
                              onChange={(e) => setOrganizationForm({ ...organizationForm, description: e.target.value })}
                              rows={4}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-medium mb-4">Organization Features</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Public Projects</h4>
                              <p className="text-sm text-gray-500">Allow projects to be viewed publicly</p>
                            </div>
                            <Switch />
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Custom Domain</h4>
                              <p className="text-sm text-gray-500">Use your own domain for project sites</p>
                            </div>
                            <Switch />
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Advanced Analytics</h4>
                              <p className="text-sm text-gray-500">Enable detailed performance reports</p>
                            </div>
                            <Switch checked={true} />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline">Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
              
              {/* Password Tab */}
              {activeTab === "password" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Ensure your account is using a secure password
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="current-password" className="text-sm font-medium">Current Password</label>
                        <Input 
                          id="current-password" 
                          type="password" 
                          value={passwordForm.currentPassword} 
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="new-password" className="text-sm font-medium">New Password</label>
                        <Input 
                          id="new-password" 
                          type="password" 
                          value={passwordForm.newPassword} 
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          required
                        />
                        <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="confirm-password" className="text-sm font-medium">Confirm New Password</label>
                        <Input 
                          id="confirm-password" 
                          type="password" 
                          value={passwordForm.confirmPassword} 
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div className="p-4 rounded-md bg-indigo-50 mt-4">
                        <h4 className="flex items-center text-sm font-semibold text-indigo-800 mb-2">
                          <Shield className="h-4 w-4 mr-2" /> Security Recommendations
                        </h4>
                        <ul className="text-xs text-indigo-700 space-y-1">
                          <li className="flex items-center">
                            <Check className="h-3 w-3 mr-1 text-green-600" /> Use at least 8 characters
                          </li>
                          <li className="flex items-center">
                            <Check className="h-3 w-3 mr-1 text-green-600" /> Mix uppercase and lowercase letters
                          </li>
                          <li className="flex items-center">
                            <Check className="h-3 w-3 mr-1 text-green-600" /> Include numbers and symbols
                          </li>
                          <li className="flex items-center">
                            <Check className="h-3 w-3 mr-1 text-green-600" /> Avoid common words or phrases
                          </li>
                        </ul>
                      </div>
                      
                      <div className="pt-4">
                        <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                        <div className="flex justify-between items-center p-4 rounded-md border">
                          <div>
                            <h4 className="font-medium">Enable 2FA</h4>
                            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline">Cancel</Button>
                        <Button type="submit">Update Password</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
              
              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose how and when you want to be notified
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium">Email Notifications</h3>
                          <p className="text-sm text-gray-500">Receive email notifications for important updates</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.emailNotifications} 
                          onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)} 
                        />
                      </div>
                      
                      <div className="border-t pt-4">
                        <h3 className="text-lg font-medium mb-4">Notify Me About</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Task Assignments</h4>
                              <p className="text-sm text-gray-500">When you are assigned to a task</p>
                            </div>
                            <Switch 
                              checked={notificationSettings.taskAssigned} 
                              onCheckedChange={(checked) => handleNotificationChange('taskAssigned', checked)} 
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Task Updates</h4>
                              <p className="text-sm text-gray-500">When a task you're involved with changes</p>
                            </div>
                            <Switch 
                              checked={notificationSettings.taskUpdated} 
                              onCheckedChange={(checked) => handleNotificationChange('taskUpdated', checked)} 
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Project Deadlines</h4>
                              <p className="text-sm text-gray-500">Reminders about upcoming deadlines</p>
                            </div>
                            <Switch 
                              checked={notificationSettings.projectDeadlines} 
                              onCheckedChange={(checked) => handleNotificationChange('projectDeadlines', checked)} 
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Comments</h4>
                              <p className="text-sm text-gray-500">When someone comments on your work</p>
                            </div>
                            <Switch 
                              checked={notificationSettings.comments} 
                              onCheckedChange={(checked) => handleNotificationChange('comments', checked)} 
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h3 className="text-lg font-medium mb-4">Summary Emails</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Daily Digest</h4>
                              <p className="text-sm text-gray-500">Summary of activity each day</p>
                            </div>
                            <Switch 
                              checked={notificationSettings.dailyDigest} 
                              onCheckedChange={(checked) => handleNotificationChange('dailyDigest', checked)} 
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Weekly Digest</h4>
                              <p className="text-sm text-gray-500">Summary of activity each week</p>
                            </div>
                            <Switch 
                              checked={notificationSettings.weeklyDigest} 
                              onCheckedChange={(checked) => handleNotificationChange('weeklyDigest', checked)} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Subscription Tab */}
              {activeTab === "subscription" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Management</CardTitle>
                    <CardDescription>
                      Manage your current plan and billing information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 rounded-md bg-indigo-50 border border-indigo-200">
                      <div className="flex items-center">
                        <div className="mr-4">
                          {organization.plan === "Free" ? (
                            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                              <Gift className="h-6 w-6 text-indigo-600" />
                            </div>
                          ) : (
                            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                              <Check className="h-6 w-6 text-green-600" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {organization.plan === "Free" ? "Free Plan" : `${organization.plan} Plan`}
                          </h3>
                          <p className="text-sm text-indigo-700">
                            {organization.plan === "Free" 
                              ? "You are currently on the free plan" 
                              : `Your subscription renews on May 1, 2023`
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium pt-4">Available Plans</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {plans.map(plan => (
                        <Card 
                          key={plan.name} 
                          className={`border ${plan.current ? 'border-indigo-500 ring-2 ring-indigo-200' : ''}`}
                        >
                          <CardHeader className="pb-2">
                            <CardTitle>{plan.name}</CardTitle>
                            <div className="flex items-baseline mt-1">
                              <span className="text-2xl font-bold">{plan.price}</span>
                              <span className="text-sm text-gray-500 ml-1">/{plan.period}</span>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <ul className="text-sm space-y-2">
                              {plan.features.map(feature => (
                                <li key={feature} className="flex items-start">
                                  <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                          <CardFooter>
                            <Button 
                              className={`w-full ${plan.current ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : ''}`}
                              variant={plan.current ? "outline" : "default"}
                              disabled={plan.current}
                            >
                              {plan.current ? "Current Plan" : "Upgrade"}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                    
                    {organization.plan !== "Free" && (
                      <div className="pt-6 border-t">
                        <h3 className="text-lg font-medium mb-4">Payment Information</h3>
                        <div className="border rounded-md p-4 flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="p-2 bg-gray-100 rounded mr-3">
                              <CreditCard className="h-6 w-6 text-gray-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">Visa ending in 4242</h4>
                              <p className="text-sm text-gray-500">Expires 12/2024</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                        </div>
                        
                        <div className="mt-4 p-4 rounded-md bg-amber-50 border border-amber-200">
                          <div className="flex">
                            <div className="mr-3">
                              <Bell className="h-5 w-5 text-amber-500" />
                            </div>
                            <div>
                              <h4 className="font-medium text-amber-800">Next payment</h4>
                              <p className="text-sm text-amber-700">
                                Your next payment of $48.00 will be processed on May 1, 2023
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {organization.plan !== "Free" && (
                      <div className="pt-6 border-t">
                        <h3 className="text-lg font-medium mb-2">Cancel Subscription</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          If you cancel, you'll have access to your current plan until the end of your billing period.
                        </p>
                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                          <X className="h-4 w-4 mr-2" /> Cancel Subscription
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Integrations Tab */}
              {activeTab === "integrations" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Integrations</CardTitle>
                    <CardDescription>
                      Connect with other tools and services
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4 flex items-center">
                            <div className="mr-4 p-2 bg-blue-100 rounded-md">
                              <svg 
                                className="h-8 w-8" 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill="#0052CC"
                              >
                                <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 22.957c-6.053 0-10.957-4.904-10.957-10.957S5.947 1.043 12 1.043 22.957 5.947 22.957 12 18.053 22.957 12 22.957z" />
                                <path d="M17.74 10.909a.781.781 0 000-1.105l-3.738-3.738a.781.781 0 00-1.104 0l-3.738 3.738a.781.781 0 000 1.105l3.738 3.738a.781.781 0 001.104 0l3.738-3.738z" />
                                <path d="M10.058 14.234a.781.781 0 00-1.105 0l-2.66 2.66a.781.781 0 000 1.104l2.66 2.66a.781.781 0 001.105 0l2.66-2.66a.781.781 0 000-1.104l-2.66-2.66zM13.943 3.342a.781.781 0 00-1.105 0l-2.66 2.66a.781.781 0 000 1.105l2.66 2.66a.781.781 0 001.105 0l2.66-2.66a.781.781 0 000-1.105l-2.66-2.66z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">Jira</h3>
                              <p className="text-sm text-gray-500">Sync tasks with Jira issues</p>
                            </div>
                            <Button variant="outline" size="sm">Connect</Button>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4 flex items-center">
                            <div className="mr-4 p-2 bg-blue-100 rounded-md">
                              <svg 
                                className="h-8 w-8" 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill="#2684FF"
                              >
                                <path d="M1.95 12c0-5.523 4.476-10 10-10 5.522 0 10 4.477 10 10s-4.478 10-10 10c-5.524 0-10-4.477-10-10z"/>
                                <path d="M16.3 7H8.7c-.11 0-.201.09-.201.2v1.6c0 .11.09.2.2.2h2.8V17c0 .11.09.2.2.2h1.6c.11 0 .2-.09.2-.2V9h2.8c.11 0 .2-.09.2-.2V7.2c0-.11-.09-.2-.2-.2z" fill="#fff"/>
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">Confluence</h3>
                              <p className="text-sm text-gray-500">Embed Confluence pages</p>
                            </div>
                            <Button variant="outline" size="sm">Connect</Button>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4 flex items-center">
                            <div className="mr-4 p-2 bg-blue-100 rounded-md">
                              <svg 
                                className="h-8 w-8" 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill="#4285F4"
                              >
                                <path d="M6,12.9v4.3H9c-0.4,1.5-1.7,2.6-3,2.6c-1.7,0-3-1.3-3-3s1.3-3,3-3C6.4,13.8,6.7,14,7,14.3l2.4-1.7c-1-1.4-2.6-2.3-4.4-2.3C2.2,10.3,0,12.5,0,15.2S2.2,20,5,20c4.3,0,5-3.8,5-5.6c0-0.4,0-0.8-0.1-1.5H6z"/>
                                <path d="M24,12c0-1.1-0.9-2-2-2s-2,0.9-2,2s0.9,2,2,2S24,13.1,24,12z M20,16c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S21.1,16,20,16z"/>
                                <path d="M15.2,16c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S16.3,16,15.2,16z M15.2,12c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S16.3,12,15.2,12z M15.2,8c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S16.3,8,15.2,8z"/>
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">Google Workspace</h3>
                              <p className="text-sm text-gray-500">Calendar and Drive integration</p>
                            </div>
                            <Button variant="outline" size="sm">Connect</Button>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4 flex items-center">
                            <div className="mr-4 p-2 bg-purple-100 rounded-md">
                              <svg 
                                className="h-8 w-8" 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill="#5865F2"
                              >
                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.39-.444.913-.608 1.322a18.278 18.278 0 0 0-5.488 0a12.292 12.292 0 0 0-.617-1.322a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.069.069 0 0 0-.032.027C.533 9.046-.319 13.58.099 18.052a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.027c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01a9.63 9.63 0 0 0 .373.292a.077.077 0 0 1-.006.128a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.363 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.056c.5-5.177-.838-9.674-3.549-13.655a.061.061 0 0 0-.032-.029zM8.02 15.33c-1.183 0-2.157-1.086-2.157-2.42c0-1.335.956-2.42 2.157-2.42c1.21 0 2.176 1.095 2.157 2.42c0 1.334-.956 2.42-2.157 2.42zm7.975 0c-1.183 0-2.157-1.086-2.157-2.42c0-1.335.955-2.42 2.157-2.42c1.21 0 2.176 1.095 2.157 2.42c0 1.334-.946 2.42-2.157 2.42z"/>
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">Discord</h3>
                              <p className="text-sm text-gray-500">Task alerts in Discord</p>
                            </div>
                            <Button variant="outline" size="sm">Connect</Button>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4 flex items-center">
                            <div className="mr-4 p-2 bg-gray-100 rounded-md">
                              <svg 
                                className="h-8 w-8" 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill="#000000"
                              >
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.949 15.619c-.212.632-.525 1.227-.942 1.764-.444.576-1.56 1.649-3.294 2.173a4.506 4.506 0 0 1-.974.214c-.931.104-1.958.051-2.97-.137-.904-.181-1.59-.438-2.15-.767-.479-.267-.925-.613-1.332-1.031a7.13 7.13 0 0 1-1.026-1.33c-.329-.559-.586-1.245-.767-2.15-.185-1.02-.241-2.047-.134-3.065.054-.335.124-.66.211-.978.524-1.723 1.597-2.847 2.177-3.29.536-.413 1.13-.726 1.762-.937.327-.107.664-.19 1.012-.245 1.021-.134 2.048-.077 3.063.132.905.18 1.591.437 2.15.766.48.268.925.614 1.332 1.032.418.407.764.852 1.031 1.332.329.558.586 1.245.767 2.149.185 1.02.241 2.047.134 3.065-.054.335-.124.661-.212.979l.027-.01-.027.01l.002-.001z" />
                                <path d="M16.842 9.999l-3.174.037-2.557-4.275-1.236 4.382-3.332.037 2.673 1.945-1.236 4.382 2.721-1.945 2.721 1.945-1.236-4.382 2.656-2.126z" fill="#fff"/>
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">GitHub</h3>
                              <p className="text-sm text-gray-500">Link commits to tasks</p>
                            </div>
                            <Button className="bg-green-600 hover:bg-green-700">
                              <Check className="h-4 w-4 mr-2" /> Connected
                            </Button>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4 flex items-center">
                            <div className="mr-4 p-2 bg-purple-100 rounded-md">
                              <svg 
                                className="h-8 w-8" 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill="#4A154B"
                              >
                                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">Slack</h3>
                              <p className="text-sm text-gray-500">Post updates to channels</p>
                            </div>
                            <Button variant="outline" size="sm">Connect</Button>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-medium mb-4">API Access</h3>
                        <div className="p-4 rounded-md bg-gray-50 border border-gray-200">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium">API Key</h4>
                            <Button variant="outline" size="sm">
                              Generate New Key
                            </Button>
                          </div>
                          <div className="relative">
                            <Input value="••••••••••••••••••••••••••••••" readOnly />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="absolute right-1 top-1 h-7"
                            >
                              Copy
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Last used: Never
                          </p>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between p-4 rounded-md border border-gray-200">
                          <div>
                            <h4 className="font-medium">API Documentation</h4>
                            <p className="text-sm text-gray-500">
                              Learn how to integrate with our API
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            View Docs
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Support Tab */}
              {activeTab === "support" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Help & Support</CardTitle>
                    <CardDescription>
                      Get assistance and find answers to your questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4 flex flex-col items-center text-center">
                          <div className="p-3 bg-indigo-100 rounded-full mb-4 mt-4">
                            <FileText className="h-8 w-8 text-indigo-600" />
                          </div>
                          <h3 className="font-semibold mb-2">Documentation</h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Browse our detailed documentation to learn how to use all features.
                          </p>
                          <Button variant="outline" className="mt-auto">
                            View Documentation
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4 flex flex-col items-center text-center">
                          <div className="p-3 bg-amber-100 rounded-full mb-4 mt-4">
                            <MessageSquare className="h-8 w-8 text-amber-600" />
                          </div>
                          <h3 className="font-semibold mb-2">Contact Support</h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Get in touch with our customer support team for personalized help.
                          </p>
                          <Button className="mt-auto">
                            Contact Support
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-4">Frequently Asked Questions</h3>
                      <div className="space-y-4">
                        <div className="p-4 rounded-md border">
                          <h4 className="font-medium mb-2">How do I add team members?</h4>
                          <p className="text-sm text-gray-600">
                            You can add team members by going to the Team page and clicking the "Invite Team Member" button. Enter their email and select their role.
                          </p>
                        </div>
                        
                        <div className="p-4 rounded-md border">
                          <h4 className="font-medium mb-2">Can I export my data?</h4>
                          <p className="text-sm text-gray-600">
                            Yes, you can export your data in various formats including CSV and PDF. Go to the project or task you want to export and look for the export option.
                          </p>
                        </div>
                        
                        <div className="p-4 rounded-md border">
                          <h4 className="font-medium mb-2">How do I change my subscription plan?</h4>
                          <p className="text-sm text-gray-600">
                            You can change your subscription plan in the Subscription tab of the Settings page. Select the plan you want to upgrade or downgrade to.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-4">Submit a Request</h3>
                      <form className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="support-subject" className="text-sm font-medium">Subject</label>
                          <Input id="support-subject" placeholder="What's your question about?" />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="support-message" className="text-sm font-medium">Message</label>
                          <Textarea 
                            id="support-message" 
                            placeholder="Describe your issue in detail..."
                            rows={4}
                          />
                        </div>
                        
                        <div className="flex justify-between items-center pt-2">
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="include-screenshots" 
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4" 
                            />
                            <label htmlFor="include-screenshots" className="ml-2 text-sm text-gray-600">
                              Include screenshots and system info
                            </label>
                          </div>
                          <Button type="submit">
                            Submit Request
                          </Button>
                        </div>
                      </form>
                    </div>
                    
                    <div className="bg-indigo-50 border border-indigo-100 rounded-md p-4 flex">
                      <div className="mr-4">
                        <Heart className="h-6 w-6 text-rose-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-indigo-800">We'd love your feedback</h4>
                        <p className="text-sm text-indigo-700">
                          Help us improve by sharing your experience with our product.
                        </p>
                        <Button variant="link" className="p-0 h-auto text-indigo-600 mt-1">
                          Give Feedback
                        </Button>
                      </div>
                    </div>
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

// Wrap with TaskProvider
const Settings = () => (
  <TaskProvider>
    <SettingsContent />
  </TaskProvider>
);

export default Settings;
