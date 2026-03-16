'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Bell, Search, LogOut, Settings, LayoutDashboard, FileText, Users, Building2, UserCog, Tag, AlertTriangle } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin', group: 'Main' },
    { icon: FileText, label: 'All Complaints', path: '/admin/complaints', group: 'Management' },
    // 'Assign Complaints' removed to hide assignment page from admin UI
    { icon: Building2, label: 'Departments', path: '/admin/departments', group: 'Organization' },
    { icon: UserCog, label: 'Officers', path: '/admin/officers', group: 'Organization' },
    { icon: Users, label: 'Users', path: '/admin/users', group: 'Organization' },
    { icon: Tag, label: 'Categories', path: '/admin/categories', group: 'Configuration' },
    { icon: Settings, label: 'Settings', path: '/admin/settings', group: 'Configuration' },
  ]

  // Group menu items
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    const group = acc.find(g => g.name === item.group)
    if (group) {
      group.items.push(item)
    } else {
      acc.push({ name: item.group, items: [item] })
    }
    return acc
  }, [] as any[])

  return (
    <div className="flex h-screen bg-slate-100">
      {/* SIDEBAR */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-slate-200 transition-all duration-300 flex flex-col overflow-y-auto shadow-sm`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-b from-blue-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-lg font-bold text-blue-900">CivicTrack</h1>
                <p className="text-xs text-blue-600">Admin Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {groupedMenuItems.map((group) => (
            <div key={group.name}>
              {sidebarOpen && (
                <p className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">{group.name}</p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.path
                  return (
                    <button
                      key={item.path}
                      onClick={() => router.push(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-700'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarOpen && <span className="text-sm">{item.label}</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 space-y-1">
          <button onClick={() => router.push('/admin/settings')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 transition-all">
            <Settings className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm">Settings</span>}
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 transition-all">
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="bg-white border-b border-slate-200 shadow-sm z-10 sticky top-0">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent text-sm outline-none w-64 text-slate-700 placeholder:text-slate-400"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-semibold text-sm">
                  AD
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-slate-800">Admin</p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
