'use client'

import { AlertCircle, CheckCircle, Clock, Zap, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

interface StatCard {
  label: string
  value: number
  icon: React.ReactNode
  bgColor: string
  textColor: string
  borderColor: string
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
  const stats: StatCard[] = [
    {
      label: 'Total Complaints',
      value: 24,
      icon: <AlertCircle className="w-6 h-6" />,
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-500/20',
    },
    {
      label: 'Active Complaints',
      value: 6,
      icon: <TrendingUp className="w-6 h-6" />,
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-500/20',
    },
    {
      label: 'Resolved Complaints',
      value: 18,
      icon: <CheckCircle className="w-6 h-6" />,
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-600',
      borderColor: 'border-green-500/20',
    },
    {
      label: 'SLA Compliance',
      value: 94,
      icon: <Zap className="w-6 h-6" />,
      bgColor: 'bg-orange-500/10',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-500/20',
      suffix: '%',
    },
    {
      label: 'Pending',
      value: 4,
      icon: <Clock className="w-6 h-6" />,
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-600',
      borderColor: 'border-red-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
            {(stat as any).suffix && <span className="text-xl">{(stat as any).suffix}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
