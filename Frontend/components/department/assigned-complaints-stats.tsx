"use client"

import { useEffect, useState } from "react"
import api from '@/lib/axios'
import {
  FileText,
  Clock,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Flame,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

interface StatCard {
  label: string
  value: string
  trend: string
  trendUp: boolean
  icon: React.ReactNode
  borderColor: string
  iconBg: string
  iconColor: string
}

function AnimatedValue({ target }: { target: string }) {
  const [display, setDisplay] = useState("0")
  const numericTarget = parseFloat(target.replace(/,/g, ""))

  useEffect(() => {
    if (isNaN(numericTarget)) {
      setDisplay(target)
      return
    }
    const duration = 1200
    const steps = 36
    const increment = numericTarget / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= numericTarget) {
        setDisplay(target)
        clearInterval(timer)
      } else {
        setDisplay(Math.floor(current).toLocaleString())
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [numericTarget, target])

  return <span>{display}</span>
}


export default function AssignedComplaintsStats() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/getcomplaint/')
      const complaints = response.data
      
      setStats({
        total: complaints.length,
        pending: complaints.filter((c: any) => c.status === 'Pending').length,
        inProgress: complaints.filter((c: any) => c.status === 'in-progress').length,
        resolved: complaints.filter((c: any) => c.status === 'resolved').length
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      label: "Total Assigned",
      value: stats.total.toString(),
      icon: <FileText className="w-5 h-5" />,
      borderColor: "border-t-[#1e40af]",
      iconBg: "bg-blue-50",
      iconColor: "text-[#1e40af]",
    },
    {
      label: "Pending",
      value: stats.pending.toString(),
      icon: <Clock className="w-5 h-5" />,
      borderColor: "border-t-[#f59e0b]",
      iconBg: "bg-amber-50",
      iconColor: "text-[#f59e0b]",
    },
    {
      label: "In Progress",
      value: stats.inProgress.toString(),
      icon: <Loader2 className="w-5 h-5" />,
      borderColor: "border-t-[#3b82f6]",
      iconBg: "bg-sky-50",
      iconColor: "text-[#3b82f6]",
    },
    {
      label: "Resolved",
      value: stats.resolved.toString(),
      icon: <CheckCircle2 className="w-5 h-5" />,
      borderColor: "border-t-[#16a34a]",
      iconBg: "bg-green-50",
      iconColor: "text-[#16a34a]",
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-4 animate-pulse">
            <div className="h-20"></div>
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, i) => (
        <div
          key={i}
          className={`bg-white rounded-lg border border-[#e2e8f0] border-t-4 ${card.borderColor} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-4`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`${card.iconBg} ${card.iconColor} p-2 rounded-lg`}>
              {card.icon}
            </div>
          </div>
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
            {card.label}
          </p>
          <p className="text-2xl font-bold text-slate-800">
            <AnimatedValue target={card.value} />
          </p>
        </div>
      ))}
    </div>
  )
}
