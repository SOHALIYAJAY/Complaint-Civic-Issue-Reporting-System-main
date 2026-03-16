"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  UserPlus,
  RefreshCw,
} from "lucide-react"

interface Complaint {
  id: string
  title: string
  category: string
  district: string
  officer: string
  priority: "Critical" | "High" | "Medium" | "Low"
  status: "Pending" | "In Progress" | "Resolved" | "Escalated"
  slaPercent: number
  slaRemaining: string
  date: string
}

const complaints: Complaint[] = [
  { id: "PWD-1001", title: "Pothole on SG Highway", category: "Road", district: "Ahmedabad", officer: "Rajesh Kumar", priority: "Critical", status: "In Progress", slaPercent: 85, slaRemaining: "4h left", date: "2026-02-20" },
  { id: "PWD-1002", title: "Broken drainage cover near AMC", category: "Drainage", district: "Vadodara", officer: "Priya Sharma", priority: "High", status: "Pending", slaPercent: 45, slaRemaining: "18h left", date: "2026-02-19" },
  { id: "PWD-1003", title: "Waterlogging in low area", category: "Water", district: "Surat", officer: "Amit Patel", priority: "Medium", status: "Resolved", slaPercent: 100, slaRemaining: "Done", date: "2026-02-18" },
  { id: "PWD-1004", title: "Street light pole tilted dangerously", category: "Safety", district: "Rajkot", officer: "Neha Singh", priority: "High", status: "In Progress", slaPercent: 62, slaRemaining: "10h left", date: "2026-02-17" },
  { id: "PWD-1005", title: "Garbage accumulation on ring road", category: "Sanitation", district: "Gandhinagar", officer: "Vikram Desai", priority: "Medium", status: "Pending", slaPercent: 30, slaRemaining: "22h left", date: "2026-02-16" },
  { id: "PWD-1006", title: "Bridge railing missing section", category: "Safety", district: "Bhavnagar", officer: "Unassigned", priority: "Critical", status: "Escalated", slaPercent: 95, slaRemaining: "1h left", date: "2026-02-15" },
  { id: "PWD-1007", title: "Footpath tiles broken near bus stand", category: "Road", district: "Jamnagar", officer: "Rajesh Kumar", priority: "Low", status: "In Progress", slaPercent: 20, slaRemaining: "30h left", date: "2026-02-14" },
  { id: "PWD-1008", title: "Overflowing manhole on MG Road", category: "Drainage", district: "Ahmedabad", officer: "Priya Sharma", priority: "High", status: "Pending", slaPercent: 55, slaRemaining: "14h left", date: "2026-02-13" },
  { id: "PWD-1009", title: "Road resurfacing incomplete", category: "Road", district: "Surat", officer: "Amit Patel", priority: "Medium", status: "Resolved", slaPercent: 100, slaRemaining: "Done", date: "2026-02-12" },
  { id: "PWD-1010", title: "Tree fallen on public path", category: "Safety", district: "Vadodara", officer: "Neha Singh", priority: "High", status: "In Progress", slaPercent: 70, slaRemaining: "8h left", date: "2026-02-11" },
]

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  "In Progress": "bg-blue-100 text-[#1e40af] border-blue-200",
  Resolved: "bg-green-100 text-[#16a34a] border-green-200",
  Escalated: "bg-red-100 text-[#dc2626] border-red-200",
}

const priorityColors: Record<string, string> = {
  Critical: "text-[#dc2626] font-bold",
  High: "text-orange-600 font-semibold",
  Medium: "text-[#f59e0b] font-medium",
  Low: "text-slate-500",
}

function SlaBar({ percent, remaining }: { percent: number; remaining: string }) {
  let barColor = "bg-[#16a34a]"
  if (percent >= 80 && percent < 100) barColor = "bg-[#f59e0b]"
  if (percent >= 90 && percent < 100) barColor = "bg-[#dc2626]"
  if (percent === 100 && remaining === "Done") barColor = "bg-[#16a34a]"

  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className={`${barColor} h-full rounded-full transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-[11px] text-slate-500 whitespace-nowrap w-14 text-right">
        {remaining}
      </span>
    </div>
  )
}

export default function DeptComplaintTable({
  onAssign,
}: {
  onAssign: (complaint: Complaint) => void
}) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [priorityFilter, setPriorityFilter] = useState("All")
  const [page, setPage] = useState(1)
  const perPage = 6

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.district.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === "All" || c.status === statusFilter
      const matchesPriority =
        priorityFilter === "All" || c.priority === priorityFilter
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [search, statusFilter, priorityFilter])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm">
      {/* Header + Filters */}
      <div className="p-5 border-b border-[#e2e8f0]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Assigned Complaints
            </h3>
            <p className="text-sm text-slate-500">
              {filtered.length} complaints in department queue
            </p>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 border border-[#e2e8f0] transition-colors self-start">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-[#f1f5f9] px-3 py-2 rounded-lg border border-[#e2e8f0] flex-1">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, title, or district..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="bg-transparent text-sm outline-none w-full text-slate-700 placeholder:text-slate-400"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 bg-white text-slate-700 outline-none focus:ring-2 focus:ring-[#1e40af]/20"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Escalated">Escalated</option>
            </select>
          </div>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value)
              setPage(1)
            }}
            className="text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 bg-white text-slate-700 outline-none focus:ring-2 focus:ring-[#1e40af]/20"
          >
            <option value="All">All Priority</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e2e8f0] bg-[#f1f5f9]">
              <th className="px-5 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">
                Complaint ID
              </th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">
                Title
              </th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider hidden md:table-cell">
                Category
              </th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider hidden lg:table-cell">
                District
              </th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider hidden xl:table-cell">
                Officer
              </th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">
                Priority
              </th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider hidden lg:table-cell">
                SLA Timer
              </th>
              <th className="px-5 py-3 text-center font-semibold text-slate-600 text-xs uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0]">
            {paginated.map((c) => (
              <tr
                key={c.id}
                className="hover:bg-blue-50/40 transition-colors"
              >
                <td className="px-5 py-3.5 font-mono text-[#1e40af] font-semibold text-xs">
                  {c.id}
                </td>
                <td className="px-5 py-3.5 text-slate-800 font-medium max-w-[200px] truncate">
                  {c.title}
                </td>
                <td className="px-5 py-3.5 text-slate-600 hidden md:table-cell">
                  {c.category}
                </td>
                <td className="px-5 py-3.5 text-slate-600 hidden lg:table-cell">
                  {c.district}
                </td>
                <td className="px-5 py-3.5 text-slate-600 hidden xl:table-cell">
                  <span
                    className={
                      c.officer === "Unassigned"
                        ? "text-[#dc2626] italic"
                        : ""
                    }
                  >
                    {c.officer}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs ${priorityColors[c.priority]}`}>
                    {c.priority}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${statusColors[c.status]}`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 hidden lg:table-cell">
                  <SlaBar percent={c.slaPercent} remaining={c.slaRemaining} />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      title="View"
                      className="p-1.5 text-[#3b82f6] hover:bg-blue-50 rounded transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      title="Assign Officer"
                      onClick={() => onAssign(c)}
                      className="p-1.5 text-[#7c3aed] hover:bg-violet-50 rounded transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                    <button
                      title="Update Status"
                      className="p-1.5 text-[#16a34a] hover:bg-green-50 rounded transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={9} className="px-5 py-12 text-center text-slate-400">
                  No complaints match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#e2e8f0]">
          <p className="text-xs text-slate-500">
            Showing {(page - 1) * perPage + 1} -{" "}
            {Math.min(page * perPage, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                  n === page
                    ? "bg-[#1e40af] text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
