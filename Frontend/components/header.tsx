'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
    } else {
      setIsLoggedIn(false)
      setUser(null)
    }

    // Listen for storage changes
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('access_token')
      const newUserData = localStorage.getItem('user')
      
      if (newToken && newUserData) {
        setIsLoggedIn(true)
        setUser(JSON.parse(newUserData))
      } else {
        setIsLoggedIn(false)
        setUser(null)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const getNavItems = () => {
    if (!isLoggedIn || !user) {
      // Not logged in - show basic navigation
      return [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ]
    }

    const userRole = user.User_Role || user.role || 'Civic-User'

    switch (userRole) {
      case 'Civic-User':
        // Civic User - can see complaints and raise complaints
        return [
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Contact', href: '/contact' },
          { label: 'My Complaints', href: '/my-complaints' },
          { label: 'Raise Complaint', href: '/raise-complaint' },
        ]
      
      case 'Department-User':
        // Department User - department dashboard, no complaints access
        return [
          { label: 'About', href: '/about' },
          { label: 'Department', href: '/department' },
          { label: 'Contact', href: '/contact' },
        ]
      
      case 'Admin-User':
        // Admin User - admin dashboard only
        return [
          { label: 'About', href: '/about' },
          { label: 'Admin', href: '/admin' },
          { label: 'Contact', href: '/contact' },
        ]
      
      default:
        // Fallback to civic user navigation
        return [
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Contact', href: '/contact' },
          { label: 'My Complaints', href: '/my-complaints' },
          { label: 'Raise Complaint', href: '/raise-complaint' },
        ]
    }
  }

  const navItems = getNavItems()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white text-base">
              🏛️
            </div>
            <div className="leading-tight">
              <p className="text-base font-bold text-primary leading-none">Gujarat CivicTrack</p>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Transparent Governance</p>
            </div>
          </Link>

          {/* Desktop Nav — centered */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                  isActive(item.href)
                    ? 'text-primary bg-primary/8 font-semibold'
                    : 'text-foreground/70 hover:text-primary hover:bg-muted'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            {!isLoggedIn ? (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/profile" className="flex items-center justify-center w-10 h-10 bg-primary rounded-full hover:bg-primary/90 transition-colors">
                  <User className="w-5 h-5 text-white" />
                </Link>
              </>
            )}
            
            {/* Show Raise Complaint button only for Civic Users */}
            {isLoggedIn && user && (user.User_Role === 'Civic-User' || user.role === 'Civic-User') && (
              <Link href="/raise-complaint">
                <Button size="sm" className="bg-accent hover:bg-yellow-500 text-accent-foreground font-semibold">
                  Raise Complaint
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border bg-white">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-primary bg-primary/8 font-semibold'
                    : 'text-foreground/70 hover:text-primary hover:bg-muted'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-3 border-t border-border mt-2">
              {!isLoggedIn ? (
                <>
                  <Link href="/login" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                      Sign Up
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/profile" className="flex items-center justify-center w-10 h-10 bg-primary rounded-full hover:bg-primary/90 transition-colors">
                    <User className="w-5 h-5 text-white" />
                  </Link>
                </>
              )}
              
              {/* Show Raise Complaint button only for Civic Users */}
              {isLoggedIn && user && (user.User_Role === 'Civic-User' || user.role === 'Civic-User') && (
                <Link href="/raise-complaint" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm" className="w-full bg-accent hover:bg-yellow-500 text-accent-foreground font-semibold">
                    Raise Complaint
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
