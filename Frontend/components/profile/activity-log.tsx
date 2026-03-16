'use client'

import { Card } from '@/components/ui/card'
import { FileText, CheckCircle, UserCheck, LogIn, Zap } from 'lucide-react'

interface Activity {
  id: string
  type: 'submitted' | 'resolved' | 'updated' | 'login' | 'other'
  title: string
  description: string
  timestamp: string
  icon: React.ReactNode
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'submitted',
    title: 'Complaint Submitted',
    description: 'Reported pothole on MG Road',
    timestamp: '2 hours ago',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    id: '2',
    type: 'resolved',
    title: 'Complaint Resolved',
    description: 'Water supply issue fixed in Zone 5',
    timestamp: '1 day ago',
    icon: <CheckCircle className="w-5 h-5" />,
  },
  {
    id: '3',
    type: 'updated',
    title: 'Profile Updated',
    description: 'Changed mobile number',
    timestamp: '3 days ago',
    icon: <UserCheck className="w-5 h-5" />,
  },
  {
    id: '4',
    type: 'login',
    title: 'Login',
    description: 'Successfully logged in from Windows',
    timestamp: '3 days ago',
    icon: <LogIn className="w-5 h-5" />,
  },
  {
    id: '5',
    type: 'submitted',
    title: 'Complaint Submitted',
    description: 'Reported street light malfunction',
    timestamp: '1 week ago',
    icon: <FileText className="w-5 h-5" />,
  },
]

const getTypeColor = (type: string) => {
  switch (type) {
    case 'submitted':
      return 'bg-blue-100 text-blue-600'
    case 'resolved':
      return 'bg-green-100 text-green-600'
    case 'updated':
      return 'bg-purple-100 text-purple-600'
    case 'login':
      return 'bg-yellow-100 text-yellow-600'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

export default function ActivityLog() {
  return (
    <Card className="bg-white border border-slate-200 shadow-md p-6">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Zap className="w-5 h-5 text-blue-600" />
        Recent Activity
      </h3>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex gap-4">
            {/* Timeline Connector */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(activity.type)}`}>
                {activity.icon}
              </div>
              {index !== activities.length - 1 && (
                <div className="w-0.5 h-12 bg-slate-300 mt-2"></div>
              )}
            </div>

            {/* Activity Content */}
            <div className="pb-4 flex-1">
              <h4 className="font-semibold text-slate-900">{activity.title}</h4>
              <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
              <p className="text-xs text-slate-500 mt-2">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-300">
        <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
          View Full Activity Log →
        </button>
      </div>
    </Card>
  )
}
