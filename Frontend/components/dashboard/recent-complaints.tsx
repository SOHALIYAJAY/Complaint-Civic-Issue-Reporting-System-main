'use client'

import { Button } from '@/components/ui/button'
import { ChevronRight, AlertCircle, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface Complaint {
  id: string
  title: string
  category: string
  status: 'open' | 'in-progress' | 'resolved' | 'pending'
  dateSubmitted: string
  slaRemaining: string
}

export default function RecentComplaints() {
  const complaints: Complaint[] = [
    {
      id: 'CMP-2024-001',
      title: 'Pothole on Main Street',
      category: 'Roads',
      status: 'in-progress',
      dateSubmitted: '2024-02-10',
      slaRemaining: '2 days',
    },
    {
      id: 'CMP-2024-002',
      title: 'Water Leakage at Park',
      category: 'Water Supply',
      status: 'pending',
      dateSubmitted: '2024-02-12',
      slaRemaining: '5 days',
    },
    {
      id: 'CMP-2024-003',
      title: 'Street Light Not Working',
      category: 'Lighting',
      status: 'open',
      dateSubmitted: '2024-02-13',
      slaRemaining: '1 day',
    },
    {
      id: 'CMP-2024-004',
      title: 'Garbage Overflow',
      category: 'Sanitation',
      status: 'resolved',
      dateSubmitted: '2024-02-08',
      slaRemaining: 'Completed',
    },
    {
      id: 'CMP-2024-005',
      title: 'Damaged Road Markings',
      category: 'Roads',
      status: 'in-progress',
      dateSubmitted: '2024-02-11',
      slaRemaining: '3 days',
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      'open': { bg: 'bg-blue-500/10', text: 'text-blue-600', icon: <AlertCircle className="w-4 h-4" /> },
      'in-progress': { bg: 'bg-orange-500/10', text: 'text-orange-600', icon: <Clock className="w-4 h-4" /> },
      'resolved': { bg: 'bg-green-500/10', text: 'text-green-600', icon: <CheckCircle className="w-4 h-4" /> },
      'pending': { bg: 'bg-purple-500/10', text: 'text-purple-600', icon: <AlertCircle className="w-4 h-4" /> },
    }

    const config = statusConfig[status] || statusConfig['open']
    return (
      <span className={`${config.bg} ${config.text} text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 w-fit`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-primary">Recent Complaints</h2>

      <div className="glass-effect rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary/5 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Complaint ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">SLA Remaining</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {complaints.map((complaint, index) => (
                <tr key={index} className="hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-primary">{complaint.id}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{complaint.title}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{complaint.category}</td>
                  <td className="px-6 py-4">{getStatusBadge(complaint.status)}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{complaint.slaRemaining}</td>
                  <td className="px-6 py-4">
                    <button className="text-primary hover:text-secondary transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <Link href="/my-complaints">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            View All Complaints
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
