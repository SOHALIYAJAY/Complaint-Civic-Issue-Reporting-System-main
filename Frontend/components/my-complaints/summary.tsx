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

interface StatCard {
  label: string
  value: number
  icon: React.ReactNode
  color: string
  bgColor: string
}

function AnimatedCounter({ targetValue }: { targetValue: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = targetValue
    const duration = 1500
    const increment = end / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [targetValue])

  return <>{count.toLocaleString()}</>
}

export default function ComplaintsSummary() {
  const [stats, setStats] = useState<StatCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  
  // Use consistent API URL with list.tsx
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log(`Fetching stats from: ${API_BASE}/complaintsinfo/`)
      
      // Test connectivity first
      try {
        const testRes = await Promise.race([
          fetch(`${API_BASE}/api/getcomplaint/`, { method: 'HEAD', mode: 'no-cors' }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 5000))
        ])
        console.log('Backend connectivity test passed')
      } catch (testErr) {
        console.warn('Backend connectivity test failed:', testErr)
      }
      
      const res = await fetch(`${API_BASE}/complaintsinfo/`, { 
        mode: 'cors', 
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(10000)
      })
      
      if (!res.ok) {
        const text = await res.text()
        console.error('API Error Response:', text?.substring?.(0, 500) ?? text)
        throw new Error(`API returned ${res.status}: ${res.statusText}`)
      }
      
      const text = await res.text()
      let data: BackendResponse
      try {
        data = JSON.parse(text)
      } catch (e) {
        console.error('Failed to parse JSON:', text?.substring?.(0, 500) ?? text)
        throw new Error('Invalid JSON response from API')
      }
      
      const formattedStats: StatCard[] = [
        {
          label: "Total Complaints",
          value: data.total_comp,
          icon: <AlertCircle size={24} />,
          color: "text-blue-500",
          bgColor: "bg-blue-100",
        },
        {
          label: "Resolved",
          value: data.resolved_comp,
          icon: <CheckCircle size={24} />,
          color: "text-green-500",
          bgColor: "bg-green-100",
        },
        {
          label: "Pending",
          value: data.pending_comp,
          icon: <Clock size={24} />,
          color: "text-yellow-500",
          bgColor: "bg-yellow-100",
        },
        {
          label: "In-Progress",
          value: data.inprogress_comp,
          icon: <Zap size={24} />,
          color: "text-red-500",
          bgColor: "bg-red-100",
        },
      ]
      setStats(formattedStats)
      setError(null)
    } catch (err) {
      let errorMsg = 'Unknown error occurred'
      
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        errorMsg = `Cannot connect to backend at ${API_BASE}. Make sure Django is running and accessible.`
      } else if (err instanceof Error) {
        if (err.message.includes('timeout')) {
          errorMsg = `Backend at ${API_BASE} is not responding (timeout)`
        } else {
          errorMsg = err.message
        }
      }
      
      console.error('Failed to fetch stats:', errorMsg)
      console.error('Full error:', err)
      setError(errorMsg)
      setStats([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [API_BASE])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    fetchStats()
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg p-6 border bg-gray-50 animate-pulse h-32" />
        ))}
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="rounded-lg p-6 border border-red-200 bg-red-50">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-red-800 font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Backend Connection Error
            </p>
            <p className="text-red-700 text-sm mb-4">{error}</p>
          </div>
        </div>
        
        <div className="mb-4 p-3 bg-red-100 rounded text-red-900 text-xs">
          <strong>Quick Fixes:</strong>
          <ol className="list-decimal ml-5 mt-2 space-y-1">
            <li>Open terminal in Backend/Civic folder</li>
            <li>Run: <code className="bg-white px-1 py-0.5 rounded">python manage.py runserver</code></li>
            <li>Check that it shows "Starting development server at http://127.0.0.1:8000/"</li>
            <li>If using non-standard port, update <code className="bg-white px-1 py-0.5 rounded">.env.local</code></li>
          </ol>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleRetry}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Connection
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              const url = `${API_BASE}/api/getcomplaint/`
              window.open(url, '_blank')
            }}
            className="border-red-300"
          >
            Test Backend
          </Button>
        </div>
        
        <p className="text-red-600 text-xs mt-4">
          <strong>API URL:</strong> {API_BASE}/complaintsinfo/
          <br />
          <strong>Retry Attempts:</strong> {retryCount}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-lg p-6 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`${stat.bgColor} rounded-lg p-3`}>
              <div className={stat.color}>{stat.icon}</div>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">
            {stat.label}
          </p>
          <div className="text-3xl sm:text-4xl font-bold">
            <AnimatedCounter targetValue={stat.value} />
          </div>
        </div>
      ))}
    </div>
  )
}