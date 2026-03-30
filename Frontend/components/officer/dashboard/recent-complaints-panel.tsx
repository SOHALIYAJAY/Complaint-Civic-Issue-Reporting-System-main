"use client"

import React from "react"
import { Activity, Clock, Calendar, MapPin, User } from "lucide-react"

type RecentComplaint = {
  id: number
  title: string
  category: string
  status: string
  priority: string
  date: string
  citizenName: string
  location: string
  isOverdue?: boolean
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "pending":     return "bg-red-100 text-red-800 border-red-200"
    case "in-progress": return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "resolved":    return "bg-green-100 text-green-800 border-green-200"
    default:            return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function getPriorityColor(priority: string) {
  switch (priority?.toLowerCase()) {
    case "high":   return "bg-red-50 text-red-700 border-red-200"
    case "medium": return "bg-yellow-50 text-yellow-700 border-yellow-200"
    case "low":    return "bg-green-50 text-green-700 border-green-200"
    default:       return "bg-gray-50 text-gray-700 border-gray-200"
  }
}

export default function RecentComplaintsPanel({ complaints }: { complaints: RecentComplaint[] }) {
  const hasData = Array.isArray(complaints) && complaints.length > 0

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Complaints</h3>
        <Activity className="w-5 h-5 text-gray-400" />
      </div>

      {hasData ? (
        <div className="space-y-3">
          {complaints.map((c) => (
            <div key={c.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-900">#{c.id}</span>

                  {c.status.toLowerCase() === "pending" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                      <Clock className="w-3 h-3" />
                      Pending
                    </span>
                  )}

                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(c.status)}`}>
                    {c.status}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(c.priority)}`}>
                    {c.priority}
                  </span>
                </div>

                <h4 className="text-sm font-medium text-gray-900 mb-1">{c.title}</h4>

                <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {c.citizenName}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {c.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {c.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No recent complaints</p>
        </div>
      )}
    </div>
  )
}
