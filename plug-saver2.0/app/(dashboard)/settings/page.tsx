import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="min-h-screen p-6" style={{ background: "var(--gradient-settings)" }}>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Card className="gradient-card mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium">Username</h2>
            <p className="text-sm text-gray-300">Personal Information</p>
            <p className="text-sm font-medium mt-1">Household Manager</p>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-medium text-purple-300 mb-4">Profile</h2>
          <div className="space-y-2">
            {[
              { icon: User, label: "Profile Picture" },
              { icon: Info, label: "Personal Information" },
              { icon: Share2, label: "Data Sharing Preferences" },
            ].map(({ icon: Icon, label }) => (
              <Card key={label} className="gradient-card">
                <button className="w-full flex items-center justify-between p-2">
                  <div className="flex items-center gap-4">
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-medium text-purple-300 mb-4">Account and App</h2>
          <div className="space-y-2">
            {[
              { icon: Shield, label: "Security and Privacy" },
              { icon: Bell, label: "Notifications" },
              { icon: Users, label: "Members" },
              { icon: Accessibility, label: "Accessibility" },
              { icon: Home, label: "Household" },
              { icon: LayoutDashboard, label: "Dashboard" },
            ].map(({ icon: Icon, label }) => (
              <Card key={label} className="gradient-card">
                <button className="w-full flex items-center justify-between p-2">
                  <div className="flex items-center gap-4">
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </Card>
            ))}
          </div>
        </section>

        {/* Customer Support Section */}
        <section>
          <h2 className="text-lg font-medium text-purple-300 mb-4">Support</h2>
          <Card className="gradient-card">
            <Link href="/customer-support" className="w-full flex items-center justify-between p-2">
              <div className="flex items-center gap-4">
                <HelpCircle className="w-5 h-5" />
                <span>Customer Support</span>
              </div>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </Card>
        </section>
      </div>
    </div>
  );
}
