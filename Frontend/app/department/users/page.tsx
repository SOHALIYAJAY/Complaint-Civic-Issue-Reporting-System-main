'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, MoreVertical, Edit, Eye, UserPlus, Shield, AlertCircle, Users, TrendingUp, Activity, RefreshCw, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: string
  is_active: boolean
  date_joined: string
  last_login?: string
  complaint_count?: number
}

interface RoleData {
  name: string
  value: number
  color: string
}

interface MonthlyData {
  month: string
  users: number
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'user',
    password: ''
  })
  const router = useRouter()

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

  // Analytics data
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalComplaints: 0,
    roleDistribution: [] as RoleData[],
    monthlyRegistrations: [] as MonthlyData[]
  })

  useEffect(() => {
    processAnalytics()
  }, [])

  const fetchMonthlyRegistrations = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      
      if (token && token !== 'undefined' && token !== 'null') {
        headers['Authorization'] = `Bearer ${token}`
      }

      // Try to fetch from the monthly registrations API endpoint
      const response = await fetch(`${API_BASE}/api/admin/monthly-registrations/`, { headers })
      
      if (response.ok) {
        const responseData = await response.json()
        console.log('Monthly registrations data:', responseData)
        
        // Handle different response formats
        let monthlyData = []
        if (Array.isArray(responseData)) {
          monthlyData = responseData
        } else if (responseData.data && Array.isArray(responseData.data)) {
          monthlyData = responseData.data
        } else if (responseData.results && Array.isArray(responseData.results)) {
          monthlyData = responseData.results
        } else if (responseData.monthly_data && Array.isArray(responseData.monthly_data)) {
          monthlyData = responseData.monthly_data
        } else {
          // Fallback: process from users data if API doesn't have specific endpoint
          return null
        }
        
        // Transform data to ensure proper format
        return monthlyData.map((item: any) => ({
          month: item.month || item.name || 'Unknown',
          users: parseInt(item.users || item.count || item.registrations || 0)
        }))
      }
    } catch (error) {
      console.error('Error fetching monthly registrations:', error)
    }
    
    return null
  }

  const processAnalytics = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('access_token')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      
      if (token && token !== 'undefined' && token !== 'null') {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_BASE}/api/users/`, { headers })
      
      if (response.ok) {
        const responseData = await response.json()
        console.log('Raw response data:', responseData)
        
        // Handle different response formats
        let users = []
        if (responseData.results) {
          users = responseData.results
        } else if (responseData.data) {
          users = responseData.data
        } else if (Array.isArray(responseData)) {
          users = responseData
        } else {
          users = []
        }
        
        // Add missing fields with defaults
        const processedUsers = users.map((user: any) => ({
          id: user.id || 0,
          username: user.username || user.email || '',
          email: user.email || '',
          first_name: user.first_name || user.first_name || '',
          last_name: user.last_name || user.last_name || '',
          role: user.role || 'user',
          is_active: user.is_active !== undefined ? user.is_active : true,
          date_joined: user.date_joined || user.created_at || new Date().toISOString(),
          last_login: user.last_login,
          complaint_count: user.complaint_count || 0
        }))
        
        console.log('Processed users:', processedUsers)
        setUsers(processedUsers)

        // Calculate analytics
        const totalUsers = processedUsers.length
        const activeUsers = processedUsers.filter(u => u.is_active).length
        const inactiveUsers = totalUsers - activeUsers
        const totalComplaints = processedUsers.reduce((sum, u) => sum + (u.complaint_count || 0), 0)

        // Role distribution
        const roleCounts = processedUsers.reduce((acc, user) => {
          const role = user.role || 'Unknown'
          acc[role] = (acc[role] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        const roleDistribution = Object.entries(roleCounts).map(([name, value]) => ({
          name: name.replace('-', ' '),
          value,
          color: name === 'Admin User' ? '#ef4444' : name === 'Civic User' ? '#8b5cf6' : '#10b981'
        }))

        // Try to fetch monthly registrations from database
        let monthlyRegistrations = await fetchMonthlyRegistrations()
        
        // If API doesn't have monthly data, calculate from users
        if (!monthlyRegistrations) {
          monthlyRegistrations = calculateMonthlyFromUsers(processedUsers)
        }

        setAnalyticsData({
          totalUsers,
          activeUsers,
          inactiveUsers,
          totalComplaints,
          roleDistribution,
          monthlyRegistrations
        })
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      // Set fallback data
      const fallbackUsers = [
        {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin',
          is_active: true,
          date_joined: '2024-01-01',
          last_login: '2024-12-01',
          complaint_count: 0
        }
      ]
      setUsers(fallbackUsers)
    } finally {
      setLoading(false)
    }
  }

  const calculateMonthlyFromUsers = (users: User[]) => {
    // Calculate monthly registrations from user join dates
    const monthlyCounts: Record<string, number> = {}
    
    // Initialize all months with 0
    const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    allMonths.forEach(month => {
      monthlyCounts[month] = 0
    })
    
    users.forEach(user => {
      if (user.date_joined) {
        try {
          const joinDate = new Date(user.date_joined)
          if (!isNaN(joinDate.getTime())) {
            const monthName = joinDate.toLocaleString('default', { month: 'short' })
            if (monthlyCounts.hasOwnProperty(monthName)) {
              monthlyCounts[monthName]++
            }
          }
        } catch (error) {
          console.error('Error parsing date:', user.date_joined, error)
        }
      }
    })
    
    return Object.entries(monthlyCounts).map(([month, users]) => ({
      month,
      users
    }))
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || 
                        (statusFilter === 'active' && user.is_active) ||
                        (statusFilter === 'inactive' && !user.is_active)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleCreateUser = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      
      if (token && token !== 'undefined' && token !== 'null') {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_BASE}/api/users/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(newUser)
      })

      if (response.ok) {
        const responseData = await response.json()
        const createdUser = responseData.data || responseData
        
        // Add the new user to the list
        setUsers([...users, createdUser])
        setShowCreateModal(false)
        setNewUser({
          username: '',
          email: '',
          first_name: '',
          last_name: '',
          role: 'user',
          password: ''
        })
        
        // Show success message
        alert('User created successfully!')
      } else {
        const errorData = await response.json()
        console.error('Failed to create user:', errorData)
        alert('Failed to create user. Please check the console for details.')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Error creating user. Please try again.')
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      const token = localStorage.getItem('access_token')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      
      if (token && token !== 'undefined' && token !== 'null') {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_BASE}/api/users/${userId}/`, {
        method: 'DELETE',
        headers
      })

      if (response.ok) {
        // Remove the deleted user from the list
        setUsers(users.filter(user => user.id !== userId))
        alert('User deleted successfully!')
      } else {
        const errorData = await response.json()
        console.error('Failed to delete user:', errorData)
        alert('Failed to delete user. Please check the console for details.')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error deleting user. Please try again.')
    }
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return

    try {
      const token = localStorage.getItem('access_token')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      
      if (token && token !== 'undefined' && token !== 'null') {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_BASE}/api/users/${editingUser.id}/`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(editingUser)
      })

      if (response.ok) {
        const responseData = await response.json()
        const updatedUser = responseData.data || responseData
        
        // Update the user in the list
        setUsers(users.map(user => 
          user.id === editingUser.id ? { ...user, ...updatedUser } : user
        ))
        setShowEditModal(false)
        setEditingUser(null)
        
        // Show success message
        alert('User updated successfully!')
      } else {
        const errorData = await response.json()
        console.error('Failed to update user:', errorData)
        alert('Failed to update user. Please check the console for details.')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error updating user. Please try again.')
    }
  }

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200'
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'officer':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'civic user':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage system users and permissions</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={processAnalytics}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalUsers}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{analyticsData.activeUsers}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive Users</p>
              <p className="text-2xl font-bold text-red-600">{analyticsData.inactiveUsers}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Complaints</p>
              <p className="text-2xl font-bold text-orange-600">{analyticsData.totalComplaints}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        {/* Monthly Registrations Bar Chart - Full Width */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly User Registrations</h3>
            <p className="text-sm text-gray-500">New user registrations per month</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.monthlyRegistrations}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickLine={{ stroke: '#e5e7eb' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                />
                <Bar 
                  dataKey="users" 
                  fill="#3b82f6" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Role Distribution Pie Chart - Below Bar Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Role Distribution</h3>
            <p className="text-sm text-gray-500">Distribution of users by role</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.roleDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {analyticsData.roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any, name: any) => [`${value} users`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-2">
            {analyticsData.roleDistribution.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-gray-700">{entry.name}</span>
                </div>
                <span className="font-medium text-gray-900">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users by name, email, or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="officer">Officer</option>
              <option value="user">User</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaints</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <span className="text-xs font-medium text-gray-600">
                            {user.first_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                        <Shield className="w-3 h-3 mr-1" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(user.is_active)}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.date_joined).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.complaint_count || 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingUser(user)
                            setShowEditModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={newUser.first_name}
                    onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={newUser.last_name}
                    onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="user">User</option>
                  <option value="officer">Officer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={editingUser.first_name}
                    onChange={(e) => setEditingUser({ ...editingUser, first_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editingUser.last_name}
                    onChange={(e) => setEditingUser({ ...editingUser, last_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="user">User</option>
                  <option value="officer">Officer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingUser.is_active}
                    onChange={(e) => setEditingUser({ ...editingUser, is_active: e.target.checked })}
                    className="rounded border-gray-300 mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
