'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, User } from 'lucide-react'

interface Complaint {
  id: string
  title: string
  Description: string
  location_address: string
  status: 'Pending'| 'in-progress' | 'resolved'
  Category: string
  current_time: string
  priority_level: 'Low' | 'Medium' | 'High'
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

export default function ActivityFeed() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

useEffect(() => {
  fetch(`${API_BASE_URL}/api/getcomplaint/`)
    .then((res) => res.json())
    .then((data) => { 
      setComplaints(data)
    })
    .catch((error) => {
      console.error("Error fetching complaints:", error)
    })
}, [])
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Live Complaint Activity
          </h2>
          <p className="text-lg text-muted-foreground">
            Real-time dashboard showing recent civic complaints and their status
          </p>
        </div>

        <div className="grid gap-4">
          {complaints.map((complaint, index) => (
            <div
              key={complaint.id}
              className="group bg-white rounded-lg border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 overflow-hidden hover:translate-y-[-2px] slide-in-up"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{statusConfig[complaint.status].icon}</span>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {complaint.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-sm">{complaint.Description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={`${statusConfig[complaint.status].color} border`}>
                      {statusConfig[complaint.status].label}
                    </Badge>
                    <Badge className={priorityConfig[complaint.priority_level].color}>
                      {priorityConfig[complaint.priority_level].label}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{complaint.location_address}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="font-medium">{complaint.Category}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{complaint.current_time}</span>
                  </div>
                </div>

                <div className="mt-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Complaint ID:</span> CIV-{complaint.id}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-secondary transition-colors">
            View All Complaints
          </button>
        </div>
      </div>
    </section>
  )
}
