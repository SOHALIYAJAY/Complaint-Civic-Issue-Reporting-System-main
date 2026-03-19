'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Shield, CheckCircle2, Clock, ArrowRight, Home, Lock, User } from 'lucide-react'

export default function DepartmentLogout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutComplete, setLogoutComplete] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const router = useRouter()

  useEffect(() => {
    // Start logout process immediately
    handleLogout()
  }, [])

  useEffect(() => {
    // Countdown timer for redirect
    if (logoutComplete && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (logoutComplete && countdown === 0) {
      router.push('/')
    }
  }, [logoutComplete, countdown, router])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    
    try {
      // Clear authentication data
      localStorage.removeItem('access_token')
      localStorage.removeItem('departmentToken')
      localStorage.removeItem('departmentUser')
      localStorage.removeItem('adminToken')
      sessionStorage.removeItem('access_token')
      sessionStorage.removeItem('departmentToken')
      sessionStorage.removeItem('departmentUser')
      
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
      }, 2000)
      
    } catch (error) {
      console.error('Logout error:', error)
      // Still complete logout even if there's an error
      setIsLoggingOut(false)
      setLogoutComplete(true)
    }
  }

  const handleRedirectNow = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Main Logout Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-600 opacity-10"></div>
            
            {/* Header Content */}
            <div className="relative px-8 py-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                {isLoggingOut ? (
                  <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : logoutComplete ? (
                  <CheckCircle2 className="w-10 h-10 text-white" />
                ) : (
                  <LogOut className="w-10 h-10 text-white" />
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {isLoggingOut ? 'Signing Out...' : 'Logged Out Successfully'}
              </h1>
              <p className="text-gray-600 text-lg">
                {isLoggingOut ? 'Securing your session...' : 'Thank you for your service'}
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-8 py-8">
            {isLoggingOut ? (
              // Logging Out State
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <User className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{width: '60%'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                    <Shield className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <div className="h-2 bg-green-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-600 rounded-full animate-pulse" style={{width: '80%'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <Lock className="w-5 h-5 text-purple-600" />
                    <div className="flex-1">
                      <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-600 rounded-full animate-pulse" style={{width: '40%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-500 text-sm animate-pulse">
                    Please wait while we secure your department account...
                  </p>
                </div>
              </div>
            ) : logoutComplete ? (
              // Logout Complete State
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    See You Soon!
                  </h2>
                  <p className="text-gray-600 mb-2">
                    You have been successfully logged out
                  </p>
                  <p className="text-gray-500 text-sm">
                    Your department session has been securely terminated
                  </p>
                </div>

                {/* Success Features */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                    <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-700 font-medium">Logged Out</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-700 font-medium">Secured</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <Lock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-700 font-medium">Protected</p>
                  </div>
                </div>

                {/* Redirect Timer */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Home className="w-5 h-5 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Redirecting to Home</h3>
                        <p className="text-sm text-gray-600">Auto-redirect in {countdown} seconds</p>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200">
                      <span className="text-xl font-bold text-blue-600">{countdown}</span>
                    </div>
                  </div>
                </div>

                {/* Manual Redirect Button */}
                <button
                  onClick={handleRedirectNow}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <Home className="w-5 h-5" />
                  Go to Home Now
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
            <div className="text-center">
              <p className="text-gray-500 text-sm font-medium">
                Department Grievance Portal
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Civic Services • Community Focus • Efficient Management
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm">Security Notice</h3>
              <p className="text-gray-600 text-xs mt-1">
                Your department session has been securely terminated. All authentication data has been cleared from this device for your protection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
