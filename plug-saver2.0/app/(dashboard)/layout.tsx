import type React from "react"
import { Navigation } from "@/components/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 pb-20 md:pb-0 md:pl-64">{children}</main>
    </div>
  )
}

