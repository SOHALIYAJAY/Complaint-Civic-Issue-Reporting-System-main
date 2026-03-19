 "use client"

 import { useState } from "react"
 import { usePathname, useRouter } from "next/navigation"
 import {
   Menu,
   X,
   Search,
   LogOut,
   LayoutDashboard,
   FileText,
   Users,
   User,
   ChevronLeft,
   ChevronRight,
   Home,
 } from "lucide-react"
 import RequireAuth from '@/components/auth/RequireAuth'

const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/department" },
  { icon: FileText, label: "Assigned Complaints", path: "/department/assigned" },
  { icon: Users, label: "Officers", path: "/department/officers" },
  { icon: Users, label: "Users", path: "/department/users" },
  { icon: User, label: "Profile", path: "/department/profile" },
]

export default function DepartmentLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const pathname = usePathname()
  const router = useRouter()

  return (
    <RequireAuth role="Department-User">
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 lg:static lg:z-auto
          ${sidebarOpen ? "w-52" : "w-1"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          bg-primary text-primary-foreground transition-all duration-300 flex flex-col shadow-sm
        `}
      >
        {/* Logo area */}
        <div className="h-16 flex items-center border-b border-primary-foreground/20 px-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-primary-foreground truncate">CivicTrack</h1>
                <p className="text-xs text-primary-foreground/70 truncate">Dept Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => {
                  router.push(item.path)
                  setMobileOpen(false)
                }}
                title={!sidebarOpen ? item.label : undefined}
                className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg transition-all text-xs relative ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground font-semibold"
                    : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary-foreground' : 'text-primary-foreground/70'}`} />
                {sidebarOpen && <span className="text-xs">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="px-2 py-2 border-t border-primary-foreground/20">
          <button
            onClick={() => router.push("/department/logout")}
            className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-red-400 hover:bg-red-400/20 transition-all font-medium text-xs"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span className="text-xs">Logout</span>}
          </button>
        </div>

        {/* Collapse toggle (desktop) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-[#E2E8F0] rounded-full items-center justify-center shadow-sm hover:bg-[#F8FAFC] transition-colors"
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-3.5 h-3.5 text-[#64748B]" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
          )}
        </button>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top header */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] shadow-sm flex items-center justify-between px-4 lg:px-6 z-10">
          <div className="flex items-center gap-3">
            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5 text-[#64748B]" /> : <Menu className="w-5 h-5 text-[#64748B]" />}
            </button>
            <div className="hidden sm:block">
              <h2 className="text-base font-semibold text-[#1E293B]">Public Works Department</h2>
              <p className="text-xs text-[#64748B]">Department Operations Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search bar */}
            <div className="hidden md:flex items-center gap-2 bg-[#F8FAFC] px-3 py-2 rounded-lg border border-[#E2E8F0]">
              <Search className="w-4 h-4 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-sm outline-none w-52 text-[#1E293B] placeholder:text-[#64748B]"
              />
            </div>



            {/* Profile */}
            <button className="flex items-center gap-3 pl-3 border-l border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
              <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-semibold text-sm">
                PW
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-[#1E293B]">Dept. Officer</p>
                <p className="text-xs text-[#64748B]">Public Works</p>
              </div>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">{children}</main>
      </div>
    </div>
    </RequireAuth>
  )
}
