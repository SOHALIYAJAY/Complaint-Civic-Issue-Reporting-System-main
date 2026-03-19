"use client"

import { useRouter } from "next/navigation"
import { Eye } from "lucide-react"
import type { Complaint } from "./assigned-complaints-table"

interface ViewDetailsButtonProps {
  complaint?: Complaint | null
  className?: string
}

export default function ViewDetailsButton({ complaint, className = "" }: ViewDetailsButtonProps) {
  const router = useRouter()

  console.log('ViewDetailsButton rendering for complaint:', complaint?.id, complaint)

  // Don't render button if complaint data is not available
  if (!complaint) {
    console.log('No complaint data available')
    return (
      <span className="text-xs text-gray-400" title="No complaint data available">
        N/A
      </span>
    )
  }

  if (!complaint.id) {
    console.log('Complaint ID missing:', complaint)
    return (
      <span className="text-xs text-gray-400" title="Complaint ID missing">
        No ID
      </span>
    )
  }

  const handleClick = () => {
    try {
      console.log('ViewDetailsButton clicked!')
      console.log('Complaint ID:', complaint.id)
      console.log('Complaint data:', complaint)
      
      const route = `/department/complaint-details/${complaint.id}`
      console.log('Navigating to:', route)
      
      // Use Next.js router for better navigation
      router.push(route)
      
      // Fallback to window.location if router fails
      setTimeout(() => {
        if (window.location.pathname !== route) {
          console.log('Router navigation failed, using fallback')
          window.location.href = route
        }
      }, 1000)
    } catch (error) {
      console.error('Error in ViewDetailsButton click:', error)
      // Fallback navigation
      window.location.href = `/department/complaint-details/${complaint.id}`
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer ${className}`}
      title={`View details for complaint #${complaint.id}`}
      type="button"
    >
      <Eye className="w-3.5 h-3.5" />
      View Details
    </button>
  )
}
  