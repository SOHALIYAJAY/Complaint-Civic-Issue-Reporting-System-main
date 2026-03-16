"use client"

import { useState } from "react"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import AssignedComplaintsStats from "@/components/department/assigned-complaints-stats"
import AssignedComplaintsTable from "@/components/department/assigned-complaints-table"
import type { Complaint } from "@/components/department/assigned-complaints-table"
import AssignOfficerModal from "@/components/department/assign-officer-modal"
import ViewDetailsModal from "@/components/department/view-details-modal"
import AssignedAnalyticsSidebar from "@/components/department/assigned-analytics-sidebar"

export default function AssignedComplaintsPage() {
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)

  const handleAssign = (complaint: Complaint) => {
    setSelectedComplaint(complaint)
    setAssignModalOpen(true)
  }

  const handleViewDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint)
    setDetailsModalOpen(true)
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/department" className="flex items-center gap-1 text-slate-500 hover:text-[#1e40af] transition-colors">
          <Home className="w-3.5 h-3.5" />
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#1e40af] font-medium">Assigned Complaints</span>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Assigned Complaints</h1>
        <p className="text-sm text-slate-500 mt-1">Manage and update department-level complaints</p>
      </div>

      {/* Summary Cards */}
      <AssignedComplaintsStats />

      {/* Main Content: Table Only */}
      <div>
        <AssignedComplaintsTable onAssign={handleAssign} onViewDetails={handleViewDetails} initialView="category" />
      </div>

      {/* Modals */}
      <AssignOfficerModal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        complaint={selectedComplaint ? { id: selectedComplaint.id, title: selectedComplaint.title, officer: selectedComplaint.officer } : null}
      />
      <ViewDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        complaint={selectedComplaint}
      />
    </div>
  )
}
