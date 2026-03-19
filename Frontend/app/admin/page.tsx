'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Users, FileText, Clock, CheckCircle2, Activity, AlertTriangle, Calendar, Target, Award, RefreshCw, Eye } from 'lucide-react'
import Link from 'next/link'
import api, { apiGet } from '@/lib/api'
import StatsCard from '@/components/ui/stats-card'

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
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch dashboard cards data
      const kpiResult = await apiGet('/api/admindashboardcard/')
      
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

      // Fetch complaint trends data
      const trendsResult = await apiGet('/api/complaint-status-trends/')
      
      const transformedTrendsData = Array.isArray(trendsResult) 
        ? trendsResult.map((item: any) => ({
            month: item.month || 'Unknown',
            complaints: item.complaints || 0
          }))
        : []
      
      setMonthlyData(transformedTrendsData)

      // Fetch user role distribution
      const roleResult = await apiGet('/api/user-role-distribution/')
      
      const transformedRoleData = [
        { name: 'Regular Users', value: roleResult.regular_users || 0, color: '#3B82F6' },
        { name: 'Officers', value: roleResult.officers || 0, color: '#10B981' },
        { name: 'Admins', value: roleResult.admins || 0, color: '#F59E0B' }
      ]
      setRoleData(transformedRoleData)

      // Fetch recent complaints
      const recentResult = await apiGet('/api/recent-complaints-admin/')
      
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
      setError('Failed to load dashboard data')
      
      // Set empty data to prevent chart errors
      setMonthlyData([])
      setRoleData([])
      setRecentComplaints([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const formatNumber = (num: number | undefined | null) => {
    if (num === undefined || num === null || isNaN(num)) {
      return '0'
    }
    return num.toLocaleString()
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in-progress':
      case 'iin-progress':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-orange-100 text-orange-800'
      case 'low':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, children, className, loading }) => (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        children
      )}
    </div>
  )

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Real-time monitoring</span>
            <span>•</span>
            <span>Last updated: {lastUpdated}</span>
            <button
              onClick={fetchData}
              className="flex items-center gap-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Complaints"
            value={formatNumber(kpiData.total_comp || 0)}
            icon={<FileText className="w-6 h-6" />}
            color="text-white"
            bgColor="bg-sidebar-primary"
            borderColor="border-t-[#1e40af]"
            loading={loading}
          />
          <StatsCard
            title="Resolved"
            value={formatNumber(kpiData.resolved_comp || 0)}
            icon={<Target className="w-6 h-6" />}
            color="text-white"
            bgColor="bg-green-600"
            borderColor="border-t-[#16a34a]"
            loading={loading}
          />
          <StatsCard
            title="Pending"
            value={formatNumber(kpiData.Pending_comp || 0)}
            icon={<Activity className="w-6 h-6" />}
            color="text-white"
            bgColor="bg-yellow-600"
            borderColor="border-t-[#f59e0b]"
            loading={loading}
          />
          <StatsCard
            title="In Progress"
            value={formatNumber(kpiData.inprogress_comp || 0)}
            icon={<Clock className="w-6 h-6" />}
            color="text-white"
            bgColor="bg-orange-600"
            borderColor="border-t-[#3b82f6]"
            loading={loading}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard
            title="Complaint Trends"
            subtitle="Monthly complaint volume"
            loading={loading}
          >
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="complaints" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No trend data available
              </div>
            )}
          </ChartCard>

          <ChartCard
            title="User Distribution"
            subtitle="Users by role"
            loading={loading}
          >
            {roleData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No user data available
              </div>
            )}
          </ChartCard>
        </div>

        {/* Recent Complaints */}
        <ChartCard
          title="Recent Complaints"
          subtitle="Latest filed complaints"
          loading={loading}
        >
          <div className="space-y-3">
            {recentComplaints.length > 0 ? (
              recentComplaints.map((complaint) => (
                <div key={complaint.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{complaint.title}</h4>
                    <p className="text-sm text-gray-600 truncate">{complaint.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">{complaint.location_District}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(complaint.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(complaint.priority_level)}`}>
                      {complaint.priority_level}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No recent complaints found
              </div>
            )}
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
