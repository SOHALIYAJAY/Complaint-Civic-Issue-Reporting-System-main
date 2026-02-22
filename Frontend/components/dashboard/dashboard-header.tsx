'use client'

import { Calendar, User } from 'lucide-react'

export default function DashboardHeader() {
  const userName = 'Rajesh Kumar'
  const userRole = 'Citizen'
  const lastLogin = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

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
            Welcome Back, {userName}
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
              <p className="text-sm font-semibold text-foreground">{userRole}</p>
            </div>
          </div>

          <div className="glass-effect rounded-lg p-4 border border-border flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last Login</p>
              <p className="text-sm font-semibold text-foreground">{lastLogin}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
