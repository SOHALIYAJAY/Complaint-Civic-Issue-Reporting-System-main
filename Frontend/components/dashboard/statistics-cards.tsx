'use client'

import { AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

interface StatCard {
  label: string
  value: number
  icon: React.ReactNode
  bgColor: string
  textColor: string
  borderColor: string
  suffix?: string
}

function AnimatedCounter({ targetValue }: { targetValue: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = targetValue / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= targetValue) {
        setCount(targetValue)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [targetValue])

  return <span>{count}</span>
}

export default function StatisticsCards() {
  const [info, setInfo] = useState<any>({})
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
  
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/getcompinfo/`)
      .then((res) => res.json())
      .then((data) => { 
        console.log('Dashboard stats:', data)
        setInfo(data)
      })
      .catch((error) => {
        console.error("Error fetching complaints:", error)
      })
  }, [])

  const stats: StatCard[] = [
    {
      label: 'Total Complaints',
      value: info.total_complaints || 0,
      icon: <AlertCircle className="w-6 h-6" />,
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-500/20',
    },
    {
      label: 'Pending',
      value: info.Pending_complaints || 0,
      icon: <Clock className="w-6 h-6" />,
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-500/20',
    },
    {
      label: 'Resolved',
      value: info.Resolved_complaints || 0,
      icon: <CheckCircle className="w-6 h-6" />,
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-600',
      borderColor: 'border-green-500/20',
    },
    {
      label: 'SLA Compliance',
      value: Math.round(info.SLA_complaince || 0),
      icon: <TrendingUp className="w-6 h-6" />,
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-500/20',
      suffix: '%'
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`glass-effect rounded-lg p-6 border ${stat.borderColor} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`${stat.bgColor} rounded-lg p-3 group-hover:scale-110 transition-transform`}>
              <div className={stat.textColor}>{stat.icon}</div>
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-2">{stat.label}</p>
          <div className={`text-3xl sm:text-4xl font-bold ${stat.textColor}`}>
            <AnimatedCounter targetValue={stat.value} />
            {stat.suffix && <span className="text-xl">{stat.suffix}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
