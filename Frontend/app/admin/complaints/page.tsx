 'use client'

 import { useState, useEffect } from 'react'
 import { Download, Filter, RefreshCw } from 'lucide-react'
 import ComplaintsTable from '../../../components/admin/complaints/ComplaintsTable'
 import ComplaintsFilters from '../../../components/admin/complaints/ComplaintsFilters'
 import ComplaintsKPI from '../../../components/admin/complaints/ComplaintsKPI'
 import api from '@/lib/axios'

interface Complaint {
  id: number
  comp_id?: string
  title: string
  Category: string
  Description: string
  image_video?: string
  location_address: string
  location_District: string
  location_taluk: string
  priority_level: string
  status: string
  officer_id?: number
  current_time?: string
}

interface KPIData {
  total_comp: number
  Pending_comp: number
  resolved_comp: number
  inprogress_comp: number
  rejected_comp: number
  sla_compliance: number
}

export default function AllComplaintsPage() {
  // State for filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedDateRange, setSelectedDateRange] = useState('all')

  // State for data
  const [kpi, setKpi] = useState<KPIData>({
    total_comp: 0,
    Pending_comp: 0,
    resolved_comp: 0,
    inprogress_comp: 0,
    rejected_comp: 0,
    sla_compliance: 0,
  })

  const [complaintsList, setComplaintsList] = useState<Complaint[]>([])
  const [loadingKPI, setLoadingKPI] = useState(true)
  const [loadingComplaints, setLoadingComplaints] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Categories will be loaded from backend
  const [departments, setDepartments] = useState<Array<{ id: number; name: string }>>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
        const res = await fetch(`${API_BASE_URL}/api/categories/`)
        if (!res.ok) throw new Error('Failed to fetch categories')
        const data = await res.json()
        // API returns [{id,name,slug,...}]
        setDepartments(data.map((c: any) => ({ id: c.id, name: c.name })))
      } catch (err) {
        console.error('Failed to load categories, falling back to defaults', err)
        setDepartments([
          { id: 1, name: 'ROADS' },
          { id: 2, name: 'TRAFFIC' },
          { id: 3, name: 'WATER' },
          { id: 4, name: 'SEWERAGE' },
          { id: 5, name: 'SANITATION' },
          { id: 6, name: 'LIGHTING' },
          { id: 7, name: 'PARKS' },
          { id: 8, name: 'ANIMALS' },
          { id: 9, name: 'ILLEGAL_CONSTRUCTION' },
          { id: 10, name: 'ENCROACHMENT' },
          { id: 11, name: 'PROPERTY_DAMAGE' },
          { id: 12, name: 'ELECTRICITY' },
          { id: 13, name: 'OTHER' },
        ])
      }
    }

    fetchCategories()
  }, [])

  // Fetch KPI data from backend
  useEffect(() => {
    const fetchKPI = async () => {
      try {
        setLoadingKPI(true)
        setError(null)

        const response = await api.get('/api/admindashboardcard/')
        const data = response.data

        const transformedData: KPIData = {
          total_comp: data.total_comp ?? data.total_complaints ?? 0,
          Pending_comp: data.Pending_comp ?? data.pending_comp ?? 0,
          resolved_comp: data.resolved_comp ?? data.resolved_complaints ?? 0,
          inprogress_comp: data.inprogress_comp ?? data.inprogress_complaints ?? 0,
          rejected_comp: data.rejected_comp ?? data.rejected_complaints ?? 0,
          sla_compliance: data.sla_compliance ?? 0,
        }

        setKpi(transformedData)
      } catch (err: any) {
        console.error('❌ KPI fetch error:', err)
        setError('Failed to fetch KPI data')
        setKpi({
          total_comp: 0,
          Pending_comp: 0,
          resolved_comp: 0,
          inprogress_comp: 0,
          rejected_comp: 0,
          sla_compliance: 0,
        })
      } finally {
        setLoadingKPI(false)
      }
    }

    fetchKPI()
  }, [])

  // Fetch complaints data from backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoadingComplaints(true)
        setError(null)

        const response = await api.get('/api/admincomplaints/')
        const data = response.data

        setComplaintsList(Array.isArray(data) ? data : data.results ?? [])
      } catch (err: any) {
        console.error('❌ Complaints fetch error:', err)
        setError('Failed to fetch complaints data')
        setComplaintsList([])
      } finally {
        setLoadingComplaints(false)
      }
    }

    fetchComplaints()
  }, [])

  // State for selected complaint (for modal)
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [deletingComplaint, setDeletingComplaint] = useState<Complaint | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Event handlers
  const handleViewComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint)
    setIsModalOpen(true)
  }

  const handleUpdateComplaint = (complaint: Complaint) => {
    // Open edit modal with a shallow copy to edit
    setEditingComplaint({ ...complaint })
    setIsEditModalOpen(true)
  }

  const saveEditedComplaint = async () => {
    if (!editingComplaint) return
    const pk = editingComplaint.id
    if (!pk) { alert('Cannot determine complaint id for update'); return }
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
      const payload = {
        title: editingComplaint.title,
        Description: editingComplaint.Description,
        priority_level: editingComplaint.priority_level,
        status: editingComplaint.status,
        location_address: editingComplaint.location_address,
        location_District: editingComplaint.location_District,
        location_taluk: editingComplaint.location_taluk,
      }
      const res = await fetch(`${API_BASE_URL}/api/complaintupdate/${pk}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const result = await res.json().catch(() => ({}))
      if (!res.ok) {
        alert(`Failed to update: ${result.error || res.statusText}`)
        return
      }
      setComplaintsList(prev => prev.map(c => c.id === pk ? { ...c, ...payload } : c))
      setIsEditModalOpen(false)
      setEditingComplaint(null)
      alert('Complaint updated successfully')
    } catch (err: any) {
      console.error('Update error:', err)
      alert('Error updating complaint')
    }
  }

  const handleDeleteComplaint = (complaint: Complaint) => {
    setDeletingComplaint(complaint)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingComplaint) return
    const pk = deletingComplaint.id
    if (!pk) { alert('Cannot determine complaint id for delete'); return }
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
      const res = await fetch(`${API_BASE_URL}/api/complaintdelete/${pk}/`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`${res.status}`)
      setComplaintsList(prev => prev.filter(c => c.id !== pk))
      setIsDeleteModalOpen(false)
      setDeletingComplaint(null)
    } catch (err: any) {
      alert('Error deleting complaint: ' + err.message)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedComplaint(null)
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedDepartment('all')
    setSelectedStatus('all')
    setSelectedPriority('all')
    setSelectedDateRange('all')
  }

  const handleRefreshKPI = async () => {
    try {
      setLoadingKPI(true)
      setError(null)

      const response = await api.get('/api/admindashboardcard/')
      const data = response.data

      const transformedData: KPIData = {
        total_comp: data.total_comp ?? data.total_complaints ?? 0,
        Pending_comp: data.Pending_comp ?? data.pending_comp ?? 0,
        resolved_comp: data.resolved_comp ?? data.resolved_complaints ?? 0,
        inprogress_comp: data.inprogress_comp ?? data.inprogress_complaints ?? 0,
        rejected_comp: data.rejected_comp ?? data.rejected_complaints ?? 0,
        sla_compliance: data.sla_compliance ?? 0,
      }
      setKpi(transformedData)
    } catch (err: any) {
      console.error('❌ KPI refresh error:', err)
      setError('Failed to refresh KPI data')
      setKpi({
        total_comp: 0,
        Pending_comp: 0,
        resolved_comp: 0,
        inprogress_comp: 0,
        rejected_comp: 0,
        sla_compliance: 0,
      })
    } finally {
      setLoadingKPI(false)
    }
  }

  const handleRefresh = async () => {
    // Refetch both KPI and complaints data
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">All Complaints</h1>
            <p className="text-slate-600 mt-1">Manage and monitor all civic complaints</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <ComplaintsKPI 
        kpi={kpi} 
        loading={loadingKPI} 
        error={error} 
        onRefresh={handleRefreshKPI}
      />

      {/* Filters */}
      <ComplaintsFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        selectedDateRange={selectedDateRange}
        setSelectedDateRange={setSelectedDateRange}
      />

      {/* Complaints Table */}
      <ComplaintsTable
        complaints={complaintsList}
        loading={loadingComplaints}
        searchQuery={searchQuery}
        selectedDepartment={selectedDepartment}
        selectedStatus={selectedStatus}
        selectedPriority={selectedPriority}
        selectedDateRange={selectedDateRange}
        departments={departments}
        onView={handleViewComplaint}
        onUpdate={handleUpdateComplaint}
        onDelete={handleDeleteComplaint}
      />

      {/* View Modal */}
      {isModalOpen && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Complaint Details</h2>
              <button 
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">Complaint ID</p>
                  <p className="text-slate-900">{(selectedComplaint as any).id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Category</p>
                  <p className="text-slate-900">{selectedComplaint.Category}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">Location</p>
                  <p className="text-slate-900">{selectedComplaint.location_address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">District</p>
                  <p className="text-slate-900">{selectedComplaint.location_District}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">Priority</p>
                  <p className="text-slate-900">{selectedComplaint.priority_level}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Status</p>
                  <p className="text-slate-900">{selectedComplaint.status}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">Date</p>
                  <p className="text-slate-900">{selectedComplaint.current_time ? new Date(selectedComplaint.current_time).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Taluk</p>
                  <p className="text-slate-900">{selectedComplaint.location_taluk}</p>
                </div>
              </div>
                <div className="mt-6 flex justify-end gap-3">
                <button 
                  onClick={() => selectedComplaint && handleUpdateComplaint(selectedComplaint)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Update Complaint
                </button>
                <button 
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Edit Complaint</h2>
                <p className="text-xs text-slate-500 mt-0.5">ID: {editingComplaint.id}</p>
              </div>
              <button onClick={() => { setIsEditModalOpen(false); setEditingComplaint(null) }} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 text-xl">&times;</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input value={editingComplaint.title} onChange={(e) => setEditingComplaint({ ...editingComplaint, title: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea rows={3} value={editingComplaint.Description} onChange={(e) => setEditingComplaint({ ...editingComplaint, Description: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <select value={editingComplaint.priority_level} onChange={(e) => setEditingComplaint({ ...editingComplaint, priority_level: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select value={editingComplaint.status} onChange={(e) => setEditingComplaint({ ...editingComplaint, status: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="Pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location Address</label>
                  <input value={editingComplaint.location_address} onChange={(e) => setEditingComplaint({ ...editingComplaint, location_address: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">District</label>
                  <input value={editingComplaint.location_District} onChange={(e) => setEditingComplaint({ ...editingComplaint, location_District: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
              <button onClick={() => { setIsEditModalOpen(false); setEditingComplaint(null) }} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors">Cancel</button>
              <button onClick={saveEditedComplaint} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deletingComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Delete Complaint</h2>
                  <p className="text-sm text-slate-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-sm text-slate-700 bg-slate-50 rounded-lg px-4 py-3 border border-slate-200">
                Are you sure you want to delete <span className="font-semibold">&ldquo;{deletingComplaint.title}&rdquo;</span>?
              </p>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
              <button onClick={() => { setIsDeleteModalOpen(false); setDeletingComplaint(null) }} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
