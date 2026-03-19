"use client"

import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, Users, FileText, Clock, CheckCircle2, Activity, AlertTriangle, Calendar, Target, Award, RefreshCw, Eye } from "lucide-react"
import Link from "next/link"
import api from '@/lib/axios'

interface DashboardStats {
  total: number
  pending: number
  inProgress: number
  resolved: number
}

interface PerformanceMetrics {
  avgResolutionTime: number
  slaCompliance: number
  officerWorkload: number
  citizenSatisfaction: number
}

interface RecentActivity {
  id: string
  type: string
  description: string
  time: string
  officer?: string
}

interface DashboardData {
  stats: DashboardStats
  performance: PerformanceMetrics
  recentComplaints: any[]
  recentActivity: RecentActivity[]
}

export default function DepartmentDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    fetchDashboardData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      setError(null)
      const response = await api.get('/api/department/dashboard/')
      
      // With axios, successful responses don't have .ok property
      // Instead, axios throws errors for non-2xx status codes
      const data = response.data
      setDashboardData(data)
      setLastUpdated(new Date())
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-orange-600 bg-orange-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'complaint': return <FileText className="w-4 h-4 text-blue-600" />
      case 'resolution': return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case 'assignment': return <Users className="w-4 h-4 text-purple-600" />
      case 'system': return <AlertTriangle className="w-4 h-4 text-orange-600" />
      default: return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 lg:p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">Dashboard Error</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Loading Data
          </button>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center text-gray-500">No dashboard data available</div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Department Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Real-time overview of department operations</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchDashboardData}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh dashboard"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 border-t-4 border-t-blue-500 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Total Complaints</p>
          <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.total}</p>
          <div className="mt-2 text-xs text-gray-500">All time records</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 border-t-4 border-t-yellow-500 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-yellow-50 text-yellow-600 p-2 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Pending</p>
          <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.pending}</p>
          <div className="mt-2 text-xs text-gray-500">Awaiting action</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 border-t-4 border-t-blue-500 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">In Progress</p>
          <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.inProgress}</p>
          <div className="mt-2 text-xs text-gray-500">Currently being addressed</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 border-t-4 border-t-green-500 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-50 text-green-600 p-2 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Resolved</p>
          <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.resolved}</p>
          <div className="mt-2 text-xs text-gray-500">Successfully completed</div>
        </div>
      </div>

      {/* Performance Metrics & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-purple-50 text-purple-600 p-2 rounded-lg">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
                <p className="text-sm text-gray-600">Department efficiency indicators</p>
              </div>
            </div>
          </div>
          
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">Avg Resolution Time</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{dashboardData.performance.avgResolutionTime} days</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">SLA Compliance</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{dashboardData.performance.slaCompliance}%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-gray-600">Officer Workload</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{dashboardData.performance.officerWorkload}/officer</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600">Citizen Satisfaction</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{dashboardData.performance.citizenSatisfaction}/5.0</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-green-50 text-green-600 p-2 rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <p className="text-sm text-gray-600">Latest department actions</p>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {dashboardData.recentActivity.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{activity.time}</span>
                      {activity.officer && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{activity.officer}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/department/assigned" className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:border-blue-500 hover:shadow-md transition-all group">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg group-hover:bg-blue-100 transition-colors">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Manage Complaints</h3>
              <p className="text-sm text-gray-600">View and assign complaints</p>
            </div>
          </div>
        </Link>

        <Link href="/department/officers" className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:border-purple-500 hover:shadow-md transition-all group">
          <div className="flex items-center gap-4">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-lg group-hover:bg-purple-100 transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Manage Officers</h3>
              <p className="text-sm text-gray-600">Manage department officers</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Complaints */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Complaints</h3>
              <p className="text-sm text-gray-600">Latest complaints submitted to department</p>
            </div>
            <Link 
              href="/department/assigned" 
              className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
            >
              View All
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {dashboardData.recentComplaints.map((complaint) => (
            <div key={complaint.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-semibold text-blue-600">#{complaint.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">{complaint.title}</h4>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{complaint.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {complaint.current_time}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {complaint.Category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {complaint.location_address}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Status Overview */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Department Status
          </h3>
          <p className="text-sm text-gray-600">Current operational status and alerts</p>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-sm font-medium text-green-900">All Systems Operational</div>
                <div className="text-xs text-green-700">No active issues reported</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <div className="text-sm font-medium text-yellow-900">High Volume Alert</div>
                <div className="text-xs text-yellow-700">25% increase in new complaints</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">Performance Trend:</span>
              <span className="text-green-600 font-semibold">+12% improvement</span>
            </div>
            <p className="text-xs text-blue-700 mt-1">Compared to last month's performance metrics</p>
          </div>
        </div>
      </div>

      {/* Auto-refresh indicator */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 py-4">
        <RefreshCw className="w-3 h-3" />
        <span>Auto-refreshing every 30 seconds</span>
      </div>
    </div>
  )
}
