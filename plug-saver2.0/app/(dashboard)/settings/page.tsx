"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Info,
  Share2,
  Shield,
  Bell,
  Users,
  Accessibility,
  HelpCircle,
  Home,
  LayoutDashboard,
  ChevronRight,
  Camera,
  LogOut,
  CheckCircle,
  Mail,
  Phone,
  UserPlus,
  FileQuestion,
} from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = "https://xgcfvxwrcunwsrvwwjjx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnY2Z2eHdyY3Vud3Nydnd3amp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5OTIzNzIsImV4cCI6MjA1MzU2ODM3Mn0.fgT2LL7dlx7VR185WABZCtK8ZdF4rpdOIy-crGpp6tU";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function SettingsPage() {
  const router = useRouter();

  // State for various settings
  const [user, setUser] = useState({
    username: "Username",
    role: "Household Manager",
    avatar: "/placeholder.svg?height=80&width=80",
    email: "user@example.com",
    country: "United Arab Emirates", 
    birthdate: "1990-01-01",
    language: "English",
  });

  // State for household code
  const [householdCode, setHouseholdCode] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return false;
  });

  // Apply dark mode class to the document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", isDarkMode.toString());
  }, [isDarkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    const fetchHouseholdUsers = async () => {
      const household_code = localStorage.getItem("household_code");
      const user_id = localStorage.getItem("user_id");
  
      if (!household_code || !user_id) {
        setError("Household code or user ID not found in localStorage");
        setLoading(false);
        return;
      }
  
      try {
        const response = await fetch(
          `/api/auth/get_householdusers?household_code=${household_code}`
        );
        const data = await response.json();
  
        if (data.success) {
          // Find the current user (manager or member)
          const currentUser = data.users.find((user: any) => user.user_id.toString() === user_id.toString());
  
          if (currentUser) {
            // Set the current user's details
            setUser((prev) => ({
              ...prev,
              username: currentUser.name || prev.username,
              email: currentUser.email || prev.email,
              country: currentUser.country || prev.country,
              birthdate: currentUser.dob || prev.birthdate,
              role: currentUser.role || prev.role,
            }));
  
            // Set the list of all household members (including the manager)
            setUsers(data.users);
          } else {
            setError("Current user not found in household");
          }
        } else {
          setError(data.message || "Failed to fetch household users");
        }
      } catch (error) {
        console.error("Error fetching household users:", error);
        setError("An error occurred while fetching household users");
      } finally {
        setLoading(false);
      }
    };
  
    fetchHouseholdUsers();
  }, []);

  // Fetch username, country, email, and household code from localStorage on mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      const user_id = localStorage.getItem("user_id"); // Get user_id from localStorage
      if (!user_id) {
        console.error("User ID not found in localStorage");
        return;
      }

      try {
        const response = await fetch(`/api/auth/get_user_details?user_id=${user_id}`);
        const data = await response.json();

        if (data.success) {
          // Update the user state with fetched details
          setUser((prev) => ({
            ...prev,
            username: data.user.name || prev.username,
            email: data.user.email || prev.email,
            country: data.user.country || prev.country,
            birthdate: data.user.dob || prev.birthdate,
          }));
        } else {
          console.error("Failed to fetch user details:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  // States for different dialog modals
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [activeSheet, setActiveSheet] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // State for managing member permissions dialog
  const [manageMemberDialogOpen, setManageMemberDialogOpen] = useState(false);
  const [manageMemberPermissions, setManageMemberPermissions] = useState({
    control: false,
    configure: false,
  });

  // Toggle states for various settings
  const [settings, setSettings] = useState({
    dataSharing: {
      usageData: true,
      locationData: false,
      marketingEmails: true,
    },
    security: {
      twoFactorAuth: false,
      rememberDevice: true,
      passwordExpiry: "90days",
    },
    notifications: {
      appNotifications: true,
      emailNotifications: true,
      smsNotifications: false,
      usageAlerts: true,
      savingsGoals: true,
      tipsAndTricks: true,
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      screenReader: false,
      reduceMotion: false,
      theme: "system",
    },
    household: {
      autoSaving: true,
      smartScheduling: true,
      guestAccess: false,
      name: "My Home",
      size: "medium",
      rooms: 4,
    },
  });

  // Handle opening dialogs
  const openDialog = (dialog: string) => {
    setActiveDialog(dialog);
    setSaveSuccess(false);
  };

  // Handle opening sheets (for mobile view)
  const openSheet = (sheet: string) => {
    setActiveSheet(sheet);
    setSaveSuccess(false);
  };

  // Handle saving settings
  const handleSave = () => {
    setSaveSuccess(true);
    // Would normally save to a database or API
    setTimeout(() => {
      if (activeDialog) setActiveDialog(null);
      if (activeSheet) setActiveSheet(null);
      setManageMemberDialogOpen(false);
    }, 1500);
  };

  // Handle logout
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert("No file selected.");
      return;
    }
  
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", userId); // Ensure user_id is sent as a form field
  
    try {
      const response = await fetch("/api/auth/profile_pic", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
      console.log("POST Response:", result);
  
      if (!result.success) {
        throw new Error(result.message);
      }
  
      // Update the local state with the new avatar URL
      setUser((prev) => ({ ...prev, avatar: result.avatar_url }));
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("An error occurred while uploading the avatar.");
    }
  };

  useEffect(() => {
    const fetchProfilePicture = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;
  
      try {
        const response = await fetch(`/api/auth/profile_pic?user_id=${encodeURIComponent(userId)}`);
        const result = await response.json();
  
        if (result.success && result.avatar_url) {
          // Update the local state with the fetched avatar URL
          setUser((prev) => ({ ...prev, avatar: result.avatar_url }));
  
          // Debug: Log the fetched avatar URL
          console.log("Fetched Avatar URL:", result.avatar_url);
        } else {
          console.error("Error fetching profile picture:", result);
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };
  
    fetchProfilePicture();
  }, []);
  
  // Handle toggle changes
  const handleToggleChange = (category: string, setting: string, value: boolean) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category as keyof typeof settings],
        [setting]: value,
      },
    });
  };

  // Get appropriate component based on screen size
  const SettingsItem = ({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) => (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center justify-between p-3 rounded-md hover:bg-purple-50/10"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 flex items-center justify-center text-purple-400">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </motion.button>
  );

  // Profile settings content
  const ProfilePictureContent = () => (
    <>
      <DialogDescription className="text-center mb-4">
        Upload a new profile picture or select from our collection
      </DialogDescription>

      <div className="flex flex-col items-center gap-4 mb-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src={`${user.avatar}`} /> 
          <AvatarFallback>{user.username[0]}</AvatarFallback>
        </Avatar>

        <Label
          htmlFor="avatar-upload"
          className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full flex items-center gap-2"
        >
          <Camera className="w-4 h-4" />
          <span>Upload Photo</span>
          <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        </Label>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="aspect-square rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500"
            onClick={() => setUser({ ...user, avatar: `/placeholder.svg?height=80&width=80&text=Avatar${i}` })}
          >
            <img
              src={`/placeholder.svg?height=80&width=80&text=Avatar${i}`}
              alt={`Avatar ${i}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </>
  );

  const PersonalInfoContent = () => {
    // Comprehensive list of all countries
    const countries = [
      "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia",
      "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
      "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
      "Burkina Faso", "Burundi", "Côte d'Ivoire", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic",
      "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba",
      "Cyprus", "Czechia", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
      "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji",
      "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
      "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran",
      "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait",
      "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
      "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
      "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (Burma)",
      "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea",
      "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea",
      "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
      "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
      "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
      "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
      "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia",
      "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America",
      "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
    ];

    return (
      <>
        <DialogDescription className="mb-4">Update your personal information</DialogDescription>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              readOnly
              className="bg-gray-100 cursor-not-allowed" // Grey out and disable the email field
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={user.country} // Use 'country' from the user state
              onValueChange={(value) => setUser({ ...user, country: value })} // Update 'country' in the user state
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto"> {/* Scrollable dropdown */}
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthdate">Birthdate</Label>
            <Input
              id="birthdate"
              type="date"
              value={user.birthdate}
              onChange={(e) => setUser({ ...user, birthdate: e.target.value })}
            />
          </div>
        </div>
      </>
    );
  };

  const DataSharingContent = () => (
    <>
      <DialogDescription className="mb-4">Control how your data is used and shared</DialogDescription>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Usage Data</Label>
            <p className="text-sm text-gray-400">Share energy usage data to improve services</p>
          </div>
          <Switch
            checked={settings.dataSharing.usageData}
            onCheckedChange={(checked) => handleToggleChange("dataSharing", "usageData", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Location Data</Label>
            <p className="text-sm text-gray-400">Allow access to your location data</p>
          </div>
          <Switch
            checked={settings.dataSharing.locationData}
            onCheckedChange={(checked) => handleToggleChange("dataSharing", "locationData", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Marketing Emails</Label>
            <p className="text-sm text-gray-400">Receive promotional offers and updates</p>
          </div>
          <Switch
            checked={settings.dataSharing.marketingEmails}
            onCheckedChange={(checked) => handleToggleChange("dataSharing", "marketingEmails", checked)}
          />
        </div>

        <div>
        <div className="pt-5 border-t"/>
          <h4 className="text-sm font-medium mb-3">Account Deletion</h4>
          <Button variant="destructive" className="w-full">
            Request Account Deletion
          </Button>
        </div>
      </div>
    </>
  );

  const SecurityContent = () => (
    <>
      <DialogDescription className="mb-4">Manage your security preferences and account protection</DialogDescription>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Two-Factor Authentication</Label>
            <p className="text-sm text-gray-400">Add an extra layer of security</p>
          </div>
          <Switch
            checked={settings.security.twoFactorAuth}
            onCheckedChange={(checked) => handleToggleChange("security", "twoFactorAuth", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Remember Device</Label>
            <p className="text-sm text-gray-400">Stay logged in on this device</p>
          </div>
          <Switch
            checked={settings.security.rememberDevice}
            onCheckedChange={(checked) => handleToggleChange("security", "rememberDevice", checked)}
          />
        </div>

        <div className="pt-5 border-t">
          <Button variant="outline" className="w-full">
            Change Password
          </Button>
        </div>
      </div>
    </>
  );

  const NotificationsContent = () => (
    <>
      <DialogDescription className="mb-4">Customize your notification preferences</DialogDescription>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-base">Notification Channels</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-500" />
                <span className="text-sm">App Notifications</span>
              </div>
              <Switch
                checked={settings.notifications.appNotifications}
                onCheckedChange={(checked) => handleToggleChange("notifications", "appNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-500" />
                <span className="text-sm">Email Notifications</span>
              </div>
              <Switch
                checked={settings.notifications.emailNotifications}
                onCheckedChange={(checked) => handleToggleChange("notifications", "emailNotifications", checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base">Alert Types</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Usage Alerts</span>
              <Switch
                checked={settings.notifications.usageAlerts}
                onCheckedChange={(checked) => handleToggleChange("notifications", "usageAlerts", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Savings Goals</span>
              <Switch
                checked={settings.notifications.savingsGoals}
                onCheckedChange={(checked) => handleToggleChange("notifications", "savingsGoals", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Tips & Tricks</span>
              <Switch
                checked={settings.notifications.tipsAndTricks}
                onCheckedChange={(checked) => handleToggleChange("notifications", "tipsAndTricks", checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base">Quiet Hours</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="quiet-start" className="text-sm">
                Start Time
              </Label>
              <Input id="quiet-start" type="time" defaultValue="22:00" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="quiet-end" className="text-sm">
                End Time
              </Label>
              <Input id="quiet-end" type="time" defaultValue="07:00" />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const MembersContent = () => {
    const loggedInUserId = localStorage.getItem("user_id"); // Get the logged-in user's ID
    const isManager = user.role === "manager"; // Check if the logged-in user is a manager
  
    return (
      <>
        <DialogDescription className="mb-4">Manage household members and permissions</DialogDescription>
  
        <div className="space-y-6">
          {/* Current User (Logged-In User) */}
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.username[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user.username} (You)</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>
          </div>
  
          {/* List of Other Household Members */}
          {users.length > 0 ? (
            users
              .filter((member) => member.user_id.toString() !== loggedInUserId) // Filter out the logged-in user
              .map((member) => (
                <div
                  key={member.user_id}
                  className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{member.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  {/* Show "Manage" button only if the logged-in user is a manager */}
                  {isManager && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setManageMemberDialogOpen(true)}
                    >
                      Manage
                    </Button>
                  )}
                </div>
              ))
          ) : (
            <p className="text-sm text-gray-500">No other members found.</p>
          )}
  
          {/* Invite New Member Button (Only for Managers) */}
          {isManager && (
            <Button className="w-full flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4" />
              <span>Invite New Member</span>
            </Button>
          )}
  
          {/* Pending Invitations (Only for Managers) */}
          {isManager && (
            <div className="space-y-2 pt-4 border-t">
              <Label className="text-base">Pending Invitations</Label>
              <div className="text-sm p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                <p className="font-medium">sarah@example.com</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500">Sent 2 days ago</p>
                  <Button variant="link" size="sm" className="h-auto p-0">
                    Resend
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  const MemberPermissionsContent = () => (
    <>
      <DialogDescription className="mb-4">Manage permissions for Anna Mohamed</DialogDescription>
  
      <div className="space-y-6">
        {/* Control Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base">Control</Label>
            <p className="text-sm text-gray-500">Allow the user to turn on/off the device.</p>
          </div>
          <Switch
            checked={manageMemberPermissions.control}
            onCheckedChange={(checked) => setManageMemberPermissions({ ...manageMemberPermissions, control: checked })}
          />
        </div>
  
        {/* Configure Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base">Configure</Label>
            <p className="text-sm text-gray-500">Allow the user to add, delete, and edit devices.</p>
          </div>
          <Switch
            checked={manageMemberPermissions.configure}
            onCheckedChange={(checked) => setManageMemberPermissions({ ...manageMemberPermissions, configure: checked })}
          />
        </div>
      </div>
    </>
  );

  const AccessibilityContent = () => {
    // Handle theme change
    const handleThemeChange = (value: string) => {
      if (value === "light") {
        setIsDarkMode(false); // Disable dark mode
      } else if (value === "dark") {
        setIsDarkMode(true); // Enable dark mode
      }
    }; return (
    <>
      <DialogDescription className="mb-4">Customize your accessibility preferences</DialogDescription>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">High Contrast</Label>
            <p className="text-sm text-gray-400">Increase color contrast</p>
          </div>
          <Switch
            checked={settings.accessibility.highContrast}
            onCheckedChange={(checked) => handleToggleChange("accessibility", "highContrast", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Large Text</Label>
            <p className="text-sm text-gray-400">Increase text size</p>
          </div>
          <Switch
            checked={settings.accessibility.largeText}
            onCheckedChange={(checked) => handleToggleChange("accessibility", "largeText", checked)}
          />
        </div>

        <div className="space-y-2">
          <Label>App Theme</Label>
          <RadioGroup
            defaultValue={settings.accessibility.theme}
            onValueChange={(value) => {
              setSettings({
                ...settings,
                accessibility: {
                  ...settings.accessibility,
                  theme: value,
                },
              });
              handleThemeChange(value);
            }}
            className="flex gap-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="theme-light" />
              <Label htmlFor="theme-light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="theme-dark" />
              <Label htmlFor="theme-dark">Dark</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </>
  )};

  const SupportContent = () => (
    <>
      <DialogDescription className="mb-4">Get help and support</DialogDescription>

      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="support-subject">Subject</Label>
            <Select defaultValue="technical">
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical Issue</SelectItem>
                <SelectItem value="billing">Billing Question</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="support-message">Message</Label>
            <Textarea id="support-message" placeholder="Describe your issue..." className="min-h-[120px]" />
          </div>

          <Button className="w-full">Submit Ticket</Button>

          <div className="pt-4 space-y-3">
            <p className="text-sm font-medium">Or contact us directly:</p>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-500" />
              <a href="mailto:support@plugsaver.com" className="text-sm text-purple-500">
                support@plugsaver.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-purple-500" />
              <a href="tel:+97180012345" className="text-sm text-purple-500">
                +971 800 12345
              </a>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4 pt-4">
          <div className="space-y-3">
            {[
              {
                q: "How is my energy usage calculated?",
                a: "Your energy usage is calculated based on real-time data from your connected devices and smart meters.",
              },
              {
                q: "Can I connect devices from different manufacturers?",
                a: "Yes, Plug Saver supports a wide range of smart devices from various manufacturers.",
              },
              {
                q: "How accurate are the cost estimates?",
                a: "Our cost estimates are highly accurate as they use real-time electricity rates from your utility provider.",
              },
              {
                q: "How do I reset my password?",
                a: "You can reset your password by clicking on 'Forgot Password' on the login screen.",
              },
            ].map((item, i) => (
              <div key={i} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                <p className="font-medium text-sm">{item.q}</p>
                <p className="text-xs text-gray-500 mt-1">{item.a}</p>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full">
            View All FAQs
          </Button>
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-4 pt-4">
          <div className="space-y-3">
            {[
              { title: "Getting Started with Plug Saver", duration: "5 min" },
              { title: "Connecting Smart Devices", duration: "8 min" },
              { title: "Understanding Your Dashboard", duration: "6 min" },
              { title: "Setting Energy-Saving Goals", duration: "4 min" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-md flex items-center justify-center text-purple-500">
                  <FileQuestion className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.duration} video tutorial</p>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full">
            View All Tutorials
          </Button>
        </TabsContent>
      </Tabs>
    </>
  );

  const HouseholdContent = () => {
    // Function to copy the household code to the clipboard
    const copyHouseholdCode = () => {
      if (householdCode) {
        navigator.clipboard.writeText(householdCode).then(() => {
          alert("Household code copied to clipboard!");
        });
      }
    };
  
    return (
      <>
        <DialogDescription className="mb-4">Manage your household settings</DialogDescription>
  
        <div className="space-y-6">
          {/* Household Name */}
          <div className="space-y-2">
            <Label htmlFor="household-name">Household Name</Label>
            <Input
              id="household-name"
              value={settings.household.name}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  household: {
                    ...settings.household,
                    name: e.target.value,
                  },
                })
              }
            />
          </div>
  
          {/* Household Code with Copy Button */}
          <div className="space-y-2">
            <Label htmlFor="household-code">Household Code</Label>
            <div className="relative">
              <Input
                id="household-code"
                value={householdCode || "No household code found"} // Use household code from state
                readOnly // Make the input read-only
                className="bg-gray-100 cursor-not-allowed pr-10" // Grayed out, disabled, and padding for the button
              />
              <button
                onClick={copyHouseholdCode}
                className="absolute inset-y-0 right-0 flex items-center px-3 bg-gray-100 hover:bg-gray-200 rounded-r-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
  
          {/* Auto-Saving Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Auto-Saving Mode</Label>
              <p className="text-sm text-gray-400">Automatically optimize energy usage</p>
            </div>
            <Switch
              checked={settings.household.autoSaving}
              onCheckedChange={(checked) => handleToggleChange("household", "autoSaving", checked)}
            />
          </div>
  
         
  
          {/* Smart Scheduling */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Smart Scheduling</Label>
              <p className="text-sm text-gray-400">Enable device scheduling based on habits</p>
            </div>
            <Switch
              checked={settings.household.smartScheduling}
              onCheckedChange={(checked) => handleToggleChange("household", "smartScheduling", checked)}
            />
          </div>
        </div>
      </>
    );
  };

  const DashboardContent = () => (
    <>
      <DialogDescription className="mb-4">Customize your dashboard and widgets</DialogDescription>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-base">Dashboard Layout</Label>
          <div className="grid grid-cols-2 gap-3">
            <button className="border-2 border-purple-500 rounded-md p-2 flex flex-col items-center gap-1 bg-purple-50/10">
              <div className="grid grid-cols-2 gap-1 w-full">
                <div className="aspect-video bg-purple-200/20 rounded"></div>
                <div className="aspect-video bg-purple-200/20 rounded"></div>
                <div className="aspect-video bg-purple-200/20 rounded col-span-2"></div>
              </div>
              <span className="text-xs font-medium">Standard</span>
            </button>

            <button className="border-2 border-transparent hover:border-purple-500 rounded-md p-2 flex flex-col items-center gap-1">
              <div className="grid grid-cols-3 gap-1 w-full">
                <div className="aspect-video bg-purple-200/20 rounded"></div>
                <div className="aspect-video bg-purple-200/20 rounded"></div>
                <div className="aspect-video bg-purple-200/20 rounded"></div>
                <div className="aspect-video bg-purple-200/20 rounded col-span-3"></div>
              </div>
              <span className="text-xs font-medium">Compact</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base">Visible Widgets</Label>

          <div className="space-y-2">
            {[
              { id: "energy-usage", label: "Energy Usage", enabled: true },
              { id: "active-devices", label: "Active Devices", enabled: true },
              { id: "savings-chart", label: "Savings Chart", enabled: true },
              { id: "energy-tips", label: "Energy Saving Tips", enabled: true },
              { id: "carbon-footprint", label: "Carbon Footprint", enabled: true },
            ].map((widget) => (
              <div
                key={widget.id}
                className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-md"
              >
                <span className="text-sm">{widget.label}</span>
                <Switch defaultChecked={widget.enabled} />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base">Default Time Period</Label>
          <RadioGroup defaultValue="week" className="flex gap-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="day" id="period-day" />
              <Label htmlFor="period-day">Day</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="week" id="period-week" />
              <Label htmlFor="period-week">Week</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="month" id="period-month" />
              <Label htmlFor="period-month">Month</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="year" id="period-year" />
              <Label htmlFor="period-year">Year</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-500 via-purple-400 to-transparent pb-10 rounded-b-[40px]">
        <div className="max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.username[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-medium">{user.username}</h2>
                <p className="text-sm text-gray-500">Personal Information</p>
                <p className="font-medium text-sm mt-1">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="max-w-md mx-auto p-6 -mt-5">
        <div className="space-y-8">
          {/* Profile Section */}
          <section>
            <h2 className="text-lg font-medium text-purple-500 mb-2">Profile</h2>
            <div className="space-y-1">
              <SettingsItem icon={User} label="Profile Picture" onClick={() => openDialog("profilePicture")} />
              <SettingsItem icon={Info} label="Personal Information" onClick={() => openDialog("personalInfo")} />
              <SettingsItem icon={Share2} label="Data Sharing Preferences" onClick={() => openDialog("dataSharing")} />
            </div>
          </section>

          {/* Account and App Section */}
          <section>
            <h2 className="text-lg font-medium text-purple-500 mb-2">Account and App</h2>
            <div className="space-y-1">
              <SettingsItem icon={Shield} label="Security and Privacy" onClick={() => openDialog("security")} />
              <SettingsItem icon={Bell} label="Notifications" onClick={() => openDialog("notifications")} />
              <SettingsItem icon={Users} label="Members" onClick={() => openDialog("members")} />
              <SettingsItem icon={Accessibility} label="Accessibility" onClick={() => openDialog("accessibility")} />
              <SettingsItem icon={HelpCircle} label="Support" onClick={() => openDialog("support")} />
              <SettingsItem icon={Home} label="Household" onClick={() => openDialog("household")} />
              <SettingsItem icon={LayoutDashboard} label="Dashboard" onClick={() => openDialog("dashboard")} />
            </div>
          </section>

          {/* Logout Button */}
          <Button
            variant="outline"
            className="w-full border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>

      {/* Dialogs for each setting */}
      <Dialog open={activeDialog === "profilePicture"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile Picture</DialogTitle>
          </DialogHeader>
          {ProfilePictureContent()}
          <DialogFooter>
            {saveSuccess && (
              <p className="text-green-500 flex items-center text-sm">
                <CheckCircle className="w-4 h-4 mr-1" /> Saved successfully
              </p>
            )}
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "personalInfo"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Personal Information</DialogTitle>
          </DialogHeader>
          {PersonalInfoContent()}
          <DialogFooter>
            {saveSuccess && (
              <p className="text-green-500 flex items-center text-sm">
                <CheckCircle className="w-4 h-4 mr-1" /> Saved successfully
              </p>
            )}
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "dataSharing"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Data Sharing Preferences</DialogTitle>
          </DialogHeader>
          {DataSharingContent()}
          <DialogFooter>
            {saveSuccess && (
              <p className="text-green-500 flex items-center text-sm">
                <CheckCircle className="w-4 h-4 mr-1" /> Saved successfully
              </p>
            )}
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "security"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Security and Privacy</DialogTitle>
          </DialogHeader>
          {SecurityContent()}
          <DialogFooter>
            {saveSuccess && (
              <p className="text-green-500 flex items-center text-sm">
                <CheckCircle className="w-4 h-4 mr-1" /> Saved successfully
              </p>
            )}
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "notifications"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>
          {NotificationsContent()}
          <DialogFooter>
            {saveSuccess && (
              <p className="text-green-500 flex items-center text-sm">
                <CheckCircle className="w-4 h-4 mr-1" /> Saved successfully
              </p>
            )}
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "members"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Members</DialogTitle>
          </DialogHeader>
          {MembersContent()}
          <DialogFooter>
            {saveSuccess && (
              <p className="text-green-500 flex items-center text-sm">
                <CheckCircle className="w-4 h-4 mr-1" /> Saved successfully
              </p>
            )}
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "accessibility"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accessibility</DialogTitle>
          </DialogHeader>
          {AccessibilityContent()}
          <DialogFooter>
            {saveSuccess && (
              <p className="text-green-500 flex items-center text-sm">
                <CheckCircle className="w-4 h-4 mr-1" /> Saved successfully
              </p>
            )}
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "support"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Support</DialogTitle>
          </DialogHeader>
          {SupportContent()}
          <DialogFooter>
            {saveSuccess && (
              <p className="text-green-500 flex items-center text-sm">
                <CheckCircle className="w-4 h-4 mr-1" /> Saved successfully
              </p>
            )}
            <Button onClick={handleSave}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "household"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Household</DialogTitle>
          </DialogHeader>
          {HouseholdContent()}
          <DialogFooter>
            {saveSuccess && (
              <p className="text-green-500 flex items-center text-sm">
                <CheckCircle className="w-4 h-4 mr-1" /> Saved successfully
              </p>
            )}
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "dashboard"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dashboard</DialogTitle>
          </DialogHeader>
          {DashboardContent()}
          <DialogFooter>
            {saveSuccess && (
              <p className="text-green-500 flex items-center text-sm">
                <CheckCircle className="w-4 h-4 mr-1" /> Saved successfully
              </p>
            )}
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Member Permissions Dialog */}
      <Dialog open={manageMemberDialogOpen} onOpenChange={setManageMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Permissions</DialogTitle>
          </DialogHeader>
          {MemberPermissionsContent()}
          <DialogFooter>
            {saveSuccess && (
              <p className="text-green-500 flex items-center text-sm">
                <CheckCircle className="w-4 h-4 mr-1" /> Saved successfully
              </p>
            )}
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mobile Sheets (alternative to dialogs for smaller screens) */}
      {Object.entries({
        profilePicture: { title: "Profile Picture", content: ProfilePictureContent },
        personalInfo: { title: "Personal Information", content: PersonalInfoContent },
        dataSharing: { title: "Data Sharing Preferences", content: DataSharingContent },
        security: { title: "Security and Privacy", content: SecurityContent },
        notifications: { title: "Notifications", content: NotificationsContent },
        members: { title: "Members", content: MembersContent },
        accessibility: { title: "Accessibility", content: AccessibilityContent },
        support: { title: "Support", content: SupportContent },
        household: { title: "Household", content: HouseholdContent },
        dashboard: { title: "Dashboard", content: DashboardContent },
      }).map(([key, { title, content: Content }]) => (
        <Sheet key={key} open={activeSheet === key} onOpenChange={(open) => !open && setActiveSheet(null)}>
          <SheetContent className="sm:max-w-none md:hidden">
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <Content />
            </div>
            <SheetFooter>
              {saveSuccess && (
                <p className="text-green-500 flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-1" /> Saved successfully
                </p>
              )}
              <Button onClick={handleSave} className="w-full">
                Save Changes
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}