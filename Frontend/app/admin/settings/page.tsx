"use client"

import { useState, useEffect } from "react"
import {
  User, Lock, Shield, Globe, Bell, Database, Users, Building,
  Save, Eye, EyeOff, ChevronRight, LayoutDashboard, Settings, Mail, 
  Phone, Camera, AlertTriangle, CheckCircle, Trash2, Edit, Plus,
  Activity, FileText, MapPin, Calendar, Clock, Search, Filter,
  Download, Upload, RefreshCw, X, Check, AlertCircle
} from "lucide-react"

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
]

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Password state for security tab
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Profile State
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    avatar: ""
  })

  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    siteName: "",
    siteDescription: "",
    maintenanceMode: false,
    allowRegistration: false,
    emailNotifications: true,
    smsNotifications: false,
    defaultLanguage: "en",
    timezone: "Asia/Kolkata",
    maxFileSize: 10,
    sessionTimeout: 30
  })

  // Users State
  const [users, setUsers] = useState([])
  const [searchUser, setSearchUser] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)

  // Departments State
  const [departments, setDepartments] = useState([])
  const [newDepartment, setNewDepartment] = useState({ name: "", description: "", head: "" })

  // Notifications State
  const [notifications, setNotifications] = useState({
    emailComplaints: true,
    emailResolutions: true,
    smsAlerts: false,
    pushNotifications: true,
    weeklyReports: true,
    criticalAlerts: true
  })

  // Activity Logs State
  const [logs, setLogs] = useState([])
  const [logFilter, setLogFilter] = useState("all")

  // Fetch initial data
  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/admin/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          const data = result.data
          setProfile({
            name: data.name || "Admin User",
            email: data.email || "admin@civic.gov.in",
            phone: data.phone || "+91 98765 00000",
            role: data.role || "Super Admin",
            department: data.department || "System Administration",
            avatar: data.avatar || ""
          })
          
          // Update system stats if available
          if (data.statistics) {
            setSystemStats({
              totalComplaints: data.statistics.total_complaints || 0,
              resolvedComplaints: data.statistics.resolved_complaints || 0,
              pendingComplaints: data.statistics.pending_complaints || 0,
              totalUsers: data.statistics.total_users || 0,
              activeUsers: data.statistics.active_users || 0
            })
          }
        }
      } else {
        // Set fallback data for demo
        setProfile({
          name: "Admin User",
          email: "admin@civic.gov.in",
          phone: "+91 98765 00000",
          role: "Super Admin",
          department: "System Administration",
          avatar: ""
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      // Set fallback data
      setProfile({
        name: "Admin User",
        email: "admin@civic.gov.in",
        phone: "+91 98765 00000",
        role: "Super Admin",
        department: "System Administration",
        avatar: ""
      })
    }
  }

  const fetchSystemSettings = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/admin/system-settings/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSystemSettings(data)
      }
    } catch (error) {
      console.error('Error fetching system settings:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/admin/users/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      // Set fallback data
      setUsers([
        { id: 1, name: "John Doe", email: "john@example.com", role: "Officer", department: "Sanitation", status: "active", lastLogin: "2024-03-19T10:30:00Z" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin", department: "IT", status: "active", lastLogin: "2024-03-19T09:15:00Z" },
        { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Officer", department: "Infrastructure", status: "inactive", lastLogin: "2024-03-18T16:45:00Z" }
      ])
    }
  }

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/admin/departments/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setDepartments(data.departments || [])
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
      // Set fallback data
      setDepartments([
        { id: 1, name: "Sanitation", description: "Waste management and cleaning services", head: "John Doe", activeUsers: 12 },
        { id: 2, name: "Infrastructure", description: "Road maintenance and construction", head: "Jane Smith", activeUsers: 8 },
        { id: 3, name: "Water Supply", description: "Water distribution and maintenance", head: "Mike Johnson", activeUsers: 15 }
      ])
    }
  }

  const fetchActivityLogs = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/admin/activity-logs/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs || [])
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error)
      // Set fallback data
      setLogs([
        { id: 1, user: "Admin User", action: "Updated system settings", timestamp: "2024-03-19T10:30:00Z", ip: "192.168.1.1", status: "success" },
        { id: 2, user: "John Doe", action: "Created new complaint", timestamp: "2024-03-19T09:15:00Z", ip: "192.168.1.2", status: "success" },
        { id: 3, user: "Jane Smith", action: "Failed login attempt", timestamp: "2024-03-19T08:45:00Z", ip: "192.168.1.3", status: "failed" }
      ])
    }
  }

  const handleSave = async (section: string = "all") => {
    setLoading(true)
    setError("")
    setSuccess("")
    
    try {
      const token = localStorage.getItem('access_token')
      
      if (section === "profile" || section === "all") {
        const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/admin/update-profile/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            first_name: profile.name.split(' ')[0] || '',
            last_name: profile.name.split(' ').slice(1).join(' ') || '',
            email: profile.email,
            phone: profile.phone
          })
        })
        
        if (profileResponse.ok) {
          const result = await profileResponse.json()
          if (result.success) {
            setSuccess("Profile updated successfully!")
          } else {
            setError(result.error || "Failed to update profile")
          }
        } else {
          setError("Failed to update profile")
        }
      }

      if (section === "security" || section === "all") {
        // Handle password change if needed
        if (currentPassword && newPassword) {
          const passwordResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/change-password/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              old_password: currentPassword,
              new_password: newPassword
            })
          })
          
          if (passwordResponse.ok) {
            const result = await passwordResponse.json()
            if (result.success) {
              setSuccess("Password changed successfully!")
              // Clear password fields
              setCurrentPassword("")
              setNewPassword("")
              setConfirmPassword("")
            } else {
              setError(result.error || "Failed to change password")
            }
          } else {
            setError("Failed to change password")
          }
        }
      }
      
      if (section === "system" || section === "all") {
        const systemResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/admin/system-settings/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(systemSettings)
        })
        
        if (systemResponse.ok) {
          const result = await systemResponse.json()
          if (result.success) {
            setSuccess("System settings updated successfully!")
          } else {
            setError(result.error || "Failed to update system settings")
          }
        } else {
          setError("Failed to update system settings")
        }
      }
      
    } catch (error) {
      console.error('Error saving:', error)
      setError("An error occurred while saving")
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (action, userId) => {
    try {
      const token = localStorage.getItem('access_token')
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/admin/users/${userId}/${action}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      // Refresh users list
      fetchUsers()
      setSuccess(`User ${action} successful!`)
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      console.error('Error performing user action:', error)
      setError(`Failed to ${action} user`)
    }
  }

  const handleAddDepartment = async () => {
    try {
      const token = localStorage.getItem('access_token')
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/admin/departments/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDepartment)
      })
      
      // Refresh departments list
      fetchDepartments()
      setNewDepartment({ name: "", description: "", head: "" })
      setSuccess("Department added successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      console.error('Error adding department:', error)
      setError("Failed to add department")
    }
  }

  const handleBackup = async (type) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/admin/backup/${type}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `backup-${type}-${new Date().toISOString().split('T')[0]}.sql`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        setSuccess(`${type} backup created successfully!`)
      }
    } catch (error) {
      console.error('Error creating backup:', error)
      setError("Failed to create backup")
    } finally {
      setLoading(false)
      setTimeout(() => setSuccess(""), 3000)
    }
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    user.email.toLowerCase().includes(searchUser.toLowerCase())
  )

  const filteredLogs = logs.filter(log => 
    logFilter === "all" || log.status === logFilter
  )

  return (
    <div className="p-4 lg:p-6 space-y-6 min-h-screen bg-gray-50">
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage system configuration and preferences</p>
        </div>
        <div className="flex items-center gap-3">
          {success && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm">
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm overflow-hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all border-l-4 ${
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
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1e40af] to-[#3b82f6] flex items-center justify-center text-white font-bold text-2xl">
                      {profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : "AD"}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#1e40af] rounded-full flex items-center justify-center border-2 border-white hover:bg-[#1e3a8a] transition-colors">
                      <Camera className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-800">{profile.name}</p>
                    <p className="text-sm text-slate-500">{profile.role}</p>
                    <button className="text-sm text-[#1e40af] hover:underline mt-1">Change photo</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Full Name</label>
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
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Email Address</label>
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
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Phone Number</label>
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
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Department</label>
                    <div className="flex items-center gap-2 border border-[#e2e8f0] rounded-lg px-3 py-2.5 bg-[#f8fafc]">
                      <Building className="w-4 h-4 text-slate-400" />
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

              {/* Save Button */}
              <div className="flex justify-end">
                <button 
                  onClick={() => handleSave("profile")}
                  disabled={loading}
                  className="px-6 py-2 bg-[#1e40af] text-white text-sm font-medium rounded-lg hover:bg-[#1e3a8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Profile
                    </>
                  )}
                </button>
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
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Current Password</label>
                    <div className="flex items-center gap-2 border border-[#e2e8f0] rounded-lg px-3 py-2.5 bg-[#f8fafc]">
                      <Lock className="w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="bg-transparent text-sm outline-none w-full text-slate-700 placeholder:text-slate-400"
                      />
                      <button onClick={() => setShowPassword(!showPassword)} className="p-1 hover:bg-slate-100 rounded">
                        {showPassword ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">New Password</label>
                    <div className="flex items-center gap-2 border border-[#e2e8f0] rounded-lg px-3 py-2.5 bg-[#f8fafc]">
                      <Lock className="w-4 h-4 text-slate-400" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="bg-transparent text-sm outline-none w-full text-slate-700 placeholder:text-slate-400"
                      />
                      <button onClick={() => setShowNewPassword(!showNewPassword)} className="p-1 hover:bg-slate-100 rounded">
                        {showNewPassword ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Confirm New Password</label>
                    <div className="flex items-center gap-2 border border-[#e2e8f0] rounded-lg px-3 py-2.5 bg-[#f8fafc]">
                      <Lock className="w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="bg-transparent text-sm outline-none w-full text-slate-700 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSave("security")}
                    disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                    className="px-4 py-2 bg-[#1e40af] text-white text-sm font-medium rounded-lg hover:bg-[#1e3a8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-5">
                <h2 className="text-base font-semibold text-slate-800 mb-4 pb-3 border-b border-[#e2e8f0]">Login Sessions</h2>
                <div className="space-y-3">
                  {[
                    { device: "Chrome on Windows", location: "Ahmedabad, Gujarat", time: "Active now", current: true, ip: "192.168.1.1" },
                    { device: "Firefox on Windows", location: "Surat, Gujarat", time: "2 hours ago", current: false, ip: "192.168.1.2" },
                    { device: "Safari on iPhone", location: "Mumbai, Maharashtra", time: "1 day ago", current: false, ip: "192.168.1.3" },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${session.current ? "bg-green-500" : "bg-slate-300"}`} />
                        <div>
                          <p className="text-sm font-medium text-slate-800">{session.device}</p>
                          <p className="text-xs text-slate-500">{session.location} · {session.time} · {session.ip}</p>
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

              <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-5">
                <h2 className="text-base font-semibold text-slate-800 mb-4 pb-3 border-b border-[#e2e8f0]">Two-Factor Authentication</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">Enable 2FA</p>
                        <p className="text-xs text-slate-500">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-[#1e40af] text-white text-xs font-medium rounded-lg hover:bg-[#1e3a8a] transition-colors">
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SYSTEM SETTINGS TAB */}
          {activeTab === "system" && (
            <>
              <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-5">
                <h2 className="text-base font-semibold text-slate-800 mb-4 pb-3 border-b border-[#e2e8f0]">General Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Site Name</label>
                    <input
                      type="text"
                      value={systemSettings.siteName}
                      onChange={(e) => setSystemSettings({ ...systemSettings, siteName: e.target.value })}
                      className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg bg-[#f8fafc] text-sm text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Site Description</label>
                    <textarea
                      value={systemSettings.siteDescription}
                      onChange={(e) => setSystemSettings({ ...systemSettings, siteDescription: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg bg-[#f8fafc] text-sm text-slate-700"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1.5">Default Language</label>
                      <select
                        value={systemSettings.defaultLanguage}
                        onChange={(e) => setSystemSettings({ ...systemSettings, defaultLanguage: e.target.value })}
                        className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg bg-[#f8fafc] text-sm text-slate-700"
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="gu">Gujarati</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1.5">Timezone</label>
                      <select
                        value={systemSettings.timezone}
                        onChange={(e) => setSystemSettings({ ...systemSettings, timezone: e.target.value })}
                        className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg bg-[#f8fafc] text-sm text-slate-700"
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata</option>
                        <option value="Asia/Dubai">Asia/Dubai</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-5">
                <h2 className="text-base font-semibold text-slate-800 mb-4 pb-3 border-b border-[#e2e8f0]">System Configuration</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Maintenance Mode</p>
                      <p className="text-xs text-slate-500">Temporarily disable the system for maintenance</p>
                    </div>
                    <button
                      onClick={() => setSystemSettings({ ...systemSettings, maintenanceMode: !systemSettings.maintenanceMode })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        systemSettings.maintenanceMode ? 'bg-red-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          systemSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Allow User Registration</p>
                      <p className="text-xs text-slate-500">Let new users register on the platform</p>
                    </div>
                    <button
                      onClick={() => setSystemSettings({ ...systemSettings, allowRegistration: !systemSettings.allowRegistration })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        systemSettings.allowRegistration ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          systemSettings.allowRegistration ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Email Notifications</p>
                      <p className="text-xs text-slate-500">Send email notifications for system events</p>
                    </div>
                    <button
                      onClick={() => setSystemSettings({ ...systemSettings, emailNotifications: !systemSettings.emailNotifications })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        systemSettings.emailNotifications ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          systemSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-800">SMS Notifications</p>
                      <p className="text-xs text-slate-500">Send SMS notifications for critical events</p>
                    </div>
                    <button
                      onClick={() => setSystemSettings({ ...systemSettings, smsNotifications: !systemSettings.smsNotifications })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        systemSettings.smsNotifications ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          systemSettings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1.5">Max File Size (MB)</label>
                      <input
                        type="number"
                        value={systemSettings.maxFileSize}
                        onChange={(e) => setSystemSettings({ ...systemSettings, maxFileSize: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg bg-[#f8fafc] text-sm text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1.5">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        value={systemSettings.sessionTimeout}
                        onChange={(e) => setSystemSettings({ ...systemSettings, sessionTimeout: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg bg-[#f8fafc] text-sm text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* USER MANAGEMENT TAB */}
          {activeTab === "users" && (
            <>
              <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-slate-800">User Management</h2>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        className="pl-9 pr-3 py-2 border border-[#e2e8f0] rounded-lg bg-[#f8fafc] text-sm text-slate-700 w-64"
                      />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 bg-[#1e40af] text-white text-sm font-medium rounded-lg hover:bg-[#1e3a8a] transition-colors">
                      <Plus className="w-4 h-4" />
                      Add User
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#e2e8f0]">
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-600 uppercase tracking-wider">User</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-600 uppercase tracking-wider">Role</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-600 uppercase tracking-wider">Department</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-600 uppercase tracking-wider">Status</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-600 uppercase tracking-wider">Last Login</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e8f0]">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-[#f8fafc]">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1e40af] to-[#3b82f6] flex items-center justify-center text-white font-bold text-xs">
                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-800">{user.name}</p>
                                <p className="text-xs text-slate-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">{user.department}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">
                            {new Date(user.lastLogin).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button className="p-1 hover:bg-slate-100 rounded">
                                <Edit className="w-4 h-4 text-slate-400" />
                              </button>
                              <button 
                                onClick={() => handleUserAction(user.status === 'active' ? 'deactivate' : 'activate', user.id)}
                                className="p-1 hover:bg-slate-100 rounded"
                              >
                                {user.status === 'active' ? (
                                  <X className="w-4 h-4 text-red-400" />
                                ) : (
                                  <Check className="w-4 h-4 text-green-400" />
                                )}
                              </button>
                              <button className="p-1 hover:bg-slate-100 rounded">
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* DEPARTMENTS TAB */}
          {activeTab === "departments" && (
            <>
              <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-slate-800">Department Management</h2>
                  <button className="flex items-center gap-2 px-3 py-2 bg-[#1e40af] text-white text-sm font-medium rounded-lg hover:bg-[#1e3a8a] transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Department
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departments.map((dept) => (
                    <div key={dept.id} className="border border-[#e2e8f0] rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-800">{dept.name}</h3>
                          <p className="text-xs text-slate-500 mt-1">{dept.description}</p>
                        </div>
                        <button className="p-1 hover:bg-slate-100 rounded">
                          <Edit className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Head: {dept.head}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {dept.activeUsers} users
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-5">
                <h3 className="text-base font-semibold text-slate-800 mb-4">Add New Department</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Department Name</label>
                    <input
                      type="text"
                      value={newDepartment.name}
                      onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                      className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg bg-[#f8fafc] text-sm text-slate-700"
                      placeholder="Enter department name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Description</label>
                    <textarea
                      value={newDepartment.description}
                      onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg bg-[#f8fafc] text-sm text-slate-700"
                      placeholder="Enter department description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Department Head</label>
                    <input
                      type="text"
                      value={newDepartment.head}
                      onChange={(e) => setNewDepartment({ ...newDepartment, head: e.target.value })}
                      className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg bg-[#f8fafc] text-sm text-slate-700"
                      placeholder="Enter department head name"
                    />
                  </div>
                  <button
                    onClick={handleAddDepartment}
                    className="px-4 py-2 bg-[#1e40af] text-white text-sm font-medium rounded-lg hover:bg-[#1e3a8a] transition-colors"
                  >
                    Add Department
                  </button>
                </div>
              </div>
            </>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <>
              <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-5">
                <h2 className="text-base font-semibold text-slate-800 mb-4 pb-3 border-b border-[#e2e8f0]">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Email Notifications for New Complaints</p>
                      <p className="text-xs text-slate-500">Receive email when a new complaint is submitted</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, emailComplaints: !notifications.emailComplaints })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.emailComplaints ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.emailComplaints ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Email Notifications for Resolutions</p>
                      <p className="text-xs text-slate-500">Receive email when a complaint is resolved</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, emailResolutions: !notifications.emailResolutions })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.emailResolutions ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.emailResolutions ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-800">SMS Alerts</p>
                      <p className="text-xs text-slate-500">Receive SMS alerts for critical issues</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, smsAlerts: !notifications.smsAlerts })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.smsAlerts ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.smsAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Push Notifications</p>
                      <p className="text-xs text-slate-500">Receive push notifications in browser</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, pushNotifications: !notifications.pushNotifications })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.pushNotifications ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Weekly Reports</p>
                      <p className="text-xs text-slate-500">Receive weekly summary reports</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, weeklyReports: !notifications.weeklyReports })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.weeklyReports ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Critical Alerts</p>
                      <p className="text-xs text-slate-500">Immediate alerts for critical system issues</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, criticalAlerts: !notifications.criticalAlerts })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.criticalAlerts ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.criticalAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ACTIVITY LOGS TAB */}
          {activeTab === "logs" && (
            <>
              <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-slate-800">Activity Logs</h2>
                  <div className="flex items-center gap-3">
                    <select
                      value={logFilter}
                      onChange={(e) => setLogFilter(e.target.value)}
                      className="px-3 py-2 border border-[#e2e8f0] rounded-lg bg-[#f8fafc] text-sm text-slate-700"
                    >
                      <option value="all">All Logs</option>
                      <option value="success">Success</option>
                      <option value="failed">Failed</option>
                    </select>
                    <button className="flex items-center gap-2 px-3 py-2 bg-[#1e40af] text-white text-sm font-medium rounded-lg hover:bg-[#1e3a8a] transition-colors">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          log.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <p className="text-sm font-medium text-slate-800">{log.user}</p>
                          <p className="text-xs text-slate-500">{log.action}</p>
                          <p className="text-xs text-slate-400">{log.ip} · {new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        log.status === 'success' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* BACKUP & RESTORE TAB */}
          {activeTab === "backup" && (
            <>
              <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-5">
                <h2 className="text-base font-semibold text-slate-800 mb-4 pb-3 border-b border-[#e2e8f0]">Backup & Restore</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-slate-800 mb-3">Create Backup</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => handleBackup('database')}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                      >
                        <Database className="w-4 h-4" />
                        {loading ? 'Creating...' : 'Database Backup'}
                      </button>
                      <button
                        onClick={() => handleBackup('files')}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        <FileText className="w-4 h-4" />
                        {loading ? 'Creating...' : 'Files Backup'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-800 mb-3">Restore Backup</h3>
                    <div className="border-2 border-dashed border-[#e2e8f0] rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                      <p className="text-sm text-slate-600 mb-2">Upload backup file to restore</p>
                      <button className="px-4 py-2 bg-[#1e40af] text-white text-sm font-medium rounded-lg hover:bg-[#1e3a8a] transition-colors">
                        Choose File
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-800 mb-3">Recent Backups</h3>
                    <div className="space-y-2">
                      {[
                        { name: 'database-backup-2024-03-19.sql', size: '2.5 MB', date: '2024-03-19 10:30 AM', type: 'database' },
                        { name: 'files-backup-2024-03-18.zip', size: '15.2 MB', date: '2024-03-18 09:15 AM', type: 'files' },
                        { name: 'database-backup-2024-03-17.sql', size: '2.4 MB', date: '2024-03-17 08:45 AM', type: 'database' },
                      ].map((backup, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                          <div className="flex items-center gap-3">
                            <Database className="w-4 h-4 text-slate-400" />
                            <div>
                              <p className="text-sm font-medium text-slate-800">{backup.name}</p>
                              <p className="text-xs text-slate-500">{backup.size} · {backup.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-slate-100 rounded">
                              <Download className="w-4 h-4 text-slate-400" />
                            </button>
                            <button className="p-1 hover:bg-slate-100 rounded">
                              <RefreshCw className="w-4 h-4 text-slate-400" />
                            </button>
                            <button className="p-1 hover:bg-slate-100 rounded">
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
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
