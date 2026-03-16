"use client"

import { useState } from "react"
import {
  User, Lock, Bell, Shield, Database, Globe,
  Save, Eye, EyeOff, ChevronRight, LayoutDashboard,
  Settings, Mail, Phone, Camera, AlertTriangle, CheckCircle
} from "lucide-react"

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "system", label: "System", icon: Database },
]

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [saved, setSaved] = useState(false)

  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@civic.gov.in",
    phone: "+91 98765 00000",
    role: "Super Administrator",
    department: "IT & Administration",
  })

  const [notifications, setNotifications] = useState({
    newComplaint: true,
    complaintResolved: true,
    officerAssigned: false,
    weeklyReport: true,
    systemAlerts: true,
    emailDigest: false,
  })

  const [system, setSystem] = useState({
    maintenanceMode: false,
    allowRegistration: true,
    autoAssign: false,
    slaAlerts: true,
    defaultSla: "72",
    maxFileSize: "10",
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <LayoutDashboard className="w-4 h-4" />
        <span>Dashboard</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#1e40af] font-medium flex items-center gap-1.5">
          <Settings className="w-4 h-4" />
          Settings
        </span>
      </div>

      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your account and system preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-[#1e40af] text-white text-sm font-medium rounded-lg hover:bg-[#1e3a8a] transition-colors"
        >
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm overflow-hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all border-l-4 ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-[#1e40af] border-[#1e40af]"
                      : "text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5">

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <>
              <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-5">
                <h2 className="text-base font-semibold text-slate-800 mb-4 pb-3 border-b border-[#e2e8f0]">Profile Information</h2>

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1e40af] to-[#3b82f6] flex items-center justify-center text-white font-bold text-xl">
                      AD
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#1e40af] rounded-full flex items-center justify-center border-2 border-white">
                      <Camera className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{profile.name}</p>
                    <p className="text-xs text-slate-500">{profile.role}</p>
                    <button className="text-xs text-[#1e40af] hover:underline mt-1">Change photo</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Full Name</label>
                    <div className="flex items-center gap-2 border border-[#e2e8f0] rounded-lg px-3 py-2.5 bg-[#f8fafc]">
                      <User className="w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="bg-transparent text-sm outline-none w-full text-slate-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Email Address</label>
                    <div className="flex items-center gap-2 border border-[#e2e8f0] rounded-lg px-3 py-2.5 bg-[#f8fafc]">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="bg-transparent text-sm outline-none w-full text-slate-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Phone Number</label>
                    <div className="flex items-center gap-2 border border-[#e2e8f0] rounded-lg px-3 py-2.5 bg-[#f8fafc]">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="bg-transparent text-sm outline-none w-full text-slate-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Department</label>
                    <div className="flex items-center gap-2 border border-[#e2e8f0] rounded-lg px-3 py-2.5 bg-[#f8fafc]">
                      <Globe className="w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={profile.department}
                        onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                        className="bg-transparent text-sm outline-none w-full text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Badge */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#1e40af]" />
                <div>
                  <p className="text-sm font-semibold text-[#1e40af]">Role: {profile.role}</p>
                  <p className="text-xs text-slate-500">You have full access to all admin features</p>
                </div>
              </div>
            </>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <>
              <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-5">
                <h2 className="text-base font-semibold text-slate-800 mb-4 pb-3 border-b border-[#e2e8f0]">Change Password</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Current Password</label>
                    <div className="flex items-center gap-2 border border-[#e2e8f0] rounded-lg px-3 py-2.5 bg-[#f8fafc]">
                      <Lock className="w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        className="bg-transparent text-sm outline-none w-full text-slate-700 placeholder:text-slate-400"
                      />
                      <button onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">New Password</label>
                    <div className="flex items-center gap-2 border border-[#e2e8f0] rounded-lg px-3 py-2.5 bg-[#f8fafc]">
                      <Lock className="w-4 h-4 text-slate-400" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        className="bg-transparent text-sm outline-none w-full text-slate-700 placeholder:text-slate-400"
                      />
                      <button onClick={() => setShowNewPassword(!showNewPassword)}>
                        {showNewPassword ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Confirm New Password</label>
                    <div className="flex items-center gap-2 border border-[#e2e8f0] rounded-lg px-3 py-2.5 bg-[#f8fafc]">
                      <Lock className="w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="bg-transparent text-sm outline-none w-full text-slate-700 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#1e40af] text-white text-sm font-medium rounded-lg hover:bg-[#1e3a8a] transition-colors">
                    Update Password
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-5">
                <h2 className="text-base font-semibold text-slate-800 mb-4 pb-3 border-b border-[#e2e8f0]">Login Sessions</h2>
                <div className="space-y-3">
                  {[
                    { device: "Chrome on Windows", location: "Ahmedabad, Gujarat", time: "Active now", current: true },
                    { device: "Firefox on Windows", location: "Surat, Gujarat", time: "2 hours ago", current: false },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${session.current ? "bg-green-500" : "bg-slate-300"}`} />
                        <div>
                          <p className="text-sm font-medium text-slate-800">{session.device}</p>
                          <p className="text-xs text-slate-500">{session.location} · {session.time}</p>
                        </div>
                      </div>
                      {!session.current && (
                        <button className="text-xs text-red-500 hover:text-red-700 font-medium">Revoke</button>
                      )}
                      {session.current && (
                        <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">Current</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-5">
              <h2 className="text-base font-semibold text-slate-800 mb-4 pb-3 border-b border-[#e2e8f0]">Notification Preferences</h2>
              <div className="space-y-1">
                {[
                  { key: "newComplaint", label: "New Complaint Submitted", desc: "Get notified when a new complaint is raised" },
                  { key: "complaintResolved", label: "Complaint Resolved", desc: "Get notified when a complaint is marked resolved" },
                  { key: "officerAssigned", label: "Officer Assigned", desc: "Get notified when an officer is assigned" },
                  { key: "weeklyReport", label: "Weekly Summary Report", desc: "Receive weekly performance summary" },
                  { key: "systemAlerts", label: "System Alerts", desc: "Critical system and security alerts" },
                  { key: "emailDigest", label: "Email Digest", desc: "Daily email digest of all activities" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3.5 rounded-lg hover:bg-[#f8fafc] transition-colors">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        notifications[item.key as keyof typeof notifications] ? "bg-[#1e40af]" : "bg-slate-200"
                      }`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        notifications[item.key as keyof typeof notifications] ? "translate-x-5" : "translate-x-0.5"
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SYSTEM TAB */}
          {activeTab === "system" && (
            <>
              <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-5">
                <h2 className="text-base font-semibold text-slate-800 mb-4 pb-3 border-b border-[#e2e8f0]">System Configuration</h2>
                <div className="space-y-1">
                  {[
                    { key: "maintenanceMode", label: "Maintenance Mode", desc: "Temporarily disable public access to the portal" },
                    { key: "allowRegistration", label: "Allow User Registration", desc: "Allow new civic users to register" },
                    { key: "autoAssign", label: "Auto-Assign Complaints", desc: "Automatically assign complaints to available officers" },
                    { key: "slaAlerts", label: "SLA Breach Alerts", desc: "Alert when complaints exceed SLA time limits" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3.5 rounded-lg hover:bg-[#f8fafc] transition-colors">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setSystem({ ...system, [item.key]: !system[item.key as keyof typeof system] })}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          system[item.key as keyof typeof system] ? "bg-[#1e40af]" : "bg-slate-200"
                        }`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          system[item.key as keyof typeof system] ? "translate-x-5" : "translate-x-0.5"
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-5">
                <h2 className="text-base font-semibold text-slate-800 mb-4 pb-3 border-b border-[#e2e8f0]">Default Values</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Default SLA (hours)</label>
                    <input
                      type="number"
                      value={system.defaultSla}
                      onChange={(e) => setSystem({ ...system, defaultSla: e.target.value })}
                      className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm bg-[#f8fafc] text-slate-700 outline-none focus:ring-2 focus:ring-[#1e40af]/20 focus:border-[#3b82f6]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Max File Upload Size (MB)</label>
                    <input
                      type="number"
                      value={system.maxFileSize}
                      onChange={(e) => setSystem({ ...system, maxFileSize: e.target.value })}
                      className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm bg-[#f8fafc] text-slate-700 outline-none focus:ring-2 focus:ring-[#1e40af]/20 focus:border-[#3b82f6]"
                    />
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <h2 className="text-sm font-semibold text-red-700">Danger Zone</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-100">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Clear All Complaints</p>
                      <p className="text-xs text-slate-500">Permanently delete all complaint records</p>
                    </div>
                    <button className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                      Clear Data
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-100">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Reset System Settings</p>
                      <p className="text-xs text-slate-500">Reset all settings to factory defaults</p>
                    </div>
                    <button className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
