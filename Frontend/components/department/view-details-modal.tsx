"use client"

import { useState, useEffect } from "react"
import {
  X,
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
} from "lucide-react"
import type { Complaint } from "./assigned-complaints-table"

interface ViewDetailsModalProps {
  open: boolean
  onClose: () => void
  complaint: Complaint | null
}

const statusTimeline = [
  { label: "Complaint Filed", date: "Feb 15, 2026 09:30 AM", status: "done", note: "Citizen submitted via mobile app" },
  { label: "Assigned to Department", date: "Feb 15, 2026 10:15 AM", status: "done", note: "Auto-routed to Public Works Dept" },
  { label: "Officer Assigned", date: "Feb 15, 2026 11:00 AM", status: "done", note: "Assigned to Rajesh Kumar" },
  { label: "Field Visit Scheduled", date: "Feb 16, 2026 02:00 PM", status: "done", note: "Officer scheduled site inspection" },
  { label: "Work In Progress", date: "Feb 17, 2026 09:00 AM", status: "current", note: "Repair work initiated" },
  { label: "Resolution", date: "Pending", status: "pending", note: "Awaiting completion" },
]

const officerRemarks = [
  { officer: "Rajesh Kumar", date: "Feb 16, 2026", remark: "Visited site. Pothole is approximately 3ft wide. Requires immediate patching." },
  { officer: "Rajesh Kumar", date: "Feb 17, 2026", remark: "Repair team dispatched. Materials procured. Work started at 9 AM." },
]

export default function ViewDetailsModal({ open, onClose, complaint }: ViewDetailsModalProps) {
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setAnimateIn(true))
    } else {
      setAnimateIn(false)
    }
  }, [open])

  if (!open || !complaint) return null

  const handleClose = () => {
    setAnimateIn(false)
    setTimeout(onClose, 200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${animateIn ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />

      <div
        className={`relative bg-white rounded-xl shadow-xl border border-[#e2e8f0] w-full max-w-3xl transition-all duration-200 my-4 ${
          animateIn ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
      >

        <div className="flex items-center justify-between p-5 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#1e40af]/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#1e40af]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-800">Complaint Details</h3>
            <div className="text-xs text-slate-500">
              <p className="font-semibold text-slate-700 mb-1">Complaint ID: {complaint.id}</p>
              <p>Filed on: {new Date(complaint.current_time).toLocaleDateString()}</p>
            </div>
            </div>
          </div>
          <button onClick={handleClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">

          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Full Description</h4>
            <div className="bg-[#f1f5f9] rounded-lg p-4">
              <p className="text-sm font-medium text-slate-800 mb-1">{complaint.title}</p>
              <p className="text-sm text-slate-600">
                A {complaint.Category} issue has been reported at {complaint.location_address}, {complaint.location_District}. 
                The area requires immediate attention to prevent further issues.
              </p>
            </div>
          </div>

          {/* Two-column info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left - Location & Citizen */}
            <div className="space-y-3">
              <div className="bg-[#f1f5f9] rounded-lg p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Location Details</p>
                <div className="flex items-start gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-[#1e40af] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{complaint.location_address}</p>
                    <p className="text-xs text-slate-500">{complaint.location_District}, Gujarat</p>
                  </div>
                </div>
                <div className="bg-slate-200 rounded-lg h-28 flex items-center justify-center">
                  <span className="text-xs text-slate-500">Map View Placeholder</span>
                </div>
              </div>

              <div className="bg-[#f1f5f9] rounded-lg p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Citizen Info</p>
              <p className="text-xs text-slate-500">Citizen Information Not Available</p>
              </div>
            </div>

            {/* Right - Images & SLA */}
            <div className="space-y-3">
              <div className="bg-[#f1f5f9] rounded-lg p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Uploaded Images</p>
                <div className="grid grid-cols-2 gap-2">
                  {/* {[1, 2].map((i) => ( */}
                    <div className="bg-slate-200 rounded-lg h-28 flex items-center justify-center">
  {complaint?.image_video ? (
    <img
      src={`http://127.0.0.1:8000${complaint.image_video}`}
      alt={complaint.title}
      className="w-full h-full object-cover rounded-lg"
    />
  ) : (
    <span className="text-gray-500 text-sm">No Image</span>
  )}
</div>
                  {/* ))} */}
                </div>
              </div>

              <div className="bg-[#f1f5f9] rounded-lg p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Status & Priority</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Status:</span>
                    <span className="text-sm font-semibold text-slate-800">{complaint.status}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Priority:</span>
                    <span className="text-sm font-semibold text-slate-800">{complaint.priority_level}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Category:</span>
                    <span className="text-sm font-semibold text-slate-800">{complaint.Category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-[#e2e8f0]">
          <button onClick={handleClose} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 border border-[#e2e8f0] transition-colors">
            Close
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-[#1e40af] rounded-lg hover:bg-[#1e3a8a] transition-colors">
            Take Action
          </button>
        </div>
      </div>
    </div>
  )
}
  