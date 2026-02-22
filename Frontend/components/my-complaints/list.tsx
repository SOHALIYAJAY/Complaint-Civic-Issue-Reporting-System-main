'use client'

import { useState, useEffect } from 'react'
// import { useState } from 'react'
import { ChevronRight, AlertTriangle, MapPin, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Complaint {
  id: string
  title: string
  Category: string
  location_address: string
  current_time: string
  status: 'Pending' | 'in-progress' | 'resolved'
  priority_level: 'Low' | 'Medium' | 'High'
  Description: string
  image_video?: string
  slaCompliance: number
  officerRemarks?: string
  timeline: Array<{ step: string; date: string; status: 'completed' | 'pending' }>
  estimatedResolution?: string
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
   Pending: { bg: 'bg-orange-500/10', text: 'text-orange-700', border: 'border-orange-500/20' },
  'in-progress': { bg: 'bg-purple-500/10', text: 'text-purple-700', border: 'border-purple-500/20' },
  resolved: { bg: 'bg-green-500/10', text: 'text-green-700', border: 'border-green-500/20' },

}

const priorityColors: Record<string, string> = {
  Low: 'bg-blue-100 text-blue-800',
  Medium: 'bg-orange-100 text-orange-800',
  High: 'bg-red-100 text-red-800',
}

export default function ComplaintsList({
  filterStatus,
  searchTerm,
  categoryFilter,
  sortBy,
  dateRange,
  onSelectComplaint,
}: {
  filterStatus: string
  searchTerm: string
  categoryFilter: string
  sortBy: string
  dateRange: string
  onSelectComplaint: (complaint: Complaint) => void
  complaints: Complaint[]
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [complaints, setComplaints] = useState<Complaint[]>([])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getcomplaint/`)
      .then((res) => res.json())
      .then((data) => {
        setComplaints(data)
      })
      .catch((error) => {
        console.error("Error fetching complaints:", error)
      })
  }, [])

  const itemsPerPage = 6

  const getDateFilter = (days: string) => {
    if (days === 'all') return null
    const date = new Date()
    date.setDate(date.getDate() - parseInt(days))
    return date
  }

  let filteredComplaints = complaints
    .filter(c => filterStatus === 'all' || c.status.toLowerCase() === filterStatus.toLowerCase())
    .filter(c => categoryFilter === 'all' || c.Category === categoryFilter)
    .filter(c => {
      const cutoffDate = getDateFilter(sortBy === 'priority' ? 'all' : sortBy === 'latest' && complaints.length > 0 ? 'all' : 'all')
      if (!cutoffDate) return true
      return new Date(c.current_time) >= cutoffDate
    })
    .filter(
      c =>
        String(c.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(c.title).toLowerCase().includes(searchTerm.toLowerCase())
    )

  if (sortBy === 'oldest') {
    filteredComplaints = [...filteredComplaints].reverse()
  } else if (sortBy === 'priority') {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    filteredComplaints = [...filteredComplaints].sort(
      (a, b) => priorityOrder[a.priority_level.toLowerCase() as keyof typeof priorityOrder] - priorityOrder[b.priority_level.toLowerCase() as keyof typeof priorityOrder]
    )
  } else {
    // Default: latest first (most recent first)
    filteredComplaints = [...filteredComplaints].sort(
      (a, b) => new Date(b.current_time).getTime() - new Date(a.current_time).getTime()
    )
  }

  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const paginatedComplaints = filteredComplaints.slice(startIdx, startIdx + itemsPerPage)

  if (filteredComplaints.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-16">
            <AlertTriangle className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Complaints Found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              No complaints match your current filters. Try adjusting your search criteria or resetting filters.
            </p>
            <Button className="mt-6 bg-primary hover:bg-secondary">
              Raise a New Complaint
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {paginatedComplaints.map(complaint => (
            <div
              key={complaint.id}
              className="glass-effect rounded-lg border border-border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3 gap-4">
                    <div className="flex-1">
                      <p className="text-xs font-mono text-muted-foreground mb-1">{complaint.id}</p>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {complaint.title}
                      </h3>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[complaint.priority_level]}`}>
                        {complaint.priority_level.charAt(0).toUpperCase() + complaint.priority_level.slice(1)}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          statusColors[complaint.status].bg
                        } ${statusColors[complaint.status].text} ${statusColors[complaint.status].border}`}
                      >
                        {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {complaint.Description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground truncate">{complaint.location_address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground">{new Date(complaint.current_time).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-foreground">SLA:</span>
                      <span className="text-green-600 font-semibold">{complaint.slaCompliance}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-foreground">Resolution:</span>
                      <span className="text-primary font-semibold">{complaint.estimatedResolution}</span>
                    </div>
                  </div>
                </div>

                {/* Expand Button */}
                <div className="flex items-center lg:items-start flex-shrink-0">
                  <Button
                    variant="outline"
                    className="border-border hover:bg-primary hover:text-primary-foreground group/btn cursor-pointer"
                    onClick={() => onSelectComplaint(complaint)}
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="border-border"
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? 'bg-primary' : 'border-border'}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="border-border"
            >
              Next
            </Button>
          </div>
        )}
      </div>

    </section>
  )
}
