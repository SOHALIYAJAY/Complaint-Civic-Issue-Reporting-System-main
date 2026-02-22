'use client'

import { Card } from '@/components/ui/card'
import { FileText, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react'

interface ComplaintStat {
  label: string
  value: number
  icon: React.ReactNode
  bgColor: string
  textColor: string
}

export default function ComplaintSummary() {
  const stats: ComplaintStat[] = [
    {
      label: 'Total Complaints',
      value: 24,
      icon: <FileText className="w-6 h-6" />,
      bgColor: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-600',
    },
    {
      label: 'Active Complaints',
      value: 6,
      icon: <AlertCircle className="w-6 h-6" />,
      bgColor: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-600',
    },
    {
      label: 'Resolved Complaints',
      value: 18,
      icon: <CheckCircle className="w-6 h-6" />,
      bgColor: 'bg-green-50 border-green-200',
      textColor: 'text-green-600',
    },
    {
      label: 'Escalated Complaints',
      value: 2,
      icon: <TrendingUp className="w-6 h-6" />,
      bgColor: 'bg-red-50 border-red-200',
      textColor: 'text-red-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={`border ${stat.bgColor} bg-white shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`${stat.textColor}`}>
              {stat.icon}
            </div>
          </div>
          <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
          <p className={`text-3xl font-bold ${stat.textColor} mt-2`}>{stat.value}</p>
        </Card>
      ))}
    </div>
  )
}
