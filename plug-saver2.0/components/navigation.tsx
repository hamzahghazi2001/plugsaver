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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 z-50 shadow-lg">
        <div className="flex justify-around py-3 px-4 max-w-md mx-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`nav-item ${isActive ? "active" : "text-gray-300"} transition-all duration-200 hover:text-white`}
              >
                <div className={`relative p-1.5 ${isActive ? "bg-blue-500/20 rounded-lg" : ""}`}>
                  <Icon className={`w-6 h-6 ${isActive ? "text-blue-400" : ""}`} />
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full" />
                  )}
                </div>
                <span className={`text-xs ${isActive ? "font-semibold" : ""}`}>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl">
        <div className="p-6 border-b border-gray-700/50">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Plug Saver
          </h1>
          <p className="text-xs text-gray-400 mt-1">Energy Management System</p>
        </div>

        <div className="flex-1 py-6 px-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-medium px-3 mb-2">Main Navigation</p>
            <div className="space-y-1.5">
              {navItems.slice(0, 3).map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-md"
                        : "hover:bg-gray-800/70 text-gray-300 hover:text-white hover:translate-x-1"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-lg ${isActive ? "bg-blue-700" : "bg-gray-800"}`}
                    >
                      <Icon className={`w-4.5 h-4.5 ${isActive ? "text-white" : ""}`} />
                    </div>
                    <span>{label}</span>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-300"></div>}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-medium px-3 mb-2">Utilities</p>
            <div className="space-y-1.5">
              {navItems.slice(3).map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-md"
                        : "hover:bg-gray-800/70 text-gray-300 hover:text-white hover:translate-x-1"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-lg ${isActive ? "bg-blue-700" : "bg-gray-800"}`}
                    >
                      <Icon className={`w-4.5 h-4.5 ${isActive ? "text-white" : ""}`} />
                    </div>
                    <span>{label}</span>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-300"></div>}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="mt-8 mx-3">
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-xl p-4 border border-blue-700/30">
              <h3 className="font-medium text-sm text-white mb-2">Energy Tip</h3>
              <p className="text-xs text-gray-300">
                Unplug devices when not in use to save up to 10% on your electricity bill.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-700/50">
          <div className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-400">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-xs font-medium">U</span>
            </div>
            <div>
              <p className="text-gray-300">Demo User</p>
              <p className="text-xs">demo@example.com</p>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

