'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle, Clock, Zap, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BackendResponse {
  total_comp: number
  resolved_comp: number
  pending_comp: number
  inprogress_comp: number
}

function AnimatedCounter({ targetValue }: { targetValue: number }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const increment = targetValue / (1200 / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= targetValue) { setCount(targetValue); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [targetValue])
  return <>{count}</>
}

const CARD_CONFIG = [
  { key: 'total_comp',      label: 'Total',       icon: AlertCircle,    accent: 'border-blue-500',   iconBg: 'bg-blue-50',   iconColor: 'text-blue-500',   bar: 'bg-blue-400' },
  { key: 'resolved_comp',   label: 'Resolved',    icon: CheckCircle,    accent: 'border-green-500',  iconBg: 'bg-green-50',  iconColor: 'text-green-500',  bar: 'bg-green-400' },
  { key: 'pending_comp',    label: 'Pending',     icon: Clock,          accent: 'border-amber-500',  iconBg: 'bg-amber-50',  iconColor: 'text-amber-500',  bar: 'bg-amber-400' },
  { key: 'inprogress_comp', label: 'In Progress', icon: Zap,            accent: 'border-purple-500', iconBg: 'bg-purple-50', iconColor: 'text-purple-500', bar: 'bg-purple-400' },
] as const

export default function ComplaintsSummary() {
  const [data, setData] = useState<BackendResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  const fetchStats = async () => {
    setLoading(true); setError(false)
    try {
      const token = localStorage.getItem('access_token')
      const headers: Record<string, string> = { 'Accept': 'application/json' }
      if (token && token !== 'undefined' && token !== 'null') headers['Authorization'] = `Bearer ${token}`
      const res = await fetch(`${API_BASE}/complaintsinfo/`, { headers, signal: AbortSignal.timeout(10000) })
      if (!res.ok) throw new Error()
      setData(await res.json())
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStats() }, [API_BASE])

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="rounded-xl border bg-muted/40 animate-pulse h-28" />)}
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 flex items-center justify-between">
        <p className="text-red-700 text-sm font-medium">Could not load statistics. Backend may be offline.</p>
        <Button size="sm" variant="outline" onClick={fetchStats} className="border-red-300 text-red-700 gap-2">
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </Button>
      </div>
    )
  }

  const total = data.total_comp || 1

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARD_CONFIG.map(({ key, label, icon: Icon, accent, iconBg, iconColor, bar }) => {
        const value = data[key]
        const pct = Math.round((value / total) * 100)
        return (
          <div key={key} className={`bg-card rounded-xl border-t-4 ${accent} border border-border shadow-sm p-5 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`${iconBg} rounded-lg p-2`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <span className="text-xs font-medium text-muted-foreground">{key === 'total_comp' ? '100%' : `${pct}%`}</span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">
              <AnimatedCounter targetValue={value} />
            </p>
            <p className="text-sm text-muted-foreground mb-3">{label}</p>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className={`h-full ${bar} rounded-full transition-all duration-700`} style={{ width: key === 'total_comp' ? '100%' : `${pct}%` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
