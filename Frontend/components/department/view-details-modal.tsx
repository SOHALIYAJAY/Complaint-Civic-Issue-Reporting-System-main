// "use client"

// import { useRouter } from "next/navigation"
// import { Eye } from "lucide-react"
// import type { Complaint } from "../assigned-complaints-table"

// interface ViewDetailsButtonProps {
//   complaint?: Complaint | null
//   className?: string
// }

// export default function ViewDetailsButton({ complaint, className = "" }: ViewDetailsButtonProps) {
//   const router = useRouter()
























































//   }  )    </button>      View Details      <Eye className="w-3.5 h-3.5" />    >      type="button"      title={`View details for complaint #${complaint.id}`}      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer ${className}`}      onClick={handleClick}    <button
// n  return (  }    }      window.location.href = `/department/complaint-details/${complaint.id}`      // Fallback navigation      console.error('Error in ViewDetailsButton click:', error)    } catch (error) {      }, 1000)        }          window.location.href = route          console.log('Router navigation failed, using fallback')        if (window.location.pathname !== route) {      setTimeout(() => {      // Fallback to window.location if router fails            router.push(route)      // Use Next.js router for better navigation            console.log('Navigating to:', route)      const route = `/department/complaint-details/${complaint.id}`            console.log('Complaint data:', complaint)      console.log('Complaint ID:', complaint.id)      console.log('ViewDetailsButton clicked!')    try {
// n  const handleClick = () => {  }    )      </span>        No ID      <span className="text-xs text-gray-400" title="Complaint ID missing">    return (    console.log('Complaint ID missing:', complaint)
// n  if (!complaint.id) {  }    )      </span>        N/A      <span className="text-xs text-gray-400" title="No complaint data available">    return (    console.log('No complaint data available')  if (!complaint) {
// n  // Don't render button if complaint data is not availablen  console.log('ViewDetailsButton rendering for complaint:', complaint?.id, complaint)