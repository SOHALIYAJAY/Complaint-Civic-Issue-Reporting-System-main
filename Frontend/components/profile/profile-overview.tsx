'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Camera } from 'lucide-react'
import { useEffect, useState } from 'react'

interface UserData {
  Username: string
  email: string
  Date: string
  role: string
  total_complaints: number
}

export default function ProfileOverview() {
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access_token')
        const response = await fetch('http://localhost:8000/api/userdetails/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        setUserData(data)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    fetchUserData()
  }, [])

  const getInitials = (name: string) => {
    return name ? name.substring(0, 2).toUpperCase() : 'U'
  }

  const getSignupYear = (date: string) => {
    return date ? new Date(date).getFullYear() : 'N/A'
  }

  if (!userData) {
    return <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-0 shadow-lg p-8">Loading...</Card>
  }

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-0 shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
        {/* Profile Picture Section */}
        <div className="relative group">
          <Avatar className="w-32 h-32 border-4 border-blue-600">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.Username}`} alt="Profile" />
            <AvatarFallback className="bg-blue-600 text-white text-2xl">{getInitials(userData.Username)}</AvatarFallback>
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
            <h2 className="text-3xl font-bold text-slate-900">{userData.Username}</h2>
            <p className="text-slate-600 mt-1">{userData.email}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white">{userData.role}</Badge>
            <Badge className="bg-green-500 hover:bg-green-600 text-white">Active</Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-300">
            <div>
              <p className="text-slate-500 text-sm">Total Complaints</p>
              <p className="text-slate-900 font-semibold text-lg">{userData.total_complaints}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Member Since</p>
              <p className="text-slate-900 font-semibold">{getSignupYear(userData.Date)}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
