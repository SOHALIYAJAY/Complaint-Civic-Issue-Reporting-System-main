// 'use client'

// import { useState, useEffect } from 'react'
// import { Card } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { FileText, AlertCircle, CheckCircle, TrendingUp, Loader2 } from 'lucide-react'

// interface ComplaintStat {
//   label: string
//   value: number
//   icon: React.ReactNode
//   bgColor: string
//   textColor: string
// }

// export default function ComplaintSummary() {
//   const [stats, setStats] = useState<ComplaintStat[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchComplaintData = async () => {
//       try {
//         setLoading(true)
//         const token = localStorage.getItem('access_token')
//         if (!token) {
//           console.log('No authentication token found - showing fallback data')
//           return
//         }

//         // Fetch complaint summary statistics
//         const complaintsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/complaintsinfo/`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         })

//         console.log('Complaints API response status:', complaintsResponse.status)
        
//         if (complaintsResponse.ok) {
//           const summaryData = await complaintsResponse.json()
//           console.log('Complaints summary API response data:', summaryData)
          
//           // Use pre-calculated counts from backend
//           const totalComplaints = summaryData.total_comp || 0
//           const pendingComplaints = summaryData.pending_comp || 0
//           const inProgressComplaints = summaryData.inprogress_comp || 0
//           const resolvedComplaints = summaryData.resolved_comp || 0

//           console.log('Complaints summary data:', {
//             total: totalComplaints,
//             pending: pendingComplaints,
//             inProgress: inProgressComplaints,
//             resolved: resolvedComplaints
//           })

//           const newStats: ComplaintStat[] = [
//             {
//               label: 'Total Complaints',
//               value: totalComplaints,
//               icon: <FileText className="w-6 h-6" />,
//               bgColor: 'bg-blue-50 border-blue-200',
//               textColor: 'text-blue-600',
//             },
//             {
//               label: 'Pending  Complaints',
//               value: pendingComplaints,
//               icon: <AlertCircle className="w-6 h-6" />,
//               bgColor: 'bg-yellow-50 border-yellow-200',
//               textColor: 'text-yellow-600',
//             },
//             {
//               label: 'In-Progress Complaints',
//               value: inProgressComplaints,
//               icon: <TrendingUp className="w-6 h-6" />,
//               bgColor: 'bg-purple-50 border-purple-200',
//               textColor: 'text-purple-600',
//             },
//             {
//               label: 'Resolved Complaints',
//               value: resolvedComplaints,
//               icon: <CheckCircle className="w-6 h-6" />,
//               bgColor: 'bg-green-50 border-green-200',
//               textColor: 'text-green-600',
//             },
//           ]

//           setStats(newStats)
          
//         } else {
//           const errorText = await complaintsResponse.text()
//           console.error('Complaints API error response:', complaintsResponse.status, errorText)
//           throw new Error(`API Error: ${complaintsResponse.status} - ${errorText}`)
//         }
//       } catch (error) {
//         console.error('Error fetching complaint data:', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchComplaintData()
//   }, [])


//   if (loading) {
//     return (
//       <Card className="bg-white border border-slate-200 shadow-md p-6">
//         <div className="flex items-center justify-center py-8">
//           <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
//           <span className="text-gray-600">Loading complaint summary...</span>
//         </div>
//       </Card>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((stat, index) => (
//           <Card
//             key={index}
//             className={`border ${stat.bgColor} bg-white shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
//           >
//             <div className="flex items-start justify-between mb-4">
//               <div className={stat.textColor}>
//                 {stat.icon}
//               </div>
//             </div>
//             <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
//             <p className={`text-3xl font-bold ${stat.textColor} mt-2`}>{stat.value}</p>
//           </Card>
//         ))}
//       </div>

     
//     </div>
//   )
// }
