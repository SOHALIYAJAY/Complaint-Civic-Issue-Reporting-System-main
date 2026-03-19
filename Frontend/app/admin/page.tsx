'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, FileText, Target, Activity, RefreshCw } from 'lucide-react'

interface KPIData {
  total_comp: number
  resolved_comp: number
  Pending_comp: number
  inprogress_comp: number
}

interface MonthlyData {
  month: string
  complaints: number
}

interface RoleData {
  name: string
  value: number
  color: string
}

interface RecentComplaint {
  id: number
  title: string
  description: string
  status: string
  priority_level: string
  location_District: string
  created_at: string
}

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  color: string
  borderColor: string
  loading?: boolean
}

interface ChartCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  loading?: boolean
}

export default function AdminDashboard() {
  const [kpiData, setKpiData] = useState<KPIData>({
    total_comp: 0,
    resolved_comp: 0,
    Pending_comp: 0,
    inprogress_comp: 0
  })
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [roleData, setRoleData] = useState<RoleData[]>([])
  const [recentComplaints, setRecentComplaints] = useState<RecentComplaint[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)


  
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
      const token = localStorage.getItem('access_token')
      
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
      
      // Fetch dashboard cards data
      const kpiResponse = await fetch(`${API_BASE}/api/admindashboardcard/`, { headers })
      const kpiResult = await kpiResponse.json()
      
      const totalComplaints = kpiResult.total_complaints || kpiResult.total_comp || 0
      const resolvedComplaints = kpiResult.resolved_complaints || kpiResult.resolved_comp || 0
      const pendingComplaints = kpiResult.pending_complaints || kpiResult.Pending_comp || 0
      const inprogressComplaints = kpiResult.inprogress_complaints || kpiResult.inprogress_comp || 0
      
      setKpiData({
        total_comp: totalComplaints,
        resolved_comp: resolvedComplaints,
        Pending_comp: pendingComplaints,
        inprogress_comp: inprogressComplaints
      })

      // Fetch complaint trends data (replacing monthly user registrations)
      const trendsResponse = await fetch(`${API_BASE}/api/complaint-status-trends/`, { headers })
      const trendsResult = await trendsResponse.json()
      
      const transformedTrendsData = Array.isArray(trendsResult) 
        ? trendsResult.map((item: any) => ({
            month: item.month || 'Unknown',
            complaints: item.complaints || 0
          }))
        : []
      
      setMonthlyData(transformedTrendsData)

      // Fetch user role distribution
      const roleResponse = await fetch(`${API_BASE}/api/user-role-distribution/`, { headers })
      const roleResult = await roleResponse.json()
      
      const transformedRoleData = [
        { name: 'Regular Users', value: roleResult.regular_users || 0, color: '#3B82F6' },
        { name: 'Officers', value: roleResult.officers || 0, color: '#10B981' },
        { name: 'Admins', value: roleResult.admins || 0, color: '#F59E0B' }
      ]
      setRoleData(transformedRoleData)

      // Fetch recent complaints
      const recentResponse = await fetch(`${API_BASE}/api/recent-complaints-admin/`, { headers })
      const recentResult = await recentResponse.json()
      
      const transformedRecentData = Array.isArray(recentResult.data) 
        ? recentResult.data.slice(0, 6).map((item: any) => ({
            id: item.id || 0,
            title: item.title || 'Untitled Complaint',
            description: item.Description || 'No description available',
            status: item.status || 'Unknown',
            priority_level: item.priority_level || 'Medium',
            location_District: item.location_District || 'Unknown',
            created_at: item.current_time || new Date().toISOString()
          }))
        : []
      
      setRecentComplaints(transformedRecentData)

      setLastUpdated(new Date().toLocaleTimeString())
      setMounted(true)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set fallback data to prevent chart errors
      setMonthlyData([
        { month: 'Jan', complaints: 45 },
        { month: 'Feb', complaints: 52 },
        { month: 'Mar', complaints: 38 },
        { month: 'Apr', complaints: 65 },
        { month: 'May', complaints: 48 },
        { month: 'Jun', complaints: 58 }
      ])
      setRoleData([
        { name: 'Regular Users', value: 1200, color: '#3B82F6' },
        { name: 'Officers', value: 45, color: '#10B981' },
        { name: 'Admins', value: 8, color: '#F59E0B' }
      ])
      setKpiData({
        total_comp: 1250,
        resolved_comp: 890,
        Pending_comp: 245,
        inprogress_comp: 115
      })
      setRecentComplaints([
        { id: 1, title: 'Pothole on Main Street', description: 'Large pothole causing traffic issues', status: 'Pending', priority_level: 'High', location_District: 'Ahmedabad', created_at: '2024-03-19T10:30:00Z' },
        { id: 2, title: 'Water Leakage', description: 'Water pipe leaking for 3 days', status: 'in-progress', priority_level: 'Medium', location_District: 'Surat', created_at: '2024-03-19T09:15:00Z' },
        { id: 3, title: 'Street Light Issue', description: 'Multiple street lights not working', status: 'resolved', priority_level: 'Low', location_District: 'Vadodara', created_at: '2024-03-19T08:45:00Z' },
        { id: 4, title: 'Garbage Collection', description: 'Garbage not collected for a week', status: 'Pending', priority_level: 'Medium', location_District: 'Rajkot', created_at: '2024-03-19T08:00:00Z' },
        { id: 5, title: 'Road Damage', description: 'Road severely damaged due to rain', status: 'in-progress', priority_level: 'High', location_District: 'Gandhinagar', created_at: '2024-03-19T07:30:00Z' }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  function StatCard({ title, value, icon, color, borderColor, loading = false }: StatCardProps) {
    return (
      <div className="glass-effect rounded-lg border border-border p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${color}`}>
            {loading ? <RefreshCw className="w-6 h-6 animate-spin text-white" /> : icon}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-foreground">{loading ? '...' : value}</p>
        </div>
        <div className={`h-1 ${borderColor} mt-4 rounded-full opacity-80`}></div>
      </div>
    )
  }

  function ChartCard({ title, subtitle, children, className = "", loading = false }: ChartCardProps) {
    return (
      <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-6 ${className}`}>
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <div className="h-80">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    )
  }

  const kpiCards = [
    {
      title: 'Total Complaints',
      value: kpiData.total_comp?.toLocaleString() || '0',
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-500/10',
      borderColor: 'bg-blue-500'
    },
    {
      title: 'Resolved Complaints',
      value: kpiData.resolved_comp?.toLocaleString() || '0',
      icon: <Target className="w-6 h-6 text-green-600" />,
      color: 'bg-green-500/10',
      borderColor: 'bg-green-500'
    },
    {
      title: 'Pending Complaint',
      value: kpiData.Pending_comp?.toLocaleString() || '0',
      icon: <Activity className="w-6 h-6 text-orange-600" />,
      color: 'bg-orange-500/10',
      borderColor: 'bg-orange-500'
    },
    {
      title: 'In Progress',
      value: kpiData.inprogress_comp?.toLocaleString() || '0',
      icon: <Users className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-500/10',
      borderColor: 'bg-purple-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor and manage civic complaints system</p>
        </div>
        <div className="flex items-center gap-4">
          {mounted && <span className="text-sm text-gray-500">Last updated: {lastUpdated}</span>}
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>


    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiCards.map((card, index) => (
        <StatCard key={index} {...card} loading={loading} />
      ))}
    </div>

    {/* Recent Complaints Section */}
    <div className="mb-8">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Complaints</h2>
          <span className="text-sm text-gray-500">Latest 6 complaints</span>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recentComplaints.length > 0 ? (
          <div className="space-y-4">
            {recentComplaints.map((complaint) => (
              <div key={complaint.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{complaint.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                      complaint.status === 'In-progress' ? 'bg-blue-100 text-blue-800' :
                      complaint.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {complaint.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      complaint.priority_level === 'High' ? 'bg-red-100 text-red-800' :
                      complaint.priority_level === 'Medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {complaint.priority_level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1">{complaint.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>📍 {complaint.location_District}</span>
                    <span>📅 {new Date(complaint.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500">No recent complaints found</p>
          </div>
        )}
      </div>
    </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <ChartCard 
              title="Complaint Status Trends" 
              subtitle="Monthly complaint trends over time" 
              loading={loading}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      padding: '12px'
                    }}
                  />
                  <Bar 
                    dataKey="complaints" 
                    fill="#3B82F6" 
                    radius={[8, 8, 0, 0]}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="lg:col-span-4">
            <ChartCard 
              title="User Role Distribution" 
              subtitle="Breakdown of user types" 
              loading={loading}
            >
              <div className="h-full flex flex-col">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={roleData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={800}
                      >
                        {roleData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        padding: '8px 12px'
                      }}
                      formatter={(value: number) => [value.toLocaleString(), 'Users']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 space-y-3">
                {roleData.map((role, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: role.color }}
                      />
                      <span className="text-sm text-gray-700">{role.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {role.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}