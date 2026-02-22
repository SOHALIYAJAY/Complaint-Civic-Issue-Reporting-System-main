'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Camera } from 'lucide-react'

export default function ProfileOverview() {
  return (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-0 shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
        {/* Profile Picture Section */}
        <div className="relative group">
          <Avatar className="w-32 h-32 border-4 border-blue-600">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" />
            <AvatarFallback className="bg-blue-600 text-white text-2xl">JD</AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            className="absolute bottom-0 right-0 rounded-full bg-blue-600 hover:bg-blue-700 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Camera className="w-4 h-4" />
          </Button>
        </div>

        {/* Profile Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Rajesh Kumar</h2>
            <p className="text-slate-600 mt-1">rajesh.kumar@example.com</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white">Citizen</Badge>
            <Badge className="bg-green-500 hover:bg-green-600 text-white">Active</Badge>
            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Verified</Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-300">
            <div>
              <p className="text-slate-500 text-sm">District</p>
              <p className="text-slate-900 font-semibold">Ahmedabad</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Total Complaints</p>
              <p className="text-slate-900 font-semibold text-lg">24</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Resolved</p>
              <p className="text-slate-900 font-semibold text-lg">18</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Member Since</p>
              <p className="text-slate-900 font-semibold">2023</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
