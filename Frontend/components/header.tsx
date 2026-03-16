'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import GoogleProvider from './GoogleProvider'
import GoogleLoginBtn from './GoogleLoginBtn'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Admin', href: '/admin' },
    { label: 'Department', href: '/department' },
    { label: 'Contact', href: '/contact' },
    { label: 'My Complaints', href: '/my-complaints' },
  ]

  return (
    <header className="bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo and Portal Name */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-lg">
              🏛️
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">Gujarat CivicTrack</h1>
              <p className="text-xs text-muted-foreground">Transparent Governance</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 md:ml-8 lg:ml-12">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <GoogleProvider>
              <GoogleLoginBtn />
            </GoogleProvider>
            <Link href="/raise-complaint">
              <Button className="bg-accent hover:bg-yellow-500 text-accent-foreground">
                Raise Complaint
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border animate-slide-in-up">
            <nav className="flex flex-col gap-2 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-2 px-4 pt-4">
                <GoogleProvider>
                  <GoogleLoginBtn />
                </GoogleProvider>
                <Link href="/raise-complaint" className="flex-1">
                  <Button className="w-full bg-accent hover:bg-yellow-500 text-accent-foreground">
                    Raise Complaint
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
