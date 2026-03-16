"use client"

import { useState } from "react"
import { ChevronRight, LayoutDashboard, Users } from "lucide-react"
import OfficersKpiCards from "@/components/department/officers-kpi-cards"
import OfficersTable from "@/components/department/officers-table"
import type { Officer } from "@/components/department/officers-table"
import OfficerProfileModal from "@/components/department/officer-profile-modal"
import AssignComplaintToOfficerModal from "@/components/department/assign-complaint-modal"
// import OfficerPerformancePanel from "@/components/department/officer-performance-panel"

export default function OfficersPage() {
  const [profileOfficerId, setProfileOfficerId] = useState<string | null>(null)
  const [assignOfficer, setAssignOfficer] = useState<Officer | null>(null)

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <LayoutDashboard className="w-4 h-4" />
        <span>Dashboard</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#1e40af] font-medium flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          Officers
        </span>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Department Officers</h1>
        <p className="text-sm text-slate-500 mt-1">Manage officer assignments and performance</p>
      </div>

      {/* KPI Cards */}
      <OfficersKpiCards />

      {/* Table */}
      <div>
        <OfficersTable
          onViewProfile={(officerId) => setProfileOfficerId(officerId)}
          onAssignComplaint={(o) => setAssignOfficer(o)}
        />
      </div>

      {/* Modals */}
      {profileOfficerId && (
        <OfficerProfileModal
          officerId={profileOfficerId}
          open={!!profileOfficerId}
          onClose={() => setProfileOfficerId(null)}
        />
      )}

      {assignOfficer && (
        <AssignComplaintToOfficerModal
          officer={assignOfficer}
          open={!!assignOfficer}
          onClose={() => setAssignOfficer(null)}
        />
      )}
    </div>
  )
}
