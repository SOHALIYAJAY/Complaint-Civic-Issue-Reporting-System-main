'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BarChart3, 
  RefreshCw, 
  Activity,
  Layout,
  FileText,
  UserCheck,
  Folder,
  Settings,
  Home
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { getDashboardKPIs, DashboardKPI, getUserMonthlyRegistrations } from '../../services/dashboardService'
import ComplaintStatusChart from '../../components/admin/dashboard/ComplaintStatusChart'

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [statsCards, setStatsCards] = useState<DashboardKPI[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categoryChartData, setCategoryChartData] = useState<{ name: string; value: number; color: string }[]>([])
  const [complaintStatusData, setComplaintStatusData] = useState([
    { name: 'Pending', value: 0, color: '#f59e0b' },
    { name: 'In Progress', value: 0, color: '#8b5cf6' },
    { name: 'Resolved', value: 0, color: '#16a34a' },
  ])
  const [recentComplaints, setRecentComplaints] = useState<any[]>([])
  const [rcStatusFilter, setRcStatusFilter] = useState('All')
  const [rcPriorityFilter, setRcPriorityFilter] = useState('All')
  const [rcSearch, setRcSearch] = useState('')
  const [adminStats, setAdminStats] = useState({ total_users: 0, total_categories: 0, total_officers: 0 })
  const [monthlyRegistrationsData, setMonthlyRegistrationsData] = useState<{ month: string; registrations: number; color: string }[]>([])
  const [currentTime, setCurrentTime] = useState<string>('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, href: '/admin' },
    { id: 'complaints', label: 'All Complaints', icon: FileText, href: '/admin/complaints' },
    { id: 'officers', label: 'Officers', icon: UserCheck, href: '/admin/officers' },
    { id: 'users', label: 'Users', icon: Users, href: '/admin/users' },
    { id: 'categories', label: 'Categories', icon: Folder, href: '/admin/categories' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
  ]

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

  const CATEGORY_COLORS = [
    '#3b82f6', '#16a34a', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4',
    '#f97316', '#84cc16', '#ec4899', '#14b8a6', '#a855f7', '#eab308',
  ]

  const MONTHLY_COLORS = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3',
    '#54a0ff', '#48dbfb', '#00d2d3', '#1dd1a1', '#ffc048', '#ff6348',
  ]

  const fetchKPIs = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getDashboardKPIs()
      setStatsCards(data)
      console.log('Dashboard KPIs loaded successfully:', data)
    } catch (err: any) {
      console.error('Failed to fetch dashboard KPIs:', err)
      setError('Failed to fetch dashboard data from backend')
      // Don't set empty array - let fallback data show
    } finally {
      setLoading(false)
    }
  }

  const refreshAllData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Declare and execute all fetch functions
      const fetchComplaintStatus = async () => {
        try {
          const token = localStorage.getItem('access_token')
          const isTokenValid = Boolean(token && token !== 'undefined' && token !== 'null')
          
          const headers: Record<string, string> = {
            'Content-Type': 'application/json'
          }
          
          if (isTokenValid) {
            headers['Authorization'] = `Bearer ${token}`
          }
          
          const res = await fetch(`${API_BASE}/api/admindashboardcard/`, { headers })
          
          if (!res.ok) {
            if (res.status === 401) {
              console.warn('Authentication failed for admin dashboard, using fallback')
              setComplaintStatusData([
                { name: 'Pending', value: 15, color: '#f59e0b' },
                { name: 'In Progress', value: 8, color: '#8b5cf6' },
                { name: 'Resolved', value: 32, color: '#16a34a' },
              ])
              return
            }
            throw new Error('Failed to fetch complaint status')
          }
          
          const data = await res.json()
          setComplaintStatusData([
            { name: 'Pending', value: Number(data.Pending_comp) || 0, color: '#f59e0b' },
            { name: 'In Progress', value: Number(data.inprogress_comp) || 0, color: '#8b5cf6' },
            { name: 'Resolved', value: Number(data.resolved_comp) || 0, color: '#16a34a' },
          ])
        } catch (err) {
          console.error('Failed to fetch complaint status', err)
          setComplaintStatusData([
            { name: 'Pending', value: 12, color: '#f59e0b' },
            { name: 'In Progress', value: 6, color: '#8b5cf6' },
            { name: 'Resolved', value: 28, color: '#16a34a' },
          ])
        }
      }

      const fetchRecentComplaints = async () => {
        try {
          const token = localStorage.getItem('access_token')
          const isTokenValid = Boolean(token && token !== 'undefined' && token !== 'null')
          
          const headers: Record<string, string> = {
            'Content-Type': 'application/json'
          }
          
          if (isTokenValid) {
            headers['Authorization'] = `Bearer ${token}`
          }
          
          const res = await fetch(`${API_BASE}/api/getcomplaint/`, { headers })
          
          
          const data = await res.json()
          setRecentComplaints(Array.isArray(data) ? data : [])
        } catch (err) {
          console.error('Failed to fetch recent complaints', err)
        }
      }

      const fetchAdminStats = async () => {
        try {
          const token = localStorage.getItem('access_token')
          const isTokenValid = Boolean(token && token !== 'undefined' && token !== 'null')
          
          const headers: Record<string, string> = {
            'Content-Type': 'application/json'
          }
          
          if (isTokenValid) {
            headers['Authorization'] = `Bearer ${token}`
          }
          
          const res = await fetch(`${API_BASE}/api/adminstats/`, { headers })
          
          if (!res.ok) {
            if (res.status === 401) {
              console.warn('Authentication failed for admin stats, using fallback')
              setAdminStats({ total_users: 1250, total_categories: 15, total_officers: 45 })
              return
            }
            throw new Error('Failed to fetch admin stats')
          }
          
          const data = await res.json()
          setAdminStats({ 
            total_users: data.total_users || 0, 
            total_categories: data.total_categories || 0, 
            total_officers: data.total_officers || 0 
          })
        } catch (err) {
          console.error('Failed to fetch admin stats', err)
          setAdminStats({ total_users: 1250, total_categories: 15, total_officers: 45 })
        }
      }

      const fetchCategories = async () => {
        try {
          const token = localStorage.getItem('access_token')
          const isTokenValid = Boolean(token && token !== 'undefined' && token !== 'null')
          
          const headers: Record<string, string> = {
            'Content-Type': 'application/json'
          }
          
          if (isTokenValid) {
            headers['Authorization'] = `Bearer ${token}`
          }
          
          const res = await fetch(`${API_BASE}/api/totalcategories/`, { headers })
          
          if (!res.ok) {
            if (res.status === 401) {
              console.warn('Authentication failed for categories, using fallback')
              const fallbackData = [
                { name: 'Roads & Infrastructure', total_comp: 25 },
                { name: 'Water Supply', total_comp: 18 },
                { name: 'Sanitation', total_comp: 12 },
                { name: 'Street Lighting', total_comp: 8 },
                { name: 'Drainage', total_comp: 6 },
              ]
              setCategoryChartData(
                fallbackData.map((cat, i) => ({
                  name: cat.name,
                  value: cat.total_comp || 0,
                  color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                }))
              )
              return
            }
            throw new Error('Failed to fetch categories')
          }
          
          const data: { name: string; total_comp: number }[] = await res.json()
          setCategoryChartData(
            data.map((cat, i) => ({
              name: cat.name,
              value: cat.total_comp || 0,
              color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
            }))
          )
        } catch (err) {
          console.error('Failed to fetch categories', err)
          const fallbackData = [
            { name: 'Roads & Infrastructure', total_comp: 20 },
            { name: 'Water Supply', total_comp: 15 },
            { name: 'Sanitation', total_comp: 10 },
            { name: 'Street Lighting', total_comp: 7 },
            { name: 'Drainage', total_comp: 5 },
          ]
          setCategoryChartData(
            fallbackData.map((cat, i) => ({
              name: cat.name,
              value: cat.total_comp,
              color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
            }))
          )
        }
      }

      const fetchMonthlyRegistrations = async () => {
        try {
          const data = await getUserMonthlyRegistrations()
          const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December']
          
          const chartData = months.map((month, index) => ({
            month: month.slice(0, 3), // Show first 3 letters
            registrations: data.monthly_data[month] || 0,
            color: MONTHLY_COLORS[index]
          }))
          
          setMonthlyRegistrationsData(chartData)
        } catch (err) {
          console.error('Failed to fetch monthly registrations', err)
          // Set fallback data
          const fallbackData = [
            { month: 'Jan', registrations: 45, color: MONTHLY_COLORS[0] },
            { month: 'Feb', registrations: 52, color: MONTHLY_COLORS[1] },
            { month: 'Mar', registrations: 38, color: MONTHLY_COLORS[2] },
            { month: 'Apr', registrations: 65, color: MONTHLY_COLORS[3] },
            { month: 'May', registrations: 48, color: MONTHLY_COLORS[4] },
            { month: 'Jun', registrations: 72, color: MONTHLY_COLORS[5] },
          ]
          setMonthlyRegistrationsData(fallbackData)
        }
      }

    // Refresh all data sources
    await Promise.all([
      fetchKPIs(),
      fetchComplaintStatus(),
      fetchRecentComplaints(),
      fetchAdminStats(),
      fetchCategories(),
      fetchMonthlyRegistrations()
    ])
    console.log('All dashboard data refreshed successfully')
  } catch (err) {
    console.error('Error refreshing dashboard data:', err)
    setError('Failed to refresh some dashboard data')
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    fetchKPIs()

    // Set current time only on client side
    setCurrentTime(new Date().toLocaleTimeString())
    
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)

    const fetchComplaintStatus = async () => {
      try {
        const token = localStorage.getItem('access_token')
        const isTokenValid = Boolean(token && token !== 'undefined' && token !== 'null')
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        }
        
        if (isTokenValid) {
          headers['Authorization'] = `Bearer ${token}`
        }
        
        const res = await fetch(`${API_BASE}/api/admindashboardcard/`, { headers })
        
        if (!res.ok) {
          if (res.status === 401) {
            console.warn('Authentication failed for admin dashboard, using fallback')
            // Set fallback data
            setComplaintStatusData([
              { name: 'Pending', value: 15, color: '#f59e0b' },
              { name: 'In Progress', value: 8, color: '#8b5cf6' },
              { name: 'Resolved', value: 32, color: '#16a34a' },
            ])
            return
          }
          throw new Error('Failed to fetch complaint status')
        }
        
        const data = await res.json()
        console.log('Admin dashboard data:', data)
        setComplaintStatusData([
          { name: 'Pending', value: Number(data.Pending_comp) || 0, color: '#f59e0b' },
          { name: 'In Progress', value: Number(data.inprogress_comp) || 0, color: '#8b5cf6' },
          { name: 'Resolved', value: Number(data.resolved_comp) || 0, color: '#16a34a' },
        ])
      } catch (err) {
        console.error('Failed to fetch complaint status', err)
        // Set fallback data
        setComplaintStatusData([
          { name: 'Pending', value: 12, color: '#f59e0b' },
          { name: 'In Progress', value: 6, color: '#8b5cf6' },
          { name: 'Resolved', value: 28, color: '#16a34a' },
        ])
      }
    }

    const fetchRecentComplaints = async () => {
      try {
        const token = localStorage.getItem('access_token')
        const isTokenValid = Boolean(token && token !== 'undefined' && token !== 'null')
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        }
        
        if (isTokenValid) {
          headers['Authorization'] = `Bearer ${token}`
        }
        
        const res = await fetch(`${API_BASE}/api/getcomplaint/`, { headers })
        
       
        const data = await res.json()
        console.log('Recent complaints data:', data)
        setRecentComplaints(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to fetch recent complaints', err)
        // Set fallback data
        setRecentComplaints([
          { id: 'CMP-001', title: 'Pothole on Main Street', status: 'Pending', priority_level: 'High', location_District: 'Ahmedabad' },
          { id: 'CMP-002', title: 'Water Leakage', status: 'in-progress', priority_level: 'Medium', location_District: 'Surat' },
          { id: 'CMP-003', title: 'Street Light Issue', status: 'resolved', priority_level: 'Low', location_District: 'Vadodara' },
        ])
      }
    }

    const fetchAdminStats = async () => {
      try {
        const token = localStorage.getItem('access_token')
        const isTokenValid = Boolean(token && token !== 'undefined' && token !== 'null')
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        }
        
        if (isTokenValid) {
          headers['Authorization'] = `Bearer ${token}`
        }
        
        const res = await fetch(`${API_BASE}/api/adminstats/`, { headers })
        
        if (!res.ok) {
          if (res.status === 401) {
            console.warn('Authentication failed for admin stats, using fallback')
            // Set fallback data
            setAdminStats({ total_users: 1250, total_categories: 15, total_officers: 45 })
            return
          }
          throw new Error('Failed to fetch admin stats')
        }
        
        const data = await res.json()
        console.log('Admin stats data:', data)
        setAdminStats({ 
          total_users: data.total_users || 0, 
          total_categories: data.total_categories || 0, 
          total_officers: data.total_officers || 0 
        })
      } catch (err) {
        console.error('Failed to fetch admin stats', err)
        // Set fallback data
        setAdminStats({ total_users: 1250, total_categories: 15, total_officers: 45 })
      }
    }

    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('access_token')
        const isTokenValid = Boolean(token && token !== 'undefined' && token !== 'null')
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        }
        
        if (isTokenValid) {
          headers['Authorization'] = `Bearer ${token}`
        }
        
        const res = await fetch(`${API_BASE}/api/totalcategories/`, { headers })
        
        if (!res.ok) {
          if (res.status === 401) {
            console.warn('Authentication failed for categories, using fallback')
            // Set fallback data
            const fallbackData = [
              { name: 'Roads & Infrastructure', total_comp: 25 },
              { name: 'Water Supply', total_comp: 18 },
              { name: 'Sanitation', total_comp: 12 },
              { name: 'Street Lighting', total_comp: 8 },
              { name: 'Drainage', total_comp: 6 },
            ]
            setCategoryChartData(
              fallbackData.map((cat, i) => ({
                name: cat.name,
                value: cat.total_comp || 0,
                color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
              }))
            )
            return
          }
          throw new Error('Failed to fetch categories')
        }
        
        const data: { name: string; total_comp: number }[] = await res.json()
        console.log('Categories data received:', data)
        console.log('Categories data length:', data.length)
        console.log('Categories data sample:', data.slice(0, 3))
        
        if (data && data.length > 0) {
          setCategoryChartData(
            data.map((cat, i) => ({
              name: cat.name,
              value: cat.total_comp || 0,
              color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
            }))
          )
        } else {
          console.warn('No categories data received, using fallback')
          // Set fallback data
          const fallbackData = [
            { name: 'Roads & Infrastructure', total_comp: 20 },
            { name: 'Water Supply', total_comp: 15 },
            { name: 'Sanitation', total_comp: 10 },
            { name: 'Street Lighting', total_comp: 7 },
            { name: 'Drainage', total_comp: 5 },
          ]
          setCategoryChartData(
            fallbackData.map((cat, i) => ({
              name: cat.name,
              value: cat.total_comp,
              color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
            }))
          )
        }
      } catch (err) {
        console.error('Failed to fetch categories', err)
        // Set fallback data
        const fallbackData = [
          { name: 'Roads & Infrastructure', total_comp: 20 },
          { name: 'Water Supply', total_comp: 15 },
          { name: 'Sanitation', total_comp: 10 },
          { name: 'Street Lighting', total_comp: 7 },
          { name: 'Drainage', total_comp: 5 },
        ]
        setCategoryChartData(
          fallbackData.map((cat, i) => ({
            name: cat.name,
            value: cat.total_comp || 0,
            color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
          }))
        )
      }
    }

    fetchComplaintStatus()
    fetchRecentComplaints()
    fetchAdminStats()
    fetchCategories()
    
    // Cleanup interval on unmount
    return () => clearInterval(timeInterval)
  }, [])

  const fallbackKPIs: DashboardKPI[] = [
    { title: 'Total Complaints', value: '0', trend: '+0%', trendUp: true, badge: 'All Time', bgColor: 'bg-blue-50', borderColor: 'border-blue-500', textColor: 'text-blue-700' },
    { title: 'Resolved Complaints', value: '0', trend: '+0%', trendUp: true, badge: 'Completed', bgColor: 'bg-green-50', borderColor: 'border-green-500', textColor: 'text-green-700' },
    { title: 'Pending Complaints', value: '0', trend: '+0%', trendUp: false, badge: 'Action Needed', bgColor: 'bg-orange-50', borderColor: 'border-orange-500', textColor: 'text-orange-700' },
    { title: 'In Progress', value: '0', trend: '+0%', trendUp: true, badge: 'Working', bgColor: 'bg-purple-50', borderColor: 'border-purple-500', textColor: 'text-purple-700' },
  ]

  const displayKPIs = statsCards.length > 0 ? statsCards.slice(0, 4) : fallbackKPIs
  const isUsingBackendData = statsCards.length > 0


  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Pending': 'bg-orange-100 text-orange-700 border-orange-200',
      'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
      'resolved': 'bg-green-100 text-green-700 border-green-200',
    }
    return colors[status] || 'bg-slate-100 text-slate-700 border-slate-200'
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'High': 'text-orange-600 font-semibold',
      'Medium': 'text-yellow-600',
      'Low': 'text-green-600',
    }
    return colors[priority] || 'text-slate-600'
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-white shadow-lg overflow-hidden`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Layout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CivicTrack</h1>
              <p className="text-xs text-gray-500">Admin Portal</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                window.location.pathname === item.href 
                  ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                <Layout className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
                <p className="text-sm text-gray-500">Manage civic complaints and system</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Last updated</p>
                <p className="text-xs font-medium text-gray-700">{currentTime}</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto bg-gray-50">
          {/* Page Header */}
          <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gujarat CivicTrack</h1>
                <p className="text-sm text-gray-500 mt-1">Smart City Governance & Civic Complaint Portal</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-blue-600 font-medium flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Real-time Monitoring
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Last updated: {currentTime || '--:--:--'}
                  </p>
                </div>
                <button
                  onClick={refreshAllData}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>
          </div>
      </div>

      {/* KPI Cards Section - 4 equal cards in one row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {displayKPIs.map((card, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-xl border-t-4 ${card.borderColor} shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 p-5 ${loading ? 'animate-pulse' : ''}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-medium text-[#64748B] uppercase tracking-wide">{card.title}</p>
                <p className="text-3xl font-bold text-[#1E293B] mt-2">{loading ? '...' : card.value}</p>
              </div>
              <div className={`${card.bgColor} ${card.textColor} px-2 py-1 rounded text-xs font-semibold`}>
                {card.badge}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {card.trendUp ? <TrendingUp className="w-4 h-4 text-[#22C55E]" /> : <TrendingDown className="w-4 h-4 text-[#EF4444]" />}
              <span className={`text-sm font-semibold ${card.trendUp ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>{card.trend}</span>
              <span className="text-xs text-[#64748B]">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Section - 8:4 split using 12-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT SIDE - 8 columns */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 h-full">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#1E293B]">Recent Complaints</h3>
              <p className="text-sm text-[#64748B]">Latest complaints submitted to system</p>
            </div>
            <div className="divide-y divide-[#E2E8F0]">
              {loading ? (
                <div className="p-8 text-center text-[#64748B]">Loading...</div>
              ) : recentComplaints.length > 0 ? (
                recentComplaints.map((complaint) => (
                  <div key={complaint.id} className="p-4 hover:bg-[#F8FAFC] transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-semibold text-[#2563EB]">#{complaint.id}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(complaint.status || '')}`}>
                            {complaint.status || 'Unknown'}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-[#1E293B]">{complaint.title}</p>
                        <p className="text-xs text-[#64748B] mt-1">{complaint.location_District || ''}</p>
                      </div>
                      <span className={`text-xs font-semibold ${getPriorityColor(complaint.priority_level || '')}`}>
                        {complaint.priority_level || ''}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-[#64748B]">No complaints found</div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - 4 columns - Category Chart */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 h-full">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#1E293B]">Complaints by Category</h3>
              <p className="text-sm text-[#64748B]">Distribution across categories</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData.filter(d => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryChartData.filter(d => d.value > 0).map((entry, index) => (
                      <Cell key={`cat-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any, name: any) => [`${value} complaints`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 max-h-40 overflow-y-auto">
              <div className="space-y-2">
                {categoryChartData.length > 0 ? (
                  categoryChartData.map((entry) => (
                    <div key={entry.name} className="flex items-center justify-between text-sm">
                      <span className="text-[#64748B] truncate flex-1 mr-2">{entry.name}</span>
                      <span className="font-semibold text-[#1E293B]">{entry.value}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-[#64748B] p-4">
                    No category data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </main>
    </div>
  )
}