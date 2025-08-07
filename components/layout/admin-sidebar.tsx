"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Sparkles, Bell, Calendar, X } from 'lucide-react'

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/new-arrivals", label: "New Arrivals", icon: Sparkles },
  { href: "/admin/announcements", label: "Announcements", icon: Bell },
  { href: "/admin/events", label: "Events", icon: Calendar },
]

export default function AdminSidebar({ 
  mobileOpen = false, 
  onClose 
}: { 
  mobileOpen?: boolean; 
  onClose?: () => void 
}) {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 min-h-screen bg-white border-r shadow-sm flex-col py-8 px-4 hidden md:flex">
        <div className="mb-10 text-2xl font-bold text-red-600">Admin Panel</div>
        <nav className="flex flex-col gap-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 hover:bg-red-50 hover:text-red-600 ${
                pathname.startsWith(href) ? "bg-red-100 text-red-700" : "text-gray-700"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex md:hidden" onClick={onClose}>
          <aside
            className="w-64 min-h-screen bg-white shadow-lg flex flex-col py-8 px-4 animate-slide-in-left relative"
            onClick={e => e.stopPropagation()}
          >
            <button className="absolute top-4 right-4" onClick={onClose}>
              <X className="h-6 w-6" />
            </button>
            <div className="mb-10 text-2xl font-bold text-red-600">Admin Panel</div>
            <nav className="flex flex-col gap-2">
              {links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 hover:bg-red-50 hover:text-red-600 ${
                    pathname.startsWith(href) ? "bg-red-100 text-red-700" : "text-gray-700"
                  }`}
                  onClick={onClose}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  )
}
