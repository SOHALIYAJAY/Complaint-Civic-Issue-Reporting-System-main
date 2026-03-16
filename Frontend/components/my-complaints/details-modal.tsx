// 'use client'

// import { useState, useEffect } from 'react'
// import { X, CheckCircle, Clock, MessageSquare, Share2 } from 'lucide-react'
// import { Button } from '@/components/ui/button'

// interface Complaint {
//   id: string
//   title: string
//   Category: string
//   location_address: string
//   current_time: string
//   status: 'Pending' | 'in-progress' | 'resolved'
//   priority_level: 'Low' | 'Medium' | 'High'
//   Description: string
//   image_video?: string
//   slaCompliance: number
//   officerRemarks?: string
//   timeline: Array<{ step: string; date: string; status: 'completed' | 'pending' }>
//   estimatedResolution?: string
// }

// const statusColors: Record<string, { bg: string; text: string }> = {
//   Pending: { bg: 'bg-orange-500/10', text: 'text-orange-700' },
//   'in-progress': { bg: 'bg-purple-500/10', text: 'text-purple-700' },
//   resolved: { bg: 'bg-green-500/10', text: 'text-green-700' },
// }

// export default function ComplaintDetailsModal({
//   complaint,
//   onClose,
// }: {
//   complaint: Complaint
//   onClose: () => void
// }) {
//   const [complaintDetails, setComplaintDetails] = useState<Complaint>(complaint)

//   useEffect(() => {
//     if (complaint?.id) {
//       fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/complaintDetails/${complaint.id}`)
//         .then((res) => res.json())
//         .then((data) => {
//           setComplaintDetails(data)
//         })
//         .catch((error) => {
//           console.error("Error fetching complaints:", error)
//         })
//     }
//   }, [complaint?.id])
  
//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
//         onClick={onClose}
//       />

//       {/* Modal */}
//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
//         <div
//           className="glass-effect rounded-lg border border-border max-w-2xl w-full my-8 shadow-2xl animate-in slide-in-up"
//           onClick={(e) => e.stopPropagation()}
//         >
//           {/* Header */}
//           <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-background/80 backdrop-blur">
//             <div>
//               <p className="text-xs font-mono text-muted-foreground mb-1">{complaintDetails.id}</p>
//               <h2 className="text-2xl font-bold text-foreground">{complaintDetails.title }</h2>
//             </div>
//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-muted rounded-lg transition-colors"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>

//           {/* Content */}
//           <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
//             {/* Status Bar */}
//             <div className="flex flex-wrap gap-3">
//               <span
//                 className={`px-4 py-2 rounded-full text-sm font-semibold ${
//                   statusColors[complaintDetails.status].bg
                  
//                 } ${statusColors[complaintDetails.status].text}`}
//               >
//                 {complaintDetails.status.charAt(0).toUpperCase() + complaintDetails.status.slice(1)}
//               </span>
//               <span className="px-4 py-2 rounded-full text-sm font-semibold bg-orange-100 text-orange-800">
//                 {complaintDetails.priority_level.charAt(0).toUpperCase() + complaintDetails.priority_level.slice(1)} Priority
//               </span>
//               <span className="px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800">
//                 SLA: {complaintDetails.slaCompliance}%
//               </span>
//             </div>

//             {/* Details Grid */}
//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-muted/30 rounded-lg p-4">
//                 <p className="text-xs text-muted-foreground font-semibold mb-1">LOCATION</p>
//                 <p className="font-medium text-foreground">{complaintDetails.location_address}</p>
//               </div>
//               <div className="bg-muted/30 rounded-lg p-4">
//                 <p className="text-xs text-muted-foreground font-semibold mb-1">CATEGORY</p>
//                 <p className="font-medium text-foreground capitalize">{complaintDetails.Category}</p>
//               </div>
//               <div className="bg-muted/30 rounded-lg p-4">
//                 <p className="text-xs text-muted-foreground font-semibold mb-1">SUBMITTED</p>
//                 <p className="font-medium text-foreground">
//                   {new Date(complaintDetails.current_time).toLocaleDateString()}
//                 </p>
//               </div>
//               <div className="bg-muted/30 rounded-lg p-4">
//                 <p className="text-xs text-muted-foreground font-semibold mb-1">RESOLUTION TIME</p>
//                 <p className="font-medium text-foreground">{complaintDetails.estimatedResolution}</p>
//               </div>
//             </div>

//             {/* Description */}
//             <div>
//               <h3 className="text-lg font-bold text-foreground mb-3">Full Description</h3>
//               <p className="text-muted-foreground leading-relaxed">
//                 {complaintDetails.Description}
//               </p>
//             </div>

//             {/* Timeline */}
//             <div>
//               <h3 className="text-lg font-bold text-foreground mb-4">Status Timeline</h3>
//               <div className="space-y-2">
//                 {complaintDetails.timeline.map((item, index) => (
//                   <div key={index} className="flex gap-4">
//                     <div className="flex flex-col items-center">
//                       <div
//                         className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                           item.status === 'completed'
//                             ? 'bg-green-500/20 text-green-600'
//                             : 'bg-gray-300 text-gray-500'
//                         }`}
//                       >
//                         <CheckCircle className="w-5 h-5" />
//                       </div>
//                       {index < complaintDetails.timeline.length - 1 && (
//                         <div
//                           className={`w-1 h-8 ${
//                             item.status === 'completed' ? 'bg-green-500/30' : 'bg-gray-300'
//                           }`}
//                         />
//                       )}
//                     </div>
//                     <div className="pt-1 pb-8">
//                       <p className="font-semibold text-foreground">{item.step}</p>
//                       {item.date && (
//                         <p className="text-sm text-muted-foreground">
//                           {new Date(item.date).toLocaleDateString()}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Officer Remarks */}
//             {complaintDetails.officerRemarks && (
//               <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
//                 <div className="flex gap-3">
//                   <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
//                   <div>
//                     <p className="text-sm font-semibold text-foreground mb-1">Officer Remarks</p>
//                     <p className="text-sm text-muted-foreground">{complaintDetails.officerRemarks}</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Feedback & Actions */}
//             {complaintDetails.status === 'resolved' && (
//               <div className="space-y-3">
//                 <h3 className="text-lg font-bold text-foreground">Share Feedback</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Help us improve by sharing your feedback on how we handled your complaint
//                 </p>
//                 <div className="flex gap-2">
//                   <Button className="flex-1 bg-primary hover:bg-secondary gap-2">
//                     <MessageSquare className="w-4 h-4" />
//                     Submit Feedback
//                   </Button>
//                   <Button variant="outline" className="border-border gap-2">
//                     <Share2 className="w-4 h-4" />
//                     Share
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="sticky bottom-0 flex gap-3 p-6 border-t border-border bg-background/80 backdrop-blur">
//             <Button variant="outline" onClick={onClose} className="flex-1 border-border">
//               Close
//             </Button>
//             {complaintDetails.status !== 'resolved' && (
//               <Button className="flex-1 bg-primary hover:bg-secondary">
//                 Escalate
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }
