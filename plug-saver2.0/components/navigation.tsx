"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Smartphone, LayoutDashboard, Award, Settings } from "lucide-react"

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/devices", label: "Devices", icon: Smartphone },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/rewards", label: "Rewards", icon: Award },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 z-50">
        <div className="flex justify-around py-3 px-4 max-w-md mx-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link key={href} href={href} className={`nav-item ${isActive ? "active" : "text-gray-400"}`}>
                <Icon className="w-6 h-6" />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-gray-900 text-white p-4">
        <h1 className="text-2xl font-bold mb-8">Plug Saver</h1>
        <div className="space-y-4">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center space-x-3 p-2 rounded-lg ${
                  isActive ? "bg-blue-600" : "hover:bg-gray-800"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

