"use client"

import {
  X,
  FileText,
  User,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Eye,
} from "lucide-react"
import type { SentNotification } from "./sent-notifications-table"

const typeColors: Record<string, string> = {
  "Complaint Update": "bg-blue-50 text-[#1e40af] border-blue-200",
  Escalation: "bg-amber-50 text-[#f59e0b] border-amber-200",
  General: "bg-slate-100 text-slate-600 border-slate-200",
  Warning: "bg-red-50 text-[#dc2626] border-red-200",
}

const priorityColors: Record<string, string> = {
  Normal: "text-[#16a34a] bg-green-50",
  High: "text-[#f59e0b] bg-amber-50",
  Urgent: "text-[#dc2626] bg-red-50",
}

const deliveryColors: Record<string, string> = {
  Delivered: "text-[#16a34a]",
  Pending: "text-[#f59e0b]",
  Failed: "text-[#dc2626]",
}

export default function ViewNotificationModal({
  notification,
  open,
  onClose,
}: {
  notification: SentNotification
  open: boolean
  onClose: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Mail className="w-5 h-5 text-[#1e40af]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Notification Details</h3>
              <p className="text-xs text-slate-500 font-mono">{notification.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Type & Priority & Status badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${typeColors[notification.type]}`}>
              {notification.type}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${priorityColors[notification.priority]}`}>
              {notification.priority} Priority
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
              notification.readStatus === "Read" ? "bg-green-50 text-[#16a34a]" : "bg-slate-100 text-slate-500"
            }`}>
              {notification.readStatus}
            </span>
          </div>

          {/* Title */}
          <div>
            <h4 className="text-base font-semibold text-slate-800">{notification.title}</h4>
          </div>

          {/* Message */}
          <div className="bg-[#f1f5f9] rounded-lg p-4 border border-[#e2e8f0]">
            <p className="text-sm text-slate-700 leading-relaxed">{notification.message}</p>
          </div>

          {/* Complaint Info */}
          {notification.complaintId && (
            <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
              <FileText className="w-4 h-4 text-[#1e40af]" />
              <div>
                <p className="text-xs text-slate-500">Linked Complaint</p>
                <p className="text-sm font-mono text-[#1e40af] font-semibold">{notification.complaintId}</p>
              </div>
            </div>
          )}

          {/* User Info */}
          <div className="bg-white rounded-lg border border-[#e2e8f0] p-4">
            <h5 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500" />
              Recipient Information
            </h5>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-sm text-slate-600">{notification.userName}</span>
              </div>
              {notification.userEmail !== "broadcast" && (
                <>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm text-slate-600">{notification.userEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm text-slate-600">{notification.userPhone}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Delivery & Timestamps */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#f1f5f9] rounded-lg border border-[#e2e8f0]">
              <div className="flex items-center gap-2 mb-1.5">
                <Send className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px] font-medium text-slate-500 uppercase">Sent At</span>
              </div>
              <p className="text-sm font-medium text-slate-700">{notification.sentDate}</p>
            </div>
            <div className="p-3 bg-[#f1f5f9] rounded-lg border border-[#e2e8f0]">
              <div className="flex items-center gap-2 mb-1.5">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px] font-medium text-slate-500 uppercase">Read At</span>
              </div>
              <p className="text-sm font-medium text-slate-700">
                {notification.readTimestamp || "Not yet"}
              </p>
            </div>
          </div>

          {/* Delivery Status */}
          <div className="flex items-center gap-2 p-3 rounded-lg border border-[#e2e8f0]">
            {notification.deliveryStatus === "Delivered" ? (
              <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
            ) : notification.deliveryStatus === "Failed" ? (
              <AlertTriangle className="w-4 h-4 text-[#dc2626]" />
            ) : (
              <Clock className="w-4 h-4 text-[#f59e0b]" />
            )}
            <span className={`text-sm font-semibold ${deliveryColors[notification.deliveryStatus]}`}>
              {notification.deliveryStatus}
            </span>
            <span className="text-xs text-slate-400 ml-auto">Delivery Status</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-[#e2e8f0]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
