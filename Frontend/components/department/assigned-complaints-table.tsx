"use client"

import { useState, useMemo, useEffect } from "react"
import api from '@/lib/axios'
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  UserPlus,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Calendar,
  SortAsc,
  SortDesc,
  MessageSquare,
  CheckCircle2,
  ArrowUpRight,
  Upload,
} from "lucide-react"

export interface Complaint {
  id: number
  title: string
  Category: string | number
  Description: string
  video_image: string
  location_District: string
  location_address: string
  category_code?: string
  category_name?: string
  priority_level: "High" | "Medium" | "Low"
  status: "Pending" | "in-progress" | "resolved"
  current_time: string
  is_assignd?: boolean
  officer_id ?: string
}


const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  "in-progress": "bg-blue-100 text-[#1e40af] border-blue-200",
  resolved: "bg-green-100 text-[#16a34a] border-green-200",
}

const priorityColors: Record<string, string> = {
  High: "bg-orange-50 text-orange-600 border-orange-200",
  Medium: "bg-amber-50 text-[#f59e0b] border-amber-200",
  Low: "bg-slate-50 text-slate-500 border-slate-200",
}

function SlaBar({ percent, remaining }: { percent: number; remaining: string }) {
  let barColor = "bg-[#16a34a]"
  if (percent >= 70 && percent < 90) barColor = "bg-[#f59e0b]"
  if (percent >= 90 && percent < 100) barColor = "bg-[#dc2626]"
  if (percent === 100 && remaining === "Done") barColor = "bg-[#16a34a]"

  return (
    <div className="flex items-center gap-2 min-w-[130px]">
      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className={`${barColor} h-full rounded-full transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span
        className={`text-[11px] whitespace-nowrap w-14 text-right font-medium ${
          percent >= 90 && remaining !== "Done" ? "text-[#dc2626]" : "text-slate-500"
        }`}
      >
        {remaining}
      </span>
    </div>
  )
}

// categories are loaded from the backend API
// (hook state moved into the component to avoid invalid hook calls)

export default function AssignedComplaintsTable({
  onAssign,
  onViewDetails,
  initialView,
}: {
  onAssign: (complaint: Complaint) => void
  onViewDetails: (complaint: Complaint) => void
  initialView?: "list" | "category"
}) {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [priorityFilter, setPriorityFilter] = useState("All")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest")
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<"list" | "category">(initialView || "category")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["WATER", "ROADS"]))
  const perPage = 7
  const [categoriesMap, setCategoriesMap] = useState<Record<string | number, string>>({})
  const [categories, setCategories] = useState<string[]>(["All"]) // used in the category <select>
  const [allCategories, setAllCategories] = useState<string[]>([]) // used to build category groups

  useEffect(() => {
    fetchComplaints()
    fetchCategories()
  }, [])

  const fetchComplaints = async () => {
    try {
      const response = await api.get("/api/getcomplaint/")
      console.debug('API /api/getcomplaint/ response:', response.data)
      setComplaints(response.data)
    } catch (error) {
      console.error('Error fetching complaints:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories/')
      console.debug('API /api/categories/ response:', res.data)
      if (Array.isArray(res.data)) {
          const map: Record<string | number, string> = {}
          const codesSet = new Set<string>()
          res.data.forEach((c: any) => {
            // support lookup by id, name, and code (case-insensitive)
            const codeVal = c.code ?? c.name ?? (c.id != null ? String(c.id) : undefined)
            if (c.id != null && c.code != null) map[c.id] = c.code
            if (c.name && c.code != null) map[c.name] = c.code
            if (c.code) {
              map[c.code] = c.code
              map[String(c.code).toUpperCase()] = c.code
              map[String(c.code).toLowerCase()] = c.code
            }

            if (codeVal != null) {
              codesSet.add(String(codeVal).toUpperCase())
            }
          })
          setCategoriesMap(map)

          // Build sorted category arrays for the UI
          const allCats = Array.from(codesSet)
          allCats.sort()
          setAllCategories(allCats)
          setCategories(["All", ...allCats])
      }
    } catch (err) {
      console.error('Failed to fetch categories', err)
    }
  }

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const filtered = useMemo(() => {
    let result = complaints.filter((c) => {
      const rawCat = (c as any).category_code || (c as any).Category || (c as any).category_name || ""
      let catKey: any = rawCat
      if (typeof rawCat === 'object' && rawCat !== null) {
        // Category may be serialized as an object
        catKey = rawCat.code || rawCat.name || rawCat.id || String(rawCat)
      }
      if (typeof catKey === 'number' || (typeof catKey === 'string' && /^[0-9]+$/.test(catKey))) {
        catKey = categoriesMap[catKey] || String(catKey)
      } else if (typeof catKey === 'string') {
        // prefer mapping, otherwise normalize
        catKey = categoriesMap[catKey] || categoriesMap[String(catKey).toUpperCase()] || String(catKey)
      }
      const matchesSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toString().includes(search)
      const matchesStatus = statusFilter === "All" || c.status === statusFilter
      const matchesPriority = priorityFilter === "All" || c.priority_level === priorityFilter
      const matchesCategory = categoryFilter === "All" || String(catKey).toUpperCase() === String(categoryFilter).toUpperCase()
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory
    })

    result.sort((a, b) => {
      const dateA = new Date(a.current_time).getTime()
      const dateB = new Date(b.current_time).getTime()
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB
    })

    return result
  }, [complaints, search, statusFilter, priorityFilter, categoryFilter, sortOrder])

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, Complaint[]> = {}
    filtered.forEach((complaint) => {
      const rawCat = (complaint as any).category_code || (complaint as any).Category || (complaint as any).category_name || 'Other'
      let key: any = rawCat
      if (typeof rawCat === 'object' && rawCat !== null) {
        key = rawCat.code || rawCat.name || rawCat.id || String(rawCat)
      }
      if (typeof key === 'number' || (typeof key === 'string' && /^[0-9]+$/.test(key))) {
        key = categoriesMap[key] || String(key)
      } else if (typeof key === 'string') {
        key = categoriesMap[key] || categoriesMap[String(key).toUpperCase()] || String(key)
      }
      key = String(key).toUpperCase()
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(complaint)
    })
    return groups
  }, [filtered, categoriesMap])

  // When category filter changes, show only that category in category view
  const displayedCategories = useMemo(() => {
    if (categoryFilter !== "All") {
      return { [String(categoryFilter).toUpperCase()]: groupedByCategory[String(categoryFilter).toUpperCase()] || [] }
    }
    // Show all categories, even if empty
    const allCats: Record<string, Complaint[]> = {}
    allCategories.forEach(cat => {
      allCats[String(cat).toUpperCase()] = groupedByCategory[String(cat).toUpperCase()] || []
    })
    return allCats
  }, [categoryFilter, groupedByCategory])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-12 text-center">
        <p className="text-slate-600">Loading complaints...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm">
      {/* Header + Filters */}
      <div className="p-5 border-b border-[#e2e8f0]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Complaint Queue</h3>
            <p className="text-sm text-slate-500">
              {filtered.length} complaints assigned to department
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("category")}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  viewMode === "category" ? "bg-white text-[#1e40af] shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                By Category
              </button>
            </div>
            <button 
              onClick={fetchComplaints}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 border border-[#e2e8f0] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-[#f1f5f9] px-3 py-2 rounded-lg border border-[#e2e8f0] flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Complaint ID or Title..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="bg-transparent text-sm outline-none w-full text-slate-700 placeholder:text-slate-400"
            />
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
              className="text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 bg-white text-slate-700 outline-none focus:ring-2 focus:ring-[#1e40af]/20"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => { setPriorityFilter(e.target.value); setPage(1) }}
            className="text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 bg-white text-slate-700 outline-none focus:ring-2 focus:ring-[#1e40af]/20"
          >
            <option value="All">All Priority</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
            className="text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 bg-white text-slate-700 outline-none focus:ring-2 focus:ring-[#1e40af]/20"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
            ))}
          </select>

          {/* Sort */}
          <button
            onClick={() => setSortOrder(sortOrder === "latest" ? "oldest" : "latest")}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 bg-white border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors"
          >
            {sortOrder === "latest" ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
            {sortOrder === "latest" ? "Latest" : "Oldest"}
          </button>
        </div>
      </div>

      {/* Content - Category View or List View */}
      {viewMode === "category" ? (
        <div className="p-5 space-y-4">
          {Object.entries(displayedCategories).length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No complaints found in selected category.
            </div>
          ) : (
            Object.entries(displayedCategories).map(([category, complaints]) => (
            <div key={category} className="border border-[#e2e8f0] rounded-lg overflow-hidden">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-800">{category}</span>
                  <span className="text-xs px-2 py-1 bg-[#1e40af] text-white rounded-full">
                    {complaints.length}
                  </span>
                </div>
                {expandedCategories.has(category) ? (
                  <ChevronUp className="w-4 h-4 text-slate-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                )}
              </button>
              {expandedCategories.has(category) && (
                <div className="divide-y divide-[#e2e8f0]">
                  {complaints.map((c) => (
                    <div key={c.id} className="p-4 hover:bg-blue-50/40 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-mono font-semibold text-[#1e40af]">CVT-{c.id}</span>
                            <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold ${priorityColors[c.priority_level]}`}>
                              {c.priority_level}
                            </span>
                            <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold ${statusColors[c.status]}`}>
                              {c.status}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-slate-800 mb-1">{c.title}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>{c.location_District}</span>
                            <span>•</span>
                            <span>{c.location_address}</span>
                            <span>•</span>
                            {/* <span className={c.officer === "Unassigned" ? "text-[#dc2626] italic" : ""}>
                              {c.officer}
                            </span> */}
                          </div>
                        </div>
                          <div className="flex items-center gap-1">
                          <button onClick={() => onViewDetails(c)} className="p-2 text-[#3b82f6] hover:bg-blue-50 rounded transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          {c.is_assignd ? (
                            <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold">Assigned</span>
                          ) : (
                            <button onClick={() => onAssign(c)} className="p-2 text-[#7c3aed] hover:bg-violet-50 rounded transition-colors">
                              <UserPlus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )))
          }
        </div>
      ) : (
        <>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e2e8f0] bg-[#f1f5f9]">
              <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider hidden md:table-cell">Category</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider hidden lg:table-cell">District</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider hidden xl:table-cell">Location</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider hidden xl:table-cell">Citizen</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider hidden lg:table-cell">Officer</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">Priority</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider hidden lg:table-cell">SLA Timer</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-600 text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0]">
            {paginated.map((c) => (
              <tr key={c.id} className="hover:bg-blue-50/40 transition-colors group">
                <td className="px-4 py-3.5 font-mono text-[#1e40af] font-semibold text-xs">{c.id}</td>
                <td className="px-4 py-3.5 text-slate-800 font-medium max-w-[180px] truncate">{c.title}</td>
                <td className="px-4 py-3.5 text-slate-600 hidden md:table-cell">{c.Category}</td>
                <td className="px-4 py-3.5 text-slate-600 hidden lg:table-cell">{c.location_District}</td>
                <td className="px-4 py-3.5 text-slate-500 text-xs hidden xl:table-cell max-w-[140px] truncate">{c.location_address}</td>
                <td className="px-4 py-3.5 hidden lg:table-cell">
                  <span className={c.officer_id === "Unassigned" ? "text-[#dc2626] italic text-xs" : "text-slate-600 text-xs"}>
                    {c.officer_id}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`text-[11px] px-2 py-1 rounded-full border font-semibold ${priorityColors[c.priority_level]}`}>
                    {c.priority_level}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`text-[11px] px-2.5 py-1 rounded-full border font-semibold ${statusColors[c.status]}`}>
                    {c.status}
                  </span>
                </td>
                {/* <td className="px-4 py-3.5 hidden lg:table-cell">
                  <SlaBar percent={c.slaPercent} remaining={c.slaRemaining} />
                </td> */}
                <td className="px-4 py-3.5 text-slate-500 text-xs hidden md:table-cell">{c.current_time}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-center gap-0.5">
                    <button title="View Details" onClick={() => onViewDetails(c)} className="p-1.5 text-[#3b82f6] hover:bg-blue-50 rounded transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    {c.is_assignd ? (
                      <button title="Assigned" disabled className="p-1.5 text-slate-400 rounded transition-colors cursor-not-allowed" aria-disabled>
                        <span className="text-xs font-medium">Assigned</span>
                      </button>
                    ) : (
                      <button title="Assign Officer" onClick={() => onAssign(c)} className="p-1.5 text-[#7c3aed] hover:bg-violet-50 rounded transition-colors">
                        <UserPlus className="w-4 h-4" />
                      </button>
                    )}
                    <button title="Update Status" className="p-1.5 text-[#16a34a] hover:bg-green-50 rounded transition-colors">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button title="Add Remarks" className="p-1.5 text-slate-500 hover:bg-slate-50 rounded transition-colors">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                    <button title="Mark Resolved" className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                    <button title="Escalate" className="p-1.5 text-[#dc2626] hover:bg-red-50 rounded transition-colors">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <button title="Upload Proof" className="p-1.5 text-slate-400 hover:bg-slate-50 rounded transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={12} className="px-5 py-12 text-center text-slate-400">
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
            Showing {(page - 1) * perPage + 1} - {Math.min(page * perPage, filtered.length)} of {filtered.length}
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
                  n === page ? "bg-[#1e40af] text-white" : "text-slate-600 hover:bg-slate-100"
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
        </>
      )}
    </div>
  )
}
