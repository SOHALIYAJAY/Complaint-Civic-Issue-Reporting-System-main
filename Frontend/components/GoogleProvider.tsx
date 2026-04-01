"use client"

import { GoogleOAuthProvider } from "@react-oauth/google"

export default function GoogleProvider({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId="368010718950-mpbp3m0379j51abunusi6n1o2jtnq715.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  )
}
