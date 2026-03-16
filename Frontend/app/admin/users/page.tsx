"use client"

import { useState } from 'react'
import { Users as UsersIcon, Lock, TrendingUp, FileText, AlertTriangle, Clock } from 'lucide-react'

import UsersKPI from '../../../components/admin/users/UsersKPI'
import UsersAnalytics from '../../../components/admin/users/UsersAnalytics'
import UsersFilters from '../../../components/admin/users/UsersFilters'
import UsersTable from '../../../components/admin/users/UsersTable'
import UserProfileModal from '../../../components/admin/users/UserProfileModal'
interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'Citizen' | 'Officer' | 'Department Head'
  totalComplaints: number
  openComplaints: number
  status: 'Active' | 'Blocked'
  registrationDate: string
  lastLogin: string
  avatar: string
}

interface SelectedUser {
  id: string
  name: string
  email: string
  phone: string
  address: string
  role: string
  totalComplaints: number
  openComplaints: number
  status: string
  registrationDate: string
  lastLogin: string
  complaintHistory: { month: string; count: number }[]
  activityTimeline: { date: string; action: string }[]
}

export default function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Sample user data
  const users: User[] = [
    {
      id: 'USR-001',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      phone: '9876543210',
      role: 'Citizen',
      totalComplaints: 5,
      openComplaints: 1,
      status: 'Active',
      registrationDate: '2024-01-15',
      lastLogin: '2024-02-24',
      avatar: 'RK',
    },
    {
      id: 'USR-002',
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '9876543211',
      role: 'Officer',
      totalComplaints: 0,
      openComplaints: 0,
      status: 'Active',
      registrationDate: '2023-11-20',
      lastLogin: '2024-02-25',
      avatar: 'PP',
    },
    {
      id: 'USR-003',
      name: 'Amit Singh',
      email: 'amit.singh@example.com',
      phone: '9876543212',
      role: 'Citizen',
      totalComplaints: 12,
      openComplaints: 3,
      status: 'Active',
      registrationDate: '2023-09-10',
      lastLogin: '2024-02-20',
      avatar: 'AS',
    },
    {
      id: 'USR-004',
      name: 'Neha Sharma',
      email: 'neha.sharma@example.com',
      phone: '9876543213',
      role: 'Department Head',
      totalComplaints: 0,
      openComplaints: 0,
      status: 'Active',
      registrationDate: '2023-08-05',
      lastLogin: '2024-02-25',
      avatar: 'NS',
    },
    {
      id: 'USR-005',
      name: 'Vikram Desai',
      email: 'vikram.desai@example.com',
      phone: '9876543214',
      role: 'Citizen',
      totalComplaints: 8,
      openComplaints: 2,
      status: 'Blocked',
      registrationDate: '2024-01-22',
      lastLogin: '2024-02-15',
      avatar: 'VD',
    },
    {
      id: 'USR-006',
      name: 'Mohini Gupta',
      email: 'mohini.gupta@example.com',
      phone: '9876543215',
      role: 'Citizen',
      totalComplaints: 3,
      openComplaints: 0,
      status: 'Active',
      registrationDate: '2024-02-01',
      lastLogin: '2024-02-23',
      avatar: 'MG',
    },
  ]

  // Analytics data
  const usersByDistrict = [
    { name: 'Ahmedabad', users: 450 },
    { name: 'Vadodara', users: 320 },
    { name: 'Surat', users: 380 },
    { name: 'Rajkot', users: 210 },
    { name: 'Gandhinagar', users: 160 },
    { name: 'Bhavnagar', users: 145 },
    { name: 'Jamnagar', users: 128 },
    { name: 'Junagadh', users: 95 },
    { name: 'Porbandar', users: 78 },
    { name: 'Amreli', users: 82 },
    { name: 'Surendranagar', users: 67 },
    { name: 'Botad', users: 54 },
    { name: 'Morbi', users: 89 },
    { name: 'Gir Somnath', users: 73 },
    { name: 'Devbhoomi Dwarka', users: 41 },
    { name: 'Kutch', users: 112 },
    { name: 'Patan', users: 76 },
    { name: 'Mehsana', users: 134 },
    { name: 'Sabarkantha', users: 98 },
    { name: 'Aravalli', users: 63 },
    { name: 'Mahisagar', users: 52 },
    { name: 'Kheda', users: 87 },
    { name: 'Anand', users: 103 },
    { name: 'Chhota Udepur', users: 48 },
    { name: 'Panchmahal', users: 91 },
    { name: 'Dahod', users: 71 },
    { name: 'Bharuch', users: 118 },
    { name: 'Narmada', users: 39 },
    { name: 'Tapi', users: 58 },
    { name: 'Dangs', users: 26 },
    { name: 'Navsari', users: 86 },
    { name: 'Valsad', users: 105 },
  ]

  const monthlyUsers = [
    { month: 'Jan', users: 890 },
    { month: 'Feb', users: 945 },
    { month: 'Mar', users: 1020 },
    { month: 'Apr', users: 980 },
    { month: 'May', users: 1105 },
    { month: 'Jun', users: 1180 },
    { month: 'Jul', users: 1250 },
    { month: 'Aug', users: 1320 },
    { month: 'Sep', users: 1280 },
    { month: 'Oct', users: 1350 },
    { month: 'Nov', users: 1420 },
    { month: 'Dec', users: 1480 },
  ]

  const monthlyRegistrations = [
    { month: 'Dec', registrations: 145, active: 130 },
    { month: 'Jan', registrations: 210, active: 195 },
    { month: 'Feb', registrations: 280, active: 265 },
  ]

  const complaintActivity = [
    { category: 'Citizen', avgComplaints: 4.2 },
    { category: 'Officer', avgComplaints: 0 },
    { category: 'Dept Head', avgComplaints: 0.5 },
  ]

  const userRoleDistribution = [
    { name: 'Citizen', value: 890, color: '#3b82f6' },
    { name: 'Officer', value: 120, color: '#16a34a' },
    { name: 'Dept Head', value: 34, color: '#8b5cf6' },
  ]

  // Security alerts
  const securityAlerts = [
    { id: 1, type: 'Excessive Complaints', count: 12, icon: AlertTriangle, color: 'text-red-600' },
    { id: 2, type: 'Suspicious Activity', count: 3, icon: AlertTriangle, color: 'text-orange-600' },
    { id: 3, type: 'Inactive Users (30+ days)', count: 45, icon: Clock, color: 'text-blue-600' },
  ]

  // Filter users to show only citizens
  const citizenUsers = users.filter((user) => user.role === 'Citizen')
  
  const filteredUsers = citizenUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
    if (sortBy === 'complaints') return b.totalComplaints - a.totalComplaints
    return 0
  })

  const handleViewProfile = (user: User) => {
    const selectedUserData: SelectedUser = {
      ...user,
      address: '123 Main Street, Ahmedabad, Gujarat 380001',
      complaintHistory: [
        { month: 'Dec', count: 1 },
        { month: 'Jan', count: 2 },
        { month: 'Feb', count: 2 },
      ],
      activityTimeline: [
        { date: '2024-02-24', action: 'Logged in' },
        { date: '2024-02-22', action: 'Submitted complaint #COM-1245' },
        { date: '2024-02-20', action: 'Updated profile' },
        { date: '2024-02-18', action: 'Complaint resolved' },
      ],
    }
    setSelectedUser(selectedUserData)
    setShowModal(true)
  }

  const kpiCards = [
    { label: 'Total Registered Users', value: '1,044', change: '+12%', icon: UsersIcon, color: 'bg-blue-50', borderColor: 'border-blue-500' },
    { label: 'Active Users', value: '987', change: '+8%', icon: UsersIcon, color: 'bg-green-50', borderColor: 'border-green-500' },
    { label: 'Blocked Users', value: '12', change: '+2', icon: Lock, color: 'bg-red-50', borderColor: 'border-red-500' },
    { label: 'New Users This Month', value: '145', change: '+15%', icon: TrendingUp, color: 'bg-purple-50', borderColor: 'border-purple-500' },
    { label: 'Users with Open Complaints', value: '234', change: '+5%', icon: FileText, color: 'bg-orange-50', borderColor: 'border-orange-500' },
  ]

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
              <span>Dashboard</span>
              <span>/</span>
              <span className="font-semibold">Users</span>
            </div>
            <h1 className="text-3xl font-bold text-blue-900">Users Management</h1>
            <p className="text-sm text-blue-700 mt-1">Monitor and control platform users</p>
          </div>
        </div>
      </div>

      {/* KPI Cards (component) */}
      <UsersKPI kpiCards={kpiCards} />

      {/* Analytics (component) */}
      <UsersAnalytics usersByDistrict={usersByDistrict} monthlyUsers={monthlyUsers} userRoleDistribution={userRoleDistribution} />

      {/* Filters (component) */}
      <UsersFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} statusFilter={statusFilter} setStatusFilter={setStatusFilter} sortBy={sortBy} setSortBy={setSortBy} />

      {/* Table (component) */}
      <UsersTable users={users} sortedUsers={sortedUsers} handleViewProfile={handleViewProfile} />

      {/* Modal (component) */}
      <UserProfileModal showModal={showModal} selectedUser={selectedUser} onClose={() => setShowModal(false)} />
    </div>
  )
}
