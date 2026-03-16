'use client'

import { useState, useEffect } from 'react'
import { Eye, Edit, Trash } from 'lucide-react'

interface Complaint {
  id:number
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

interface ComplaintsTableProps {
  complaints: Complaint[]
  loading: boolean
  searchQuery: string
  selectedDepartment: string
  selectedStatus: string
  selectedPriority: string
  departments: Array<{ id: number; name: string }>
  onView: (complaint: Complaint) => void
  onUpdate: (complaint: Complaint) => void
  onDelete: (complaint: Complaint) => void
}

export default function ComplaintsTable({
  complaints,
  loading,
  searchQuery,
  selectedDepartment,
  selectedStatus,
  selectedPriority,
  departments,
  onView,
  onUpdate,
  onDelete
}: ComplaintsTableProps) {
  const [tableComplaints, setTableComplaints] = useState<Complaint[]>([])
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; complaint: Complaint | null }>({ open: false, complaint: null })
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  // Handle delete complaint
  const handleDeleteComplaint = async (complaint: Complaint) => {
    if (!confirm(`Are you sure you want to delete complaint "${complaint.title}"`)) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/complaintdelete/${complaint.id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      // if (!response.ok) {
      //   const errorText = await response.text()
      //   console.error('Delete response error:', errorText)
      //   throw new Error(`Failed to delete complaint: ${response.status} ${response.statusText}`)
      // }

      // Parse response to check for success message
      const result = await response.json()
      console.log('Delete response:', result)

      // Remove from local state
      setTableComplaints(prev => prev.filter(c => c.id !== complaint.id))
      
      // Call parent onDelete if provided
      if (onDelete) {
        onDelete(complaint)
      }

      if (result.success) {
        alert('Complaint deleted successfully!')
      } else {
        alert(`Error: ${result.error || 'Unknown error occurred'}`)
      }
    } catch (error: any) {
      console.error('Delete error:', error)
      alert(`Error deleting complaint: ${error.message}`)
    }
  }

  // Fetch complaints data from backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admincomplaints/`)
      .then((res) => res.json())
      .then((data) => { 
        setTableComplaints(data)
        console.log('✅ ComplaintsTable fetched complaints:', data)
      })
      .catch((error) => {
        console.error("Error fetching complaints:", error)
      })
  }, [])

  // Filter complaints based on all filter criteria
  const filteredComplaints = tableComplaints.filter((complaint) => {
    // Search filter - handle undefined values safely
    // Category may be returned as an object name in `category_name` or as `Category` string/number
    const complaintCategory = (complaint as any).category_name || (complaint as any).Category || ''
    const matchesSearch = searchQuery === '' || 
      (complaint.id && complaint.id.toString().includes(searchQuery.toLowerCase())) ||
      (complaint.id && complaint.id.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
      (complaint.title && complaint.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (complaintCategory && String(complaintCategory).toLowerCase().includes(searchQuery.toLowerCase()))
    
    // Department filter - handle undefined values safely
    // selectedDepartment may be an id string (from select value) or a department name.
    let selectedDeptName: string | undefined = undefined
    if (selectedDepartment && selectedDepartment !== 'all') {
      // try resolve by id
      const byId = departments.find(d => d.id.toString() === selectedDepartment)
      selectedDeptName = byId ? byId.name : selectedDepartment
    }
    const matchesDepartment = selectedDepartment === 'all' || 
      (complaintCategory && selectedDeptName && String(complaintCategory) === String(selectedDeptName))
    
    // Status filter - handle undefined values safely
    const matchesStatus = selectedStatus === 'all' || (complaint.status && complaint.status === selectedStatus)
    
    // Priority filter - handle undefined values safely
    const matchesPriority = selectedPriority === 'all' || (complaint.priority_level && complaint.priority_level === selectedPriority)
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesPriority
  })

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-700">Complaint ID</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700">Title</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700">Category</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700">Location</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700">District</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700">Priority</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700">Date</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr key="loading-row">
                <td colSpan={9} className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-blue-600">Loading complaints...</span>
                  </div>
                </td>
              </tr>
            ) : filteredComplaints.length > 0 ? (
              filteredComplaints.map((complaint, index) => {
                // Create a unique key using multiple fields to ensure uniqueness
                const uniqueKey = complaint.id || 
                  `${complaint.title}-${complaintCategory}-${index}`.replace(/\s+/g, '-').toString();
                
                return (
                  <tr key={uniqueKey} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-blue-600 font-semibold">{complaint.id}</td>
                  <td className="px-4 py-3 text-slate-800">{complaint.title}</td>
                  <td className="px-4 py-3 text-slate-600">{(complaint as any).category_name || (complaint as any).Category}</td>
                  <td className="px-4 py-3 text-slate-600">{complaint.location_address}</td>
                  <td className="px-4 py-3 text-slate-600">{complaint.location_District}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      complaint.priority_level === 'High' ? 'bg-red-100 text-red-700' :
                      complaint.priority_level === 'Medium' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {complaint.priority_level}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      complaint.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      complaint.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {complaint.current_time ? new Date(complaint.current_time).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onView(complaint)} 
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button 
                        onClick={() => onUpdate(complaint)} 
                        className="text-emerald-600 hover:text-emerald-800 font-medium text-xs flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Update
                      </button>
                      <button 
                        onClick={() => handleDeleteComplaint(complaint)} 
                        className="text-red-600 hover:text-red-800 font-medium text-xs flex items-center gap-1"
                      >
                        <Trash className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })
            ) : (
              <tr key="empty-state">
                <td colSpan={9} className="px-4 py-8 text-center">
                  <div className="text-slate-500">
                    <p className="text-lg font-medium mb-2">No complaints found</p>
                    <p className="text-sm">Try adjusting your filters or search criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
