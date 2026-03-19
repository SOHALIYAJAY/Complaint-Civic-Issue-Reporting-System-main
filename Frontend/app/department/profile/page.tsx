"use client"

import { useState, useEffect } from "react"
import { 
  User, Camera, Shield, Lock, Mail, Phone, MapPin, Building, Calendar, Clock, 
  RefreshCw, Save, CheckCircle2, FileText, TrendingUp, Users, Award
} from "lucide-react"

interface UserProfile {
  name: string
  email: string
  phone: string
  department: string
  role: string
  address: string
  joinedDate: string
  lastLogin: string
  totalComplaints: number
  resolvedComplaints: number
  pendingComplaints: number
  performanceScore: number
}

export default function DepartmentProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    department: "",
    role: "",
    address: "",
    joinedDate: "",
    lastLogin: "",
    totalComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
    performanceScore: 0
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fallback data for immediate display
  const fallbackProfile: UserProfile = {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@civic.gov.in",
    phone: "+91 98765 43211",
    department: "Public Works Department",
    role: "Department Officer",
    address: "Sector 17, Gandhinagar, Gujarat",
    joinedDate: "2020-01-15",
    lastLogin: "2024-03-19 10:30 AM",
    totalComplaints: 127,
    resolvedComplaints: 89,
    pendingComplaints: 38,
    performanceScore: 85.3
  }

  // Initialize with fallback data immediately
  useEffect(() => {
    setProfile(fallbackProfile)
    setLoading(false)
    
    // Try to load real user data in background
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
      
      // Load user profile (you may need to create this endpoint)
      const response = await fetch(`${API_BASE}/api/user/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        setProfile({
          ...userData,
          totalComplaints: userData.total_complaints || 0,
          resolvedComplaints: userData.resolved_complaints || 0,
          pendingComplaints: userData.pending_complaints || 0,
          performanceScore: userData.performance_score || 0
        })
      }
      
    } catch (error) {
      console.log('Using fallback data due to API unavailability')
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setSaved(false)
    
    try {
      const token = localStorage.getItem('access_token')
      
      // Save user profile
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/user/update-profile/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address
        })
      })
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving profile:', error)
      setError('Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !profile.name) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600">Manage your personal information and view your performance</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Personal Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{profile.totalComplaints}</h3>
            <p className="text-gray-600 text-sm">Total Complaints</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm font-medium text-green-600">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{profile.resolvedComplaints}</h3>
            <p className="text-gray-600 text-sm">Resolved</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-orange-600">Pending</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{profile.pendingComplaints}</h3>
            <p className="text-gray-600 text-sm">In Progress</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-green-600">Excellent</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{profile.performanceScore}%</h3>
            <p className="text-gray-600 text-sm">Performance Score</p>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">Personal Information</h2>

                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-3xl">
                      {profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : "DP"}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white hover:bg-blue-700 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{profile.name}</p>
                    <p className="text-sm text-gray-500">{profile.role}</p>
                    <button className="text-sm text-blue-600 hover:underline mt-1">Change photo</button>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Building className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Department</p>
                      <p className="text-sm font-medium text-gray-900">{profile.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Joined Date</p>
                      <p className="text-sm font-medium text-gray-900">{profile.joinedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Last Login</p>
                      <p className="text-sm font-medium text-gray-900">{profile.lastLogin}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Editable Profile */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">Edit Profile</h2>

                {/* Profile Form */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50">
                      <User className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="bg-transparent text-sm outline-none w-full text-gray-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="bg-transparent text-sm outline-none w-full text-gray-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="bg-transparent text-sm outline-none w-full text-gray-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50">
                      <Building className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={profile.department}
                        disabled
                        className="bg-transparent text-sm outline-none w-full text-gray-700"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        className="bg-transparent text-sm outline-none w-full text-gray-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Role and Status */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-semibold text-blue-600">Role: {profile.role}</p>
                        <p className="text-xs text-gray-500">You have department-level access</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-600">Active</span>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-between items-center">
                  <div>
                    {error && (
                      <p className="text-sm text-red-600">{error}</p>
                    )}
                  </div>
                  
                  <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : saved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Profile
                      </>
                    )}
                  </button>
                </div>

                {/* Success Message */}
                {saved && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">Profile updated successfully!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
