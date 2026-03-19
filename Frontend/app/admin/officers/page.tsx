"use client"

import { useState } from "react"
import { UserPlus, BarChart3, Search } from "lucide-react"
import OfficersKpiCards from "@/components/admin/officers/officers-kpi-cards"
import OfficersTable from "@/components/admin/officers/officers-table"
import OfficerProfileModal from "@/components/admin/officers/officer-profile-modal"
import AddOfficerModal from "@/components/department/add-officer-modal"
import OfficersAnalytics from "@/components/department/officers-analytics"
import EditOfficerModal from "@/components/admin/officers/edit-officer-modal"
import DeleteOfficerModal from "@/components/admin/officers/delete-officer-modal"
import { Officer } from "@/components/admin/officers/officers-table"

export default function AdminOfficersPage() {
  const [profileOfficerId, setProfileOfficerId] = useState<string | null>(null)
  const [showAddOfficer, setShowAddOfficer] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null)
  const [deletingOfficer, setDeletingOfficer] = useState<Officer | null>(null)

  const handleEditOfficer = (officer: Officer) => {
    setEditingOfficer(officer)
  }

  const handleDeleteOfficer = (officerId: string) => {
    // Find the officer from the table data
    // This is a simplified approach - in real implementation, you'd get the full officer object
    const officer: Officer = {
      officer_id: officerId,
      name: '', // This would be populated from the table data
      email: '',
      phone: '',
      is_available: true
    }
    setDeletingOfficer(officer)
  }

  const handleSaveOfficer = (updatedOfficer: Officer) => {
    // Refresh the officers table
    window.location.reload()
  }

  const handleConfirmDelete = () => {
    // Refresh the officers table
    window.location.reload()
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Officers Management</h1>
            <p className="text-blue-700 mt-1 text-sm">Monitor and manage all department officers</p>
          </div>
          <button
            onClick={() => setShowAddOfficer(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <UserPlus className="w-4 h-4" />
            Add Officer
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <OfficersKpiCards />

      {/* Filters & Actions */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium border ${
              showAnalytics
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
        </div>
      </div>

      {/* Analytics Section */}
      {showAnalytics && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Officer Performance Analytics</h2>
          <OfficersAnalytics />
        </div>
      )}

      {/* Officers Table */}
      <OfficersTable
        onViewProfile={(officerId) => setProfileOfficerId(officerId)}
        onAssignComplaint={() => {}}
        onEditOfficer={handleEditOfficer}
        onDeleteOfficer={handleDeleteOfficer}
      />

      {/* Profile Modal */}
      {profileOfficerId && (
        <OfficerProfileModal
          officerId={profileOfficerId}
          open={!!profileOfficerId}
          onClose={() => setProfileOfficerId(null)}
        />
      )}

      {/* Edit Officer Modal */}
      {editingOfficer && (
        <EditOfficerModal
          officer={editingOfficer}
          isOpen={!!editingOfficer}
          onClose={() => setEditingOfficer(null)}
          onSave={handleSaveOfficer}
        />
      )}

      {/* Delete Officer Modal */}
      {deletingOfficer && (
        <DeleteOfficerModal
          officer={deletingOfficer}
          isOpen={!!deletingOfficer}
          onClose={() => setDeletingOfficer(null)}
          onDelete={handleConfirmDelete}
        />
      )}

      {/* Add Officer Modal */}
      <AddOfficerModal
        open={showAddOfficer}
        onClose={() => setShowAddOfficer(false)}
        onSuccess={() => setShowAddOfficer(false)}
      />
    </div>
  )
}
