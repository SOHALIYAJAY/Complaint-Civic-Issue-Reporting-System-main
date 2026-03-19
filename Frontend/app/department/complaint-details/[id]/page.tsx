'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  MessageSquare, 
  Image as ImageIcon,
  Calendar,
  Tag,
  Building,
  Map,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'

interface ComplaintDetails {
  comp_name: string
  filed_on: string
  description: string
  upload_image?: string
  status: string
  priority: string
  location_address: string
  location_district: string
  location_taluk: string
  officer_id?: string
}

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
  'Resolved': 'bg-green-100 text-green-800 border-green-200',
  'Rejected': 'bg-red-100 text-red-800 border-red-200'
}

const priorityColors = {
  'High': 'bg-red-500',
  'Medium': 'bg-yellow-500',
  'Low': 'bg-green-500'
}

export default function ComplaintDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [complaint, setComplaint] = useState<ComplaintDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Unwrap the params Promise
  const { id } = use(params)
  
  // Validate ID
  if (!id || isNaN(Number(id))) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Complaint ID</h2>
          <p className="text-gray-600 mb-6">The complaint ID provided is not valid.</p>
          <Link 
            href="/department/assigned"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Complaints
          </Link>
        </div>
      </div>
    )
  }

  useEffect(() => {
    fetchComplaintDetails()
  }, [id])

  const fetchComplaintDetails = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
      console.log('Fetching complaint details for ID:', id)
      console.log('API URL:', `${API_BASE}/api/complaintindetails/${id}/`)
      
      // Get authentication token
      const token = localStorage.getItem('access_token') || localStorage.getItem('adminToken')
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (token && token !== 'undefined' && token !== 'null') {
        headers['Authorization'] = `Bearer ${token}`
        console.log('Using authentication token')
      } else {
        console.log('No authentication token found')
      }
      
      const response = await fetch(`${API_BASE}/api/complaintindetails/${id}/`, {
        headers
      })
      
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        
        // Check if it's a serialization error (common with FileField issues)
        if (errorText.includes('has no file associated with it')) {
          throw new Error('Server error: File serialization issue. Please contact administrator.')
        }
        
        throw new Error(`Failed to fetch complaint details: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Response data:', data)
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setComplaint({
        comp_name: data.comp_name,
        filed_on: data.filed_on,
        description: data.description,
        upload_image: data.upload_image || data.image_video || null,
        status: data.status,
        priority: data.priority,
        location_address: data.location_address,
        location_district: data.location_district,
        location_taluk: data.location_taluk,
        officer_id: data.officer_id
      })
      
    } catch (error) {
      console.error('Error fetching complaint details:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('Detailed error:', errorMessage)
      setError(`Failed to load complaint details: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading complaint details...</p>
        </div>
      </div>
    )
  }

  if (error || !complaint) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Complaint not found'}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={fetchComplaintDetails}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
            <Link 
              href="/department/assigned"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Complaints
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                href="/department/assigned"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Complaints
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">Complaint Details</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${statusColors[complaint.status as keyof typeof statusColors]}`}>
                <div className={`w-2 h-2 rounded-full ${priorityColors[complaint.priority as keyof typeof priorityColors]}`}></div>
                {complaint.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complaint Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{complaint.comp_name}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Filed on {complaint.filed_on}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      <span className="font-medium">{complaint.priority} Priority</span>
                    </div>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${priorityColors[complaint.priority as keyof typeof priorityColors]}`}></div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{complaint.description}</p>
              </div>
            </div>

            {/* Location Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500" />
                Location Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Address</p>
                    <p className="text-gray-700">{complaint.location_address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Map className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">District</p>
                    <p className="text-gray-700">{complaint.location_district}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Taluk</p>
                    <p className="text-gray-700">{complaint.location_taluk}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Attached Media */}
            {complaint.upload_image && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-500" />
                  Attached Media
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative group cursor-pointer">
                    <img 
                      src={complaint.upload_image} 
                      alt="Complaint attachment"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-500" />
                Status Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Complaint Filed</p>
                    <p className="text-xs text-gray-600">{complaint.filed_on}</p>
                    <p className="text-sm text-gray-700 mt-1">Citizen submitted the complaint</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Currently In Progress</p>
                    <p className="text-xs text-gray-600">Status: {complaint.status}</p>
                    <p className="text-sm text-gray-700 mt-1">Department is actively working on this complaint</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <User className="w-5 h-5" />
                  Assign Officer
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <CheckCircle2 className="w-5 h-5" />
                  Mark Resolved
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                  Add Note
                </button>
              </div>
            </div>

            {/* Assigned Officer */}
            {complaint.officer_id && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Officer</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Officer ID: {complaint.officer_id}</p>
                    <p className="text-sm text-gray-600">Public Works Department</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Phone className="w-4 h-4" />
                    Contact Officer
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Mail className="w-4 h-4" />
                    Send Message
                  </button>
                </div>
              </div>
            )}

            {/* Status Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[complaint.status as keyof typeof statusColors]}`}>
                    {complaint.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Priority Level</span>
                  <span className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${priorityColors[complaint.priority as keyof typeof priorityColors]}`}></div>
                    <span className="text-sm font-medium">{complaint.priority}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Filed On</span>
                  <span className="text-sm font-medium">{complaint.filed_on}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
