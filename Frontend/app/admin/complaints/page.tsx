'use client'

import { useState, useEffect } from 'react'
import { Download, Filter, RefreshCw } from 'lucide-react'
import ComplaintsTable from '../../../components/admin/complaints/ComplaintsTable'
import ComplaintsFilters from '../../../components/admin/complaints/ComplaintsFilters'
import ComplaintsKPI from '../../../components/admin/complaints/ComplaintsKPI'

interface Complaint {
  comp_id: string
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
  sla_compliance: number
}

export default function AllComplaintsPage() {
  // State for filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')

  // State for data
  const [kpi, setKpi] = useState<KPIData>({
    total_comp: 0,
    Pending_comp: 0,
    resolved_comp: 0,
    inprogress_comp: 0,
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
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
        console.log('🔄 Fetching KPI data from:', `${API_BASE_URL}/api/admindashboardcard/`)
        const response = await fetch(`${API_BASE_URL}/api/admindashboardcard/`)
        
        if (!response.ok) throw new Error('KPI fetch failed')
        const data = await response.json()
        
        console.log('✅ KPI data received:', data)
        
        // Transform backend data to match expected format
        const transformedData = {
          total_comp: data.total_comp,
          Pending_comp: data.Pending_comp,
          resolved_comp: data.resolved_comp,
          inprogress_comp: data.inprogress_comp,
          sla_compliance: data.sla_compliance
        }
        console.log('🔄 Transformed KPI data:', transformedData)
        setKpi(transformedData)
      } catch (err: any) {
        console.error('❌ KPI fetch error:', err)
        setError('Failed to fetch KPI data')
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
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
        const response = await fetch(`${API_BASE_URL}/api/admincomplaints/`)
        
        if (!response.ok) throw new Error('Complaints fetch failed')
        const data = await response.json()
        
        console.log('✅ Fetched complaints:', data)
        setComplaintsList(data)
      } catch (err: any) {
        console.error('❌ Complaints fetch error:', err)
        setError('Failed to fetch complaints data')
        // Fallback to mock data if API fails
        setComplaintsList([
          { comp_id: 'CMP-2024-001', title: 'Pothole on Main Street', Category: 'ROADS', Description: 'Large pothole causing traffic issues', location_address: 'Main Street', location_District: 'Ahmedabad', location_taluk: 'Ahmedabad', priority_level: 'High', status: 'Pending', current_time: '2024-02-25T10:30:00Z' },
          { comp_id: 'CMP-2024-002', title: 'Water Leakage at Park', Category: 'WATER', Description: 'Water pipe leakage in public park', location_address: 'City Park', location_District: 'Surat', location_taluk: 'Surat', priority_level: 'Medium', status: 'in-progress', current_time: '2024-02-24T14:20:00Z' },
          { comp_id: 'CMP-2024-003', title: 'Power Outage Area', Category: 'ELECTRICITY', Description: 'Frequent power cuts in residential area', location_address: 'Residential Area', location_District: 'Vadodara', location_taluk: 'Vadodara', priority_level: 'High', status: 'in-progress', current_time: '2024-02-23T09:15:00Z' },
          { comp_id: 'CMP-2024-004', title: 'Garbage Collection Delay', Category: 'SANITATION', Description: 'Garbage not collected for 3 days', location_address: 'Main Road', location_District: 'Gandhinagar', location_taluk: 'Gandhinagar', priority_level: 'Low', status: 'resolved', current_time: '2024-02-22T16:45:00Z' },
          { comp_id: 'CMP-2024-005', title: 'Street Light Not Working', Category: 'LIGHTING', Description: 'Street light not working for 2 weeks', location_address: 'Street Corner', location_District: 'Ahmedabad', location_taluk: 'Ahmedabad', priority_level: 'Medium', status: 'Pending', current_time: '2024-02-21T11:30:00Z' },
        ])
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
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
      // Determine numeric PK for the update endpoint. Backend expects an integer PK.
      // Prefer `id` if present, otherwise try to extract digits from `comp_id`.
      const maybeId = (editingComplaint as any).id
      let pk: number | null = null
      if (typeof maybeId === 'number') pk = maybeId
      else if (editingComplaint.comp_id) {
        const digits = String(editingComplaint.comp_id).replace(/\D/g, '')
        pk = digits ? parseInt(digits, 10) : null
      }
      if (!pk) {
        alert('Cannot determine complaint id for update')
        return
      }
      const url = `${API_BASE_URL}/api/complaintupdate/${pk}/`
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingComplaint)
      })

      const result = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = result.error || `${res.status} ${res.statusText}`
        alert(`Failed to update complaint: ${msg}`)
        return
      }

      // Update local list: prefer matching by numeric id when available
      setComplaintsList(prev => prev.map(c => {
        const cId = (c as any).id ?? ((c as any).comp_id ? parseInt(String((c as any).comp_id).replace(/\D/g, ''), 10) : null)
        if (cId && pk && cId === pk) return editingComplaint
        // fallback to comp_id string match
        if ((c as any).comp_id && editingComplaint.comp_id && (c as any).comp_id === editingComplaint.comp_id) return editingComplaint
        return c
      }))
      setIsEditModalOpen(false)
      setEditingComplaint(null)
      alert('Complaint updated successfully')
    } catch (err: any) {
      console.error('Update error:', err)
      alert('Error updating complaint')
    }
  }

  const handleDeleteComplaint = (complaint: Complaint) => {
    // Delete complaint via API and update local state
    const doDelete = async () => {
      if (!confirm(`Are you sure you want to delete complaint "${complaint.title}" (ID: ${complaint.comp_id})?`)) return
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
        const res = await fetch(`${API_BASE_URL}/api/complaintdelete/${complaint.comp_id}/`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        })

        const result = await res.json().catch(() => ({}))
        console.log('Delete response:', result)

        if (!res.ok || result.success === false) {
          const msg = result.error || `${res.status} ${res.statusText}`
          alert(`Failed to delete complaint: ${msg}`)
          return
        }

        // Remove from list
        setComplaintsList(prev => prev.filter(c => c.comp_id !== complaint.comp_id))
        alert('Complaint deleted successfully')
      } catch (err: any) {
        console.error('Delete error:', err)
        alert('Error deleting complaint')
      }
    }

    doDelete()
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
  }

  const handleRefreshKPI = async () => {
    // Refetch KPI data only
    try {
      setLoadingKPI(true)
      setError(null)
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
      console.log('🔄 Refreshing KPI data...')
      const response = await fetch(`${API_BASE_URL}/api/admindashboardcart/`)
      
      if (!response.ok) throw new Error('KPI refresh failed')
      const data = await response.json()
      
      console.log('✅ KPI data refreshed:', data)
      
      const transformedData = {
        total_comp: data.total_comp,
        Pending_comp: data.Pending_comp,
        resolved_comp: data.resolved_comp,
        inprogress_comp: data.inprogress_comp,
        sla_compliance: data.sla_compliance
      }
      setKpi(transformedData)
    } catch (err: any) {
      console.error('❌ KPI refresh error:', err)
      setError('Failed to refresh KPI data')
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
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4 text-slate-600" />
              Filters
            </button>
            <button 
              onClick={handleRefresh}
              disabled={loadingKPI || loadingComplaints}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loadingKPI || loadingComplaints ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              <Download className="w-4 h-4 text-slate-600" />
              Export
            </button>
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
        departments={departments}
      />

      {/* Complaints Table */}
      <ComplaintsTable
        complaints={complaintsList}
        loading={loadingComplaints}
        searchQuery={searchQuery}
        selectedDepartment={selectedDepartment}
        selectedStatus={selectedStatus}
        selectedPriority={selectedPriority}
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
                  <p className="text-slate-900">{selectedComplaint.comp_id}</p>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Edit Complaint</h2>
              <button 
                onClick={() => { setIsEditModalOpen(false); setEditingComplaint(null) }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Title</label>
                <input value={editingComplaint.title} onChange={(e) => setEditingComplaint({ ...editingComplaint, title: e.target.value })} className="mt-1 block w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Category</label>
                <input value={editingComplaint.Category} onChange={(e) => setEditingComplaint({ ...editingComplaint, Category: e.target.value })} className="mt-1 block w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <textarea value={editingComplaint.Description} onChange={(e) => setEditingComplaint({ ...editingComplaint, Description: e.target.value })} className="mt-1 block w-full border rounded px-3 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Priority</label>
                  <select value={editingComplaint.priority_level} onChange={(e) => setEditingComplaint({ ...editingComplaint, priority_level: e.target.value })} className="mt-1 block w-full border rounded px-3 py-2">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Status</label>
                  <select value={editingComplaint.status} onChange={(e) => setEditingComplaint({ ...editingComplaint, status: e.target.value })} className="mt-1 block w-full border rounded px-3 py-2">
                    <option>Pending</option>
                    <option>in-progress</option>
                    <option>resolved</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Location Address</label>
                  <input value={editingComplaint.location_address} onChange={(e) => setEditingComplaint({ ...editingComplaint, location_address: e.target.value })} className="mt-1 block w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">District</label>
                  <input value={editingComplaint.location_District} onChange={(e) => setEditingComplaint({ ...editingComplaint, location_District: e.target.value })} className="mt-1 block w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  onClick={saveEditedComplaint}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Save Changes
                </button>
                <button 
                  onClick={() => { setIsEditModalOpen(false); setEditingComplaint(null) }}
                  className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
