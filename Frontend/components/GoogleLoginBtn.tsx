"use client"

import { GoogleLogin } from "@react-oauth/google"
import { useRouter } from "next/navigation"

export default function GoogleLoginBtn() {
  const router = useRouter()

  const getRedirectPath = (user: any) => {
    const userRole = user.User_Role || user.role || 'Civic-User'
    
    switch (userRole) {
      case 'Department-User':
        return '/department'
      case 'Admin-User':
        return '/admin'
      case 'Officer':
        return '/officer'
      case 'Civic-User':
      default:
        return '/user-details' // First go to user details, then dashboard
    }
  }

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/google-login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential })
      })
      
      const data = await response.json()
      
      if (data.success) {
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Redirect based on user role
        const redirectPath = getRedirectPath(data.user)
        router.push(redirectPath)
      } else {
        console.error('Google login failed:', data.message)
        alert('Login failed. Please try again.')
      }
    } catch (error) {
      console.error('Google login error:', error)
      alert('Network error. Please try again.')
    }
  }

  const handleError = () => {
    // Handle login error
  }

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      theme="outline"
      size="large"
      text="continue_with"
      shape="rectangular"
      useOneTap={false}
      auto_select={false}
    />
  )
}
