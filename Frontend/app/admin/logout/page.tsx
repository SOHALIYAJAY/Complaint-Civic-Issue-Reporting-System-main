'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, ArrowRight } from 'lucide-react'

export default function AdminLogout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutComplete, setLogoutComplete] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Start logout process immediately
    handleLogout()
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    
    try {
      // Clear any stored authentication data
      localStorage.removeItem('access_token')
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')
      sessionStorage.removeItem('adminToken')
      sessionStorage.removeItem('adminUser')
      
      // Call logout API if available
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
      try {
        await fetch(`${API_BASE}/api/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      } catch (error) {
        // Continue with logout even if API call fails
        console.log('Logout API call failed, continuing with client-side logout')
      }
      
      // Simulate logout process for better UX
      setTimeout(() => {
        setIsLoggingOut(false)
        setLogoutComplete(true)
      }, 1500)
      
    } catch (error) {
      console.error('Logout error:', error)
      // Still complete logout even if there's an error
      setIsLoggingOut(false)
      setLogoutComplete(true)
    }
  }

  const handleRedirectToLogin = () => {
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Main Logout Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Content */}
          <div className="px-8 py-12">
            {isLoggingOut ? (
              // Logging Out State
              <div className="space-y-6">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <LogOut className="w-8 h-8 text-blue-600 absolute top-4 left-4" />
                  </div>
                </div>
                
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    Logging out...
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Please wait while we secure your session
                  </p>
                </div>
              </div>
            ) : logoutComplete ? (
              // Logout Complete State
              <div className="space-y-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <LogOut className="w-10 h-10 text-green-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    Logged out!
                  </h1>
                  <p className="text-gray-600 text-base">
                    You have been successfully logged out
                  </p>
                </div>

                {/* Success Message */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-green-800 text-sm font-medium">
                      Your session has been securely terminated
                    </p>
                  </div>
                </div>

                {/* Redirect Button */}
                <button
                  onClick={handleRedirectToLogin}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Go to login
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Grievance Portal Administration
          </p>
        </div>
      </div>
    </div>
  )
}
