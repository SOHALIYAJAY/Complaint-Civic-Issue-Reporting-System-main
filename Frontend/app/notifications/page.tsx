'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, AlertTriangle, CheckCircle, Clock, Zap, ChevronDown, Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import UtilityBar from '@/components/utility-bar'
import Header from '@/components/header'

const mockNotifications = [
  {
    id: 1,
    type: 'complaint-update',
    title: 'Your Complaint Status Updated',
    message: 'Pothole on Main Street has been escalated to priority 2',
    complaintId: 'CMP001234',
    timestamp: '5 minutes ago',
    read: false,
    priority: 'high',
    icon: 'alert',
  },
  {
    id: 2,
    type: 'escalation',
    title: 'Complaint Escalated',
    message: 'Water supply issue in Vadodara has exceeded SLA time',
    complaintId: 'CMP001235',
    timestamp: '1 hour ago',
    read: false,
    priority: 'critical',
    icon: 'zap',
  },
  {
    id: 3,
    type: 'system-alert',
    title: 'System Maintenance Notice',
    message: 'Scheduled maintenance on 2024-02-25 from 2:00 AM - 4:00 AM IST',
    complaintId: null,
    timestamp: '2 hours ago',
    read: true,
    priority: 'medium',
    icon: 'clock',
  },
  {
    id: 4,
    type: 'complaint-update',
    title: 'Complaint Resolved',
    message: 'Street light repair has been completed successfully',
    complaintId: 'CMP001236',
    timestamp: '1 day ago',
    read: true,
    priority: 'low',
    icon: 'check',
  },
  {
    id: 5,
    type: 'escalation',
    title: 'Officer Assignment',
    message: 'Rajesh Kumar has been assigned to your complaint',
    complaintId: 'CMP001237',
    timestamp: '2 days ago',
    read: true,
    priority: 'medium',
    icon: 'alert',
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortOrder, setSortOrder] = useState('latest')

  const unreadCount = notifications.filter((n) => !n.read).length
  const complaintUpdates = notifications.filter((n) => n.type === 'complaint-update').length
  const escalations = notifications.filter((n) => n.type === 'escalation').length
  const systemAlerts = notifications.filter((n) => n.type === 'system-alert').length

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const filteredNotifications = notifications
    .filter((n) => {
      if (filterType === 'all') return true
      return n.type === filterType
    })
    .filter((n) => n.title.toLowerCase().includes(searchTerm.toLowerCase()) || n.message.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => (sortOrder === 'latest' ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime() : 0))

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5" />
      case 'check':
        return <CheckCircle className="w-5 h-5" />
      case 'clock':
        return <Clock className="w-5 h-5" />
      case 'zap':
        return <Zap className="w-5 h-5" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300'
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'low':
        return 'bg-green-100 text-green-700 border-green-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getIconColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600'
      case 'high':
        return 'text-orange-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <UtilityBar />
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Notifications</span>
        </div>

        {/* Page Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Notifications & Alerts</h1>
            <p className="text-muted-foreground">Stay updated with real-time complaint and system activities</p>
          </div>
          <div className="bg-gradient-to-br from-red-100 to-red-50 border border-red-200 rounded-lg px-4 py-2">
            <p className="text-sm text-red-700 font-semibold">{unreadCount} Unread</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Notifications', value: notifications.length, icon: Bell, color: 'from-blue-500 to-blue-600' },
            { label: 'Unread', value: unreadCount, icon: AlertTriangle, color: 'from-red-500 to-red-600' },
            { label: 'Complaint Updates', value: complaintUpdates, icon: CheckCircle, color: 'from-green-500 to-green-600' },
            { label: 'System Alerts', value: systemAlerts, icon: Zap, color: 'from-yellow-500 to-yellow-600' },
          ].map((card, idx) => {
            const Icon = card.icon
            return (
              <div key={idx} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
                    <p className="text-3xl font-bold text-foreground">{card.value}</p>
                  </div>
                  <div className={`bg-gradient-to-br ${card.color} rounded-lg p-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Filter & Search Section */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 flex gap-3 w-full lg:w-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search notifications..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-2 border border-border rounded-lg bg-background text-foreground">
                <option value="all">All Notifications</option>
                <option value="complaint-update">Complaint Updates</option>
                <option value="escalation">Escalations</option>
                <option value="system-alert">System Messages</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium text-foreground mb-2">No notifications</p>
              <p className="text-muted-foreground">You're all caught up! Check back later for new updates.</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-card border border-border rounded-lg p-4 transition-all hover:shadow-md ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${notification.priority === 'critical' ? 'from-red-100 to-red-50' : notification.priority === 'high' ? 'from-orange-100 to-orange-50' : 'from-blue-100 to-blue-50'} flex items-center justify-center`}>
                    <span className={getIconColor(notification.priority)}>{getIcon(notification.icon)}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{notification.title}</h3>
                      <button onClick={() => deleteNotification(notification.id)} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        {notification.complaintId && <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{notification.complaintId}</span>}
                        <span className={`text-xs px-2 py-1 rounded font-medium border ${getPriorityColor(notification.priority)}`}>{notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}</span>
                        {!notification.read && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-medium">Unread</span>}
                      </div>
                      <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                    </div>

                    {/* Expandable Section */}
                    {expandedId === notification.id && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="space-y-3">
                          {notification.complaintId && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Related Complaint</p>
                              <Link href={`/complaint/${notification.complaintId}`} className="text-sm font-medium text-primary hover:underline">
                                {notification.complaintId} - View Details
                              </Link>
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Officer Remarks</p>
                            <p className="text-sm text-foreground bg-muted/30 p-3 rounded">
                              {notification.type === 'complaint-update'
                                ? 'Status updated based on field inspection. Expected resolution within 3 days.'
                                : notification.type === 'escalation'
                                  ? 'This complaint has been escalated due to SLA breach. Immediate action required.'
                                  : 'System will be back online shortly. No manual intervention needed.'}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => setExpandedId(null)} className="mt-4">
                          Hide Details
                        </Button>
                      </div>
                    )}

                    {expandedId !== notification.id && (
                      <button
                        onClick={() => {
                          setExpandedId(notification.id)
                          markAsRead(notification.id)
                        }}
                        className="mt-3 flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        View Details
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
