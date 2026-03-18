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
  const [loading, setLoading] = useState(true)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
  
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const isTokenValid = Boolean(token && token !== 'undefined' && token !== 'null')
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    
    if (isTokenValid) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    fetch(`${API_BASE_URL}/api/getcompinfo/`, { headers })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            console.warn('Authentication failed for dashboard stats')
            // Set default values if not authenticated
            setInfo({
              total_complaints: 0,
              Resolved_complaints: 0,
              Pending_complaints: 0,
              SLA_complaince: 0,
              total_categories: 0
            })
            setLoading(false)
            return
          }
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => { 
        console.log('Dashboard stats:', data)
        setInfo(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching dashboard complaints:", error)
        // Set default values on error
        setInfo({
          total_complaints: 0,
          Resolved_complaints: 0,
          Pending_complaints: 0,
          SLA_complaince: 0,
          total_categories: 0
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const stats: StatCard[] = [
    {
      label: 'Total Complaints',
      value: (info && (info.total_complaints || info.total_comp)) || 0,
      icon: <AlertCircle className="w-6 h-6" />,
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-500/20',
    },
    {
      label: 'Pending',
      value: (info && (info.Pending_complaints || info.pending_comp)) || 0,
      icon: <Clock className="w-6 h-6" />,
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-500/20',
    },
    {
      label: 'Resolved',
      value: (info && (info.Resolved_complaints || info.resolved_comp)) || 0,
      icon: <CheckCircle className="w-6 h-6" />,
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-600',
      borderColor: 'border-green-500/20',
    },
    {
      label: 'SLA Compliance',
      value: (info && (info.SLA_complaince || info.sla_comp)) ? parseFloat((info.SLA_complaince || info.sla_comp).toFixed(2)) : 0,
      icon: <TrendingUp className="w-6 h-6" />,
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-500/20',
      suffix: '%'
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {loading ? (
        // Loading skeleton cards
        Array.from({ length: 4 }).map((_, index) => (
          <div key={`loading-${index}`} className="glass-effect rounded-lg border border-border p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            </div>
          </div>
        ))
      ) : (
        // Actual stats cards
        stats.map((stat, index) => (
          <div
            key={index}
            className={`glass-effect rounded-lg border ${stat.borderColor} p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                {stat.icon}
              </div>
              {stat.suffix && (
                <AnimatedCounter targetValue={stat.value} />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.textColor}`}>
              {stat.suffix ? `${stat.value}${stat.suffix}` : stat.value}
            </p>
          </div>
        ))
      )}
    </div>
  )
}
