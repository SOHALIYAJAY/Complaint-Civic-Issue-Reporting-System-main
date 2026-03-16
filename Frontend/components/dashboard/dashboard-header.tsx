'use client'

import { useState, useEffect } from 'react'
import { Calendar, User } from 'lucide-react'

interface UserDetail {
  id: number
  Username: string
  email: string
  Date: string
  role?: string
}

const statusConfig = {
  Pending: { color: 'bg-red-50 text-red-700 border-red-200', label: 'Open', icon: '🔴' },
  'in-progress': { color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'In Progress', icon: '🟡' },
  resolved: { color: 'bg-green-50 text-green-700 border-green-200', label: 'Resolved', icon: '🟢' },
}

const priorityConfig = {
  High: { color: 'bg-red-100 text-red-800', label: 'High' },
  Medium: { color: 'bg-amber-100 text-amber-800', label: 'Medium' },
  Low: { color: 'bg-blue-100 text-blue-800', label: 'Low' },
}

export default function DashboardHeader() {
  const [user, setUser] = useState<UserDetail | null>(null)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
  
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    console.log('Token:', token ? 'exists' : 'missing')
    
    fetch(`${API_BASE_URL}/api/userdetails/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        console.log('Response status:', res.status)
        return res.json()
      })
      .then((data) => { 
        console.log('User data received:', data)
        setUser(data)
      })
      .catch((error) => {
        console.error("Error fetching user details:", error)
      })
  }, [])

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <a href="/" className="hover:text-primary transition-colors">
          Home
        </a>
        <span>/</span>
        <span className="text-foreground font-medium">Dashboard</span>
      </div>

      {/* Header Content */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-primary text-balance">
            Welcome Back, {user?.Username || 'Guest'}
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Here's your civic complaint dashboard overview
          </p>
        </div>

        {/* User Info Cards */}
        <div className="flex gap-4 flex-wrap">
          <div className="glass-effect rounded-lg p-4 border border-border flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="text-sm font-semibold text-foreground">{user?.role || 'Civic User'}</p>
            </div>
          </div>

          <div className="glass-effect rounded-lg p-4 border border-border flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last Login</p>
              <p className="text-sm font-semibold text-foreground">{user?.Date || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
