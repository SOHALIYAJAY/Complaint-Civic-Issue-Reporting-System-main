"use client"

import React from "react"
import { CheckCircle, Clock, FileText, Activity, AlertCircle } from "lucide-react"

type DashboardStats = {
  totalComplaints: number
  resolvedComplaints: number
  pendingComplaints: number
  inProgressComplaints: number
}

export default function DashboardStatsCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    {
      label: 'Total Assigned',
      value: stats.totalComplaints || 0,
      icon: FileText,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      valueColor: 'text-gray-900',
      borderTop: 'border-t-blue-400',
    },
    {
      label: 'Resolved',
      value: stats.resolvedComplaints || 0,
      icon: CheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      valueColor: 'text-green-600',
      borderTop: 'border-t-green-400',
    },
    {
      label: 'In Progress',
      value: stats.inProgressComplaints || 0,
      icon: Activity,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      valueColor: 'text-yellow-600',
      borderTop: 'border-t-yellow-400',
    },
    {
      label: 'Pending',
      value: stats.pendingComplaints || 0,
      icon: Clock,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      valueColor: 'text-red-600',
      borderTop: 'border-t-red-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div key={card.label} className={`bg-white rounded-xl border border-gray-200 border-t-4 ${card.borderTop} shadow-sm p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.label}</p>
                <p className={`text-2xl font-bold mt-1 ${card.valueColor}`}>{card.value}</p>
              </div>
              <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
