 'use client'

 import { useEffect, useState } from 'react'
 import { useRouter, usePathname } from 'next/navigation'

 type AllowedRole = 'Civic-User' | 'Admin-User' | 'Department-User'

 interface RequireAuthProps {
   children: React.ReactNode
   /**
    * Optional role restriction.
    * If provided, user must have matching role in stored `user` object.
    */
   role?: AllowedRole | AllowedRole[]
 }

 /**
  * Lightweight client-side auth/role guard.
  * - Checks for `access_token` in localStorage.
  * - Optionally checks `user.role` in localStorage.
  * - Redirects to `/login` when not authenticated.
  * - Redirects to `/dashboard` when authenticated but wrong role for admin/department.
  *
  * This intentionally does not call any API; it just enforces the
  * basic client-side contract to avoid showing protected UIs to guests.
  */
 export default function RequireAuth({ children, role }: RequireAuthProps) {
   const router = useRouter()
   const pathname = usePathname()
   const [checking, setChecking] = useState(true)

   useEffect(() => {
     try {
       const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

       // Not logged in -> go to login, but remember where user tried to go
       if (!token || token === 'undefined' || token === 'null') {
         const search = pathname ? `?next=${encodeURIComponent(pathname)}` : ''
         router.replace(`/login${search}`)
         return
       }

       // Role enforcement when requested
       if (role) {
         const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null
         let userRole: string | null = null

         if (stored) {
           try {
             const parsed = JSON.parse(stored)
             userRole = parsed?.role || parsed?.User_Role || null
           } catch {
             userRole = null
           }
         }

         const allowedRoles = Array.isArray(role) ? role : [role]
         if (!userRole || !allowedRoles.includes(userRole as AllowedRole)) {
           // Logged in but wrong role -> send to citizen dashboard as safe default
           router.replace('/dashboard')
           return
         }
       }
     } finally {
       setChecking(false)
     }
   }, [router, pathname, role])

   if (checking) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-background">
         <div className="space-y-3 text-center">
           <p className="text-lg font-semibold text-foreground">Checking your session…</p>
           <p className="text-sm text-muted-foreground">Please wait a moment.</p>
         </div>
       </div>
     )
   }

   return <>{children}</>
 }

