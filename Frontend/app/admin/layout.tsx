'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Search, LogOut, Settings, LayoutDashboard, FileText, Users, Building2, UserCog, Tag, Home } from 'lucide-react'
import RequireAuth from '@/components/auth/RequireAuth'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    { icon: Home, label: 'Home', path: '/', group: 'Navigation' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin', group: 'Main' },
    { icon: FileText, label: 'All Complaints', path: '/admin/complaints', group: 'Management' },
    // 'Assign Complaints' removed to hide assignment page from admin UI
    // { icon: Building2, label: 'Departments', path: '/admin/departments', group: 'Organization' },
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
    <RequireAuth role="Admin-User">
      <div className="flex h-screen bg-[#F8FAFC]">
      {/* SIDEBAR */}
      <div
        className={`${
          sidebarOpen ? 'w-52' : 'w-16'
        } bg-primary text-primary-foreground transition-all duration-300 flex flex-col overflow-y-auto shadow-sm`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-primary-foreground/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-sm font-bold text-primary-foreground">CivicTrack</h1>
                <p className="text-xs text-primary-foreground/70">Admin Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-2 space-y-3 overflow-y-auto">
          {groupedMenuItems.map((group) => (
            <div key={group.name}>
              {sidebarOpen && (
                <p className="px-3 py-1 text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider">{group.name}</p>
              )}
              <div className="space-y-1">
                {group.items.map((item: any) => {
                  const Icon = item.icon
                  const isActive = pathname === item.path
                  return (
                    <button
                      key={item.path}
                      onClick={() => router.push(item.path)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all relative text-xs ${
                        isActive
                          ? 'bg-primary-foreground/20 text-primary-foreground font-semibold'
                          : 'text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground'
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary-foreground' : 'text-primary-foreground/70'}`} />
                      {sidebarOpen && <span className="text-xs">{item.label}</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-primary-foreground/20">
          <button 
            onClick={() => router.push('/admin/logout')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/20 transition-all font-medium"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="bg-white border-b border-[#E2E8F0] shadow-sm z-10 sticky top-0">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5 text-[#64748B]" /> : <Menu className="w-5 h-5 text-[#64748B]" />}
              </button>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 bg-[#F8FAFC] px-4 py-2 rounded-lg border border-[#E2E8F0]">
                <Search className="w-4 h-4 text-[#64748B]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent text-sm outline-none w-64 text-[#1E293B] placeholder:text-[#64748B]"
                />
              </div>



              {/* Profile */}
              <button 
                onClick={() => router.push('/admin/settings')}
                className="flex items-center gap-3 pl-4 border-l border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-semibold text-sm">
                  AD
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-[#1E293B]">Admin</p>
                  <p className="text-xs text-[#64748B]">Administrator</p>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          {children}
        </main>
      </div>
      </div>
    </RequireAuth>
  )
}
