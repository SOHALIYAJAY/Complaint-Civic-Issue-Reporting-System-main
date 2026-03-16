'use client'

import { useState, useEffect } from 'react'
import { Eye, Filter, Download, TrendingUp, TrendingDown, AlertTriangle, Clock, CheckCircle, Users, Building2, BarChart3, RefreshCw } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { getDashboardKPIs, refreshDashboardData, DashboardKPI, BackendDashboardResponse } from '../../services/dashboardService'

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [selectedMetric, setSelectedMetric] = useState('all')
  const [statsCards, setStatsCards] = useState<DashboardKPI[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [complaintStatusData, setComplaintStatusData] = useState<Array<{ name: string; value: number; color: string }>>([
    { name: 'Open', value: 0, color: '#f97316' },
    { name: 'In Progress', value: 0, color: '#8b5cf6' },
    { name: 'Resolved', value: 0, color: '#16a34a' },
    { name: 'Escalated', value: 0, color: '#dc2626' },
  ])
  const [recentComplaints, setRecentComplaints] = useState<any[]>([])
  const [rcStatusFilter, setRcStatusFilter] = useState<string>('All')
  const [rcDeptFilter, setRcDeptFilter] = useState<string>('All')
  const [rcPriorityFilter, setRcPriorityFilter] = useState<string>('All')
  const [rcSearch, setRcSearch] = useState<string>('')

  // Fetch KPI data from backend
  const fetchKPIs = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Fetching dashboard KPIs from backend...')
      console.log('📡 API URL: http://localhost:8000/api/admindashboardcard/')
      
      const data = await getDashboardKPIs()
      console.log('✅ Received KPI data:', data)
      console.log('📊 KPI Cards count:', data.length)
      
      setStatsCards(data)
      
      // Log each KPI card details
      data.forEach((kpi, index) => {
        console.log(`📈 KPI ${index + 1}: ${kpi.title} = ${kpi.value}`)
      })
      
    } catch (err: any) {
      console.error('❌ Dashboard data fetch error:', err)
      console.error('🔍 Error details:', err.response?.data || err.message)
      setError('Failed to fetch dashboard data from backend')
      // Use fallback data when backend fails
      console.log('⚠️ Using fallback data due to API error')
    } finally {
      setLoading(false)
      console.log('🏁 Fetch completed. Loading state:', false)
    }
  }

  // Refresh dashboard data
  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      setError(null)
      console.log('Refreshing dashboard data...')
      const data = await refreshDashboardData()
      console.log('Refreshed KPI data:', data.kpis)
      setStatsCards(data.kpis)
    } catch (err) {
      console.error('Dashboard refresh error:', err)
      setError('Failed to refresh dashboard data')
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchKPIs()
    // fetch complaint status distribution
    const fetchComplaintStatus = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
        const res = await fetch(`${API_BASE_URL}/api/complaintsinfo/`)
        const data = await res.json()
        // backend returns: total_comp, resolved_comp, pending_comp, inprogress_comp
        const total = Number(data.total_comp) || 0
        const resolved = Number(data.resolved_comp) || 0
        const pending = Number(data.pending_comp) || 0
        const inprogress = Number(data.inprogress_comp) || 0
        const open = Math.max(0, total - (resolved + pending + inprogress))
        const pieData = [
          { name: 'Open', value: open, color: '#f97316' },
          { name: 'In Progress', value: inprogress, color: '#8b5cf6' },
          { name: 'Resolved', value: resolved, color: '#16a34a' },
          { name: 'Pending', value: pending, color: '#f59e0b' },
        ]
        setComplaintStatusData(pieData)
      } catch (err) {
        console.error('Failed to fetch complaints info for pie chart', err)
      }
    }

    fetchComplaintStatus()
    // fetch recent complaints for Recent Complaints card
    const fetchRecentComplaints = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
        const res = await fetch(`${API_BASE_URL}/api/getcomplaint/`)
        const data = await res.json()
        // if backend has a limit endpoint, you can call /api/getcomplaintlimit/ instead
        setRecentComplaints(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to fetch recent complaints', err)
      }
    }

    fetchRecentComplaints()
  }, [])

  // Fallback mock data for the first 4 KPI cards if API fails
  const fallbackKPIs: DashboardKPI[] = [
    { 
      title: 'Total Complaints', 
      value: '2,847', 
      trend: '+12%', 
      trendUp: true,
      badge: 'All Time',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-700'
    },
    { 
      title: 'Open', 
      value: '324', 
      trend: '+5%', 
      trendUp: true,
      badge: 'Pending',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-500',
      textColor: 'text-orange-700'
    },
    { 
      title: 'In Progress', 
      value: '581', 
      trend: '-2%', 
      trendUp: false,
      badge: 'Active',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-500',
      textColor: 'text-purple-700'
    },
    { 
      title: 'Resolved', 
      value: '1,942', 
      trend: '+8%', 
      trendUp: true,
      badge: 'Completed',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      textColor: 'text-green-700'
    },
  ]

  // Use fetched data or fallback data
  const displayKPIs = statsCards.length > 0 ? statsCards.slice(0, 4) : fallbackKPIs
  const isUsingBackendData = statsCards.length > 0
  
  const monthlyTrendData = [
    { month: 'Jan', complaints: 245, resolved: 210, escalated: 15 },
    { month: 'Feb', complaints: 318, resolved: 280, escalated: 18 },
    { month: 'Mar', complaints: 412, resolved: 380, escalated: 22 },
    { month: 'Apr', complaints: 389, resolved: 350, escalated: 19 },
    { month: 'May', complaints: 456, resolved: 420, escalated: 25 },
    { month: 'Jun', complaints: 512, resolved: 480, escalated: 28 },
  ]

  const departments = [
    { name: 'Public Works', resolution: 94, complaints: 450, color: 'bg-blue-500' },
    { name: 'Water Authority', resolution: 91, complaints: 380, color: 'bg-cyan-500' },
    { name: 'Electricity Board', resolution: 88, complaints: 420, color: 'bg-amber-500' },
    { name: 'Municipal Corp', resolution: 85, complaints: 290, color: 'bg-emerald-500' },
  ]



  const escalatedComplaints = [
    { id: 'ESC-001', title: 'Critical Water Supply Failure', district: 'Ahmedabad', daysOpen: 8, slaViolated: true },
    { id: 'ESC-002', title: 'Road Collapse Risk', district: 'Surat', daysOpen: 6, slaViolated: true },
    { id: 'ESC-003', title: 'Power Outage - Hospital Area', district: 'Vadodara', daysOpen: 5, slaViolated: false },
  ]

  const getStatusColor = (status: string) => {
    const colors = {
      'Open': 'bg-orange-100 text-orange-700 border-orange-200',
      'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
      'Resolved': 'bg-green-100 text-green-700 border-green-200',
      'Escalated': 'bg-red-100 text-red-700 border-red-200'
    }
    return colors[status as keyof typeof colors] || 'bg-slate-100 text-slate-700 border-slate-200'
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      'Critical': 'text-red-700 font-bold',
      'High': 'text-orange-600 font-semibold',
      'Medium': 'text-yellow-600',
      'Low': 'text-green-600'
    }
    return colors[priority as keyof typeof colors] || 'text-slate-600'
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Gujarat CivicTrack</h1>
            <p className="text-sm text-blue-700 mt-1">Smart City Governance & Civic Complaint Portal</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-600 font-medium">Real-time Monitoring</p>
            <p className="text-xs text-blue-500">Last updated: Today at 2:45 PM</p>
          </div>
        </div>
      </div>

      {/* KPI Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-800">Key Performance Indicators</h2>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              isUsingBackendData 
                ? 'bg-green-100 text-green-700' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              {isUsingBackendData ? '🟢 Live Data' : '🟠 Demo Data'}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {loading && !refreshing && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-blue-600">Loading...</span>
              </div>
            )}
            {error && (
              <span className="text-sm text-red-600">⚠️ {error}</span>
            )}
            <button
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                refreshing 
                  ? 'bg-blue-100 text-blue-700 cursor-not-allowed' 
                  : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayKPIs.map((card, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-lg border-t-4 ${card.borderColor} shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 p-5 ${(loading || refreshing) ? 'animate-pulse' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{card.title}</p>
                  <p className="text-3xl font-bold text-slate-800 mt-2">{(loading || refreshing) ? '...' : card.value}</p>
                </div>
                <div className={`${card.bgColor} ${card.textColor} px-2 py-1 rounded text-xs font-semibold`}>
                  {card.badge}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {card.trendUp ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-semibold ${card.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {card.trend}
                </span>
                <span className="text-xs text-slate-500">vs last month</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Complaints */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-5 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Recent Complaints</h3>
                <p className="text-sm text-slate-500">Latest submissions requiring attention</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search ID or title"
                  value={rcSearch}
                  onChange={(e) => setRcSearch(e.target.value)}
                  className="text-sm px-3 py-2 border rounded-lg"
                />
                <select value={rcStatusFilter} onChange={(e) => setRcStatusFilter(e.target.value)} className="text-sm px-3 py-2 border rounded-lg">
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <select value={rcPriorityFilter} onChange={(e) => setRcPriorityFilter(e.target.value)} className="text-sm px-3 py-2 border rounded-lg">
                  <option value="All">All Priority</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {(() => {
              const filtered = recentComplaints.filter((comp: any) => {
                const status = (comp.status || comp.Status || '').toString()
                const priority = (comp.priority || comp.priority_level || '').toString()
                const dept = (comp.department || comp.department_name || comp.department_id || '').toString()
                const id = (comp.id || comp.comp_id || '').toString()
                const title = (comp.title || comp.Description || '').toString()

                const matchesSearch = rcSearch === '' || id.toLowerCase().includes(rcSearch.toLowerCase()) || title.toLowerCase().includes(rcSearch.toLowerCase())
                const matchesStatus = rcStatusFilter === 'All' || String(status).toLowerCase() === String(rcStatusFilter).toLowerCase()
                const matchesPriority = rcPriorityFilter === 'All' || String(priority).toLowerCase() === String(rcPriorityFilter).toLowerCase()
                const matchesDept = rcDeptFilter === 'All' || rcDeptFilter === '' || String(dept).toLowerCase() === String(rcDeptFilter).toLowerCase()

                return matchesSearch && matchesStatus && matchesPriority && matchesDept
              })

              return filtered.slice(0, 4).map((complaint: any) => (
                <div key={complaint.id || complaint.comp_id} className="p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-mono font-semibold text-blue-700">{complaint.id || complaint.comp_id || `#${complaint.id}`}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(complaint.status || complaint.Status || complaint.status_text || '')}`}>
                          {complaint.status || complaint.Status || 'Unknown'}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-800">{complaint.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{complaint.location_District || complaint.Location_District || complaint.district || complaint.location || ''}</p>
                    </div>
                    <span className={`text-xs font-semibold ${getPriorityColor(complaint.priority || complaint.priority_level || '')}`}>
                      {complaint.priority || complaint.priority_level || ''}
                    </span>
                  </div>
                </div>
              ))
            })()}
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-5 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">Departments</h3>
            <p className="text-sm text-slate-500">Resolution rates</p>
          </div>
          <div className="p-5 space-y-4">
            {departments.map((dept, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{dept.name}</p>
                    <p className="text-xs text-slate-500">{dept.complaints} complaints</p>
                  </div>
                  <span className="text-lg font-bold text-slate-800">{dept.resolution}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${dept.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${dept.resolution}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Section: Removed Monthly and District charts per request; keeping status distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Complaint Status Pie Chart */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Complaint Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={complaintStatusData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100}>
                {complaintStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* District-wise chart removed per request */}

      {/* SLA Breach Monitor removed per request */}

      {/* Tabs Section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="flex gap-2 border-b border-slate-200 p-2">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`px-6 py-3 font-medium text-sm rounded-lg transition-colors ${
              selectedTab === 'overview'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Overview
          </button>
          {/* Removed "All Complaints" and "Department Stats" tabs per request */}
        </div>
        {/* Only Overview tab remains; other tabs removed per request */}

        {/* OVERVIEW SECTION */}
        {selectedTab === 'overview' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-600">Current</span>
                </div>
                <p className="text-xs text-blue-600 uppercase tracking-wide mb-1">Average Response Time</p>
                <p className="text-3xl font-bold text-blue-900">2.4 hrs</p>
                <p className="text-xs text-blue-600 mt-2">↓ 15% from last month</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-xs font-semibold text-green-600">On Track</span>
                </div>
                <p className="text-xs text-green-600 uppercase tracking-wide mb-1">SLA Compliance Rate</p>
                <p className="text-3xl font-bold text-green-900">94.2%</p>
                <p className="text-xs text-green-600 mt-2">Target: 95%</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="text-xs font-semibold text-purple-600">Active</span>
                </div>
                <p className="text-xs text-purple-600 uppercase tracking-wide mb-1">Active Officers Online</p>
                <p className="text-3xl font-bold text-purple-900">47/52</p>
                <p className="text-xs text-purple-600 mt-2">90% availability</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">System Health</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">API Uptime</p>
                  <p className="text-2xl font-bold text-slate-800">99.9%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Avg Response</p>
                  <p className="text-2xl font-bold text-slate-800">234ms</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Database Latency</p>
                  <p className="text-2xl font-bold text-slate-800">45ms</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Active Users</p>
                  <p className="text-2xl font-bold text-slate-800">1,247</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
