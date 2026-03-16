import { Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

interface ComplaintsFilterProps {
  filterStatus: string
  setFilterStatus: (status: string) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  categoryFilter: string
  setCategoryFilter: (category: string) => void
  priorityFilter: string
  setPriorityFilter: (priority: string) => void
}

export default function ComplaintsFilter({
  filterStatus,
  setFilterStatus,
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  priorityFilter,
  setPriorityFilter,
}: ComplaintsFilterProps) {
  const [categories, setCategories] = useState<Array<any>>([])

  const API_BASE = (() => {
    const env = (process.env.NEXT_PUBLIC_API_URL as string) || ''
    if (env) return env
    if (typeof window !== 'undefined') return `${window.location.protocol}//${window.location.hostname}:8000`
    return 'http://127.0.0.1:8000'
  })()

  useEffect(() => {
    let mounted = true
    fetch(`${API_BASE}/api/categories/`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        setCategories(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        // ignore — we'll fall back to hardcoded options
      })
    return () => {
      mounted = false
    }
  }, [API_BASE])

  return (
    <section className="py-8 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by complaint ID or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background placeholder-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                {/* <option value="rejected">Rejected</option> */}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="all">All Categories</option>
                {categories.length > 0
                  ? categories.map((cat: any) => (
                      <option key={cat.id} value={cat.code || cat.name}>
                        {cat.name + (cat.code ? ` (${cat.code})` : '')}
                      </option>
                    ))
                  : (
                    <>
                      <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                      <option value="Water Supply">Water Supply</option>
                      <option value="Sanitation">Sanitation</option>
                      <option value="Street Lighting">Street Lighting</option>
                      <option value="Drainage">Drainage</option>
                      <option value="Other">Other</option>
                    </>
                  )}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="all">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setFilterStatus('all')
                setCategoryFilter('all')
                setPriorityFilter('all')
              }}
              className="border-border hover:bg-muted"
            >
              <Filter className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
