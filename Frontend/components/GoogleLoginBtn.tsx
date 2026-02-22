"use client"

import { GoogleLogin } from "@react-oauth/google"

export default function GoogleLoginBtn() {
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        console.log(credentialResponse.credential)
      }}
      onError={() => {
        console.log("Login Failed")
      }}
    />
  )
}
