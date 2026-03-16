'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Eye, Search, Filter, ChevronDown, AlertTriangle, CheckCircle, Tag, Activity, BarChart3, PieChart as PieChartIcon, RefreshCw, ArrowUpDown } from 'lucide-react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function CategoriesPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any | null>(null)
  const [editForm, setEditForm] = useState({ name: '', code: '', department: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('complaints')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({ id:'', name: '', code: '', description: '', department: '', slaValue: '', slaUnit: 'Hours', priority: 'Medium', active: true })

  useEffect(() => {
    fetchCategories()
  }, [])

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://127.0.0.1:8000'

  async function fetchCategories() {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/categories/`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setCategories(data)
      setError(null)
    } catch (e: any) {
      setError(e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  async function createCategory() {
    try {
      const payload = {
        id:form.id,
        name: form.name,
        code: form.code,
        department: form.department,
        description: form.description,
      }
      const res = await fetch(`${API_BASE}/api/categories/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.text()
        throw new Error(err || 'Create failed')
      }
      const created = await res.json()
      setCategories((s) => [created, ...s])
      setShowAddForm(false)
      setForm({id:'', name: '', code: '', description: '', department: '', slaValue: '', slaUnit: 'Hours', priority: 'Medium', active: true })
    } catch (e: any) {
      alert('Create failed: ' + (e.message || e))
    }
  }

  async function updateCategory() {
    if (!editingCategory) return
    try {
      const res = await fetch(`${API_BASE}/api/updatecategory/${editingCategory.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editForm.name, code: editForm.code, department: editForm.department }),
      })
      if (!res.ok) throw new Error('Update failed')
      const updated = await res.json()
      setCategories((s) => s.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)))
      setEditingCategory(null)
    } catch (e: any) {
      alert('Update failed: ' + (e.message || e))
    }
  }

  async function deleteCategory(id: number) {
    if (!confirm('Delete this category?')) return
    try {
      const res = await fetch(`${API_BASE}/api/deletecategory/${id}/`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setCategories((s) => s.filter(c => c.id !== id))
    } catch (e: any) {
      alert(e.message || 'Delete failed')
    }
  }

  const kpiCards = [
    { label: 'Total Categories', value: categories.length, icon: Tag, color: 'blue' },
    { label: 'Most Used Category', value: categories.length ? categories[0].name : '-', icon: BarChart3, color: 'purple' },
  ]

  const chartData = categories.map((c) => ({ name: c.name, complaints: c.total_comp || 0 }))

  const pieData = categories.slice(0, 6).map((c: any, i: number) => ({ name: c.name, value: c.total_comp || 0, color: ['#1e40af', '#3b82f6', '#0ea5e9', '#06b6d4', '#8b5cf6', '#ef4444'][i % 6] }))

  const slaPerformanceData = categories.map((c) => ({ name: c.name, breachRate: 0 }))

  const filteredCategories = categories.filter(cat => {
    const name = (cat.name || '').toString()
    const code = (cat.code || '').toString()
    const dept = (cat.department || '').toString()
    const matchSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchDept = filterDepartment === 'all' || dept === filterDepartment
    return matchSearch && matchDept
  }).sort((a, b) => {
    if (sortBy === 'complaints') {
      return sortOrder === 'desc' ? (b.total_comp || 0) - (a.total_comp || 0) : (a.total_comp || 0) - (b.total_comp || 0)
    }
    if (sortBy === 'name') {
      return sortOrder === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
    }
    return 0
  })

  const itemsPerPage = 5
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
  const paginatedCategories = filteredCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getColorClass = (color: string) => {
    const colors: any = {
      blue: 'border-blue-300 bg-blue-50',
      green: 'border-green-300 bg-green-50',
      orange: 'border-orange-300 bg-orange-50',
      purple: 'border-purple-300 bg-purple-50',
      red: 'border-red-300 bg-red-50',
    }
    return colors[color] || colors.blue
  }

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Active</span>
    }
    return <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">Inactive</span>
  }

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      'High': 'text-red-700 bg-red-50 border-red-200',
      'Medium': 'text-orange-700 bg-orange-50 border-orange-200',
      'Low': 'text-blue-700 bg-blue-50 border-blue-200',
    }
    return colors[priority] || colors.Low
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
    setCurrentPage(1)
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Manage Categories</h1>
            <p className="text-sm text-blue-700 mt-1">Create and configure complaint categories</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className={`flex items-center gap-2 px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Category
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-w-2xl">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <div key={idx} className={`border-t-4 border-blue-300 bg-white rounded-lg shadow-sm p-5 ${getColorClass(card.color)}`}>
              <div className="flex items-start justify-between mb-3">
                <Icon className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">KPI</span>
              </div>
              <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          )
        })}
      </div>

      {/* Add New Category Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Add New Category</h2>
            <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
              <input type="text" placeholder="e.g., Water Supply" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category Code</label>
              <input type="text" placeholder="e.g., WS" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Department</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Select Department</option>
                <option>Water Authority</option>
                <option>Public Works</option>
                <option>Electricity Board</option>
                <option>Municipal Corp</option>
              </select>
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300" />
                <span className="text-sm text-gray-600">Active</span>
              </div>
            </div> */}
          </div>

          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowAddForm(false)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={() => createCategory()} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Save Category
            </button>
          </div>
        </div>
      )}

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Volume Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaint Volume by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                stroke="#64748b" 
                tick={{ fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                stroke="#64748b"
                tick={{ fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: any) => [`${value} Complaints`, 'Volume']}
              />
              <Bar 
                dataKey="complaints" 
                fill="url(#colorGradient)" 
                radius={[8, 8, 0, 0]}
                animationDuration={1500}
                animationBegin={0}
              >
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#1e40af" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={pieData} 
                cx="50%" 
                cy="50%" 
                innerRadius={60} 
                outerRadius={100} 
                paddingAngle={2} 
                dataKey="value"
                animationDuration={1500}
                animationBegin={300}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: any) => [`${value} Complaints`, 'Volume']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SLA Performance Chart */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SLA Breach Rate by Category</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={slaPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              stroke="#64748b"
              tick={{ fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              stroke="#64748b"
              tick={{ fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: any) => [`${value}%`, 'Breach Rate']}
            />
            <Bar 
              dataKey="breachRate" 
              fill="url(#redGradient)" 
              radius={[8, 8, 0, 0]}
              animationDuration={1500}
              animationBegin={600}
            >
              <defs>
                <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={1}/>
                </linearGradient>
              </defs>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filter and Search Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories List</h2>
        
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterDepartment}
              onChange={(e) => { setFilterDepartment(e.target.value); setCurrentPage(1) }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              <option value="Water Authority">Water Authority</option>
              <option value="Public Works">Public Works</option>
              <option value="Electricity Board">Electricity Board</option>
              <option value="Municipal Corp">Municipal Corp</option>
            </select>
            <button
              onClick={() => toggleSort('complaints')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium text-sm transition-colors ${
                sortBy === 'complaints'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <ArrowUpDown className="w-4 h-4" />
              No. of Complaints
              {sortBy === 'complaints' && (
                <span className="text-xs">{sortOrder === 'desc' ? '↓' : '↑'}</span>
              )}
            </button>
          </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-600">Loading categories…</div>
          ) : error ? (
            <div className="p-6 text-center text-red-600">Error: {error}</div>
          ) : categories.length === 0 ? (
            <div className="p-6 text-center text-gray-600">No categories found. <button onClick={() => fetchCategories()} className="ml-2 px-3 py-1 border rounded">Refresh</button></div>
          ) : (
            <table className="w-full text-sm"> 
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Code</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Department</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">SLA</th>
                <th 
                  className="px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleSort('complaints')}
                >
                  <div className="flex items-center gap-1">
                    Complaints
                    <ArrowUpDown className="w-4 h-4" />
                    {sortBy === 'complaints' && (
                      <span className="text-xs text-blue-600">
                        {sortOrder === 'desc' ? '↓' : '↑'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.map((cat) => (
                <tr key={cat.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{cat.name}</p>
                      <p className="text-xs text-gray-500">{cat.description || '-'}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-mono">{cat.code || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{cat.department || <span className="text-orange-600 font-semibold text-xs">Not Mapped</span>}</td>
                  <td className="px-4 py-3 text-gray-600">{cat.sla || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 font-semibold">{cat.total_comp ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-blue-100 rounded transition-colors" title="Edit" onClick={() => { setEditingCategory(cat); setEditForm({ name: cat.name, code: cat.code, department: cat.department || '' }) }}>
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-1.5 hover:bg-red-100 rounded transition-colors" title="Delete" onClick={() => deleteCategory(cat.id)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCategories.length)} of {filteredCategories.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Edit Category</h2>
              <button onClick={() => setEditingCategory(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Code</label>
                <input
                  type="text"
                  value={editForm.code}
                  onChange={(e) => setEditForm((f) => ({ ...f, code: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={editForm.department}
                  onChange={(e) => setEditForm((f) => ({ ...f, department: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Department</option>
                  <option value="Water Authority">Water Authority</option>
                  <option value="Public Works">Public Works</option>
                  <option value="Electricity Board">Electricity Board</option>
                  <option value="Municipal Corp">Municipal Corp</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setEditingCategory(null)} className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={updateCategory} className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
