"use client"

import { GoogleLogin } from "@react-oauth/google"
import { useRouter } from "next/navigation"

export default function GoogleLoginBtn() {
  const router = useRouter()

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
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/dashboard')
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
    console.log("Google Login Failed")
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
