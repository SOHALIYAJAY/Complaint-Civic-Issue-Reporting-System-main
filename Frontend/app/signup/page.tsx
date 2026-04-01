'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react'
import GoogleProvider from '@/components/GoogleProvider'
import GoogleLoginBtn from '@/components/GoogleLoginBtn'
import { useRouter } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export default function SignupPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '', role: 'Civic-User' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // OTP verification state
  const [step, setStep] = useState<'register' | 'verify'>('register')
  const [pendingEmail, setPendingEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) router.push('/dashboard')
  }, [])

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success) {
        setPendingEmail(formData.email)
        setStep('verify')
        setResendCooldown(60)
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[idx] = val.slice(-1)
    setOtp(next)
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus()
  }

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus()
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (text.length === 6) {
      setOtp(text.split(''))
      otpRefs.current[5]?.focus()
    }
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length < 6) { setError('Please enter the complete 6-digit OTP'); return }
    setError('')
    setVerifying(true)
    try {
      const res = await fetch(`${API}/api/verify-email/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail, otp: code })
      })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)
        localStorage.setItem('user', JSON.stringify(data.user))
        window.location.href = '/user-details'
      } else {
        setError(data.message || 'Invalid OTP')
        setOtp(['', '', '', '', '', ''])
        otpRefs.current[0]?.focus()
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setVerifying(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return
    setResending(true)
    setError('')
    try {
      const res = await fetch(`${API}/api/resend-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail })
      })
      const data = await res.json()
      if (data.success) {
        setResendCooldown(60)
        setOtp(['', '', '', '', '', ''])
        otpRefs.current[0]?.focus()
      } else {
        setError(data.message || 'Failed to resend OTP')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setResending(false)
    }
  }

  // ── OTP Verification Screen ───────────────────────────────────────────────
  if (step === 'verify') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-border p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-2">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Verify Your Email</h1>
            <p className="text-sm text-muted-foreground">
              We sent a 6-digit OTP to<br />
              <span className="font-semibold text-foreground">{pendingEmail}</span>
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          {/* OTP Input Boxes */}
          <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => { otpRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(i, e)}
                className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all
                  ${digit ? 'border-primary bg-primary/5 text-primary' : 'border-input bg-background text-foreground'}
                  focus:border-primary focus:ring-2 focus:ring-primary/20`}
              />
            ))}
          </div>

          <Button
            onClick={handleVerify}
            disabled={verifying || otp.join('').length < 6}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            {verifying ? (
              <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Verifying...</span>
            ) : (
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Verify Email</span>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Didn't receive the OTP?{' '}
            {resendCooldown > 0 ? (
              <span className="text-muted-foreground">Resend in {resendCooldown}s</span>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-primary hover:underline font-semibold disabled:opacity-50"
              >
                {resending ? 'Sending...' : 'Resend OTP'}
              </button>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Wrong email?{' '}
            <button onClick={() => { setStep('register'); setError('') }} className="text-primary hover:underline">
              Go back
            </button>
          </p>
        </div>
      </div>
    )
  }

  // ── Registration Screen ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-secondary to-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="text-white text-center space-y-8 max-w-lg relative z-10 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="space-y-4">
            <h2 className="text-6xl font-bold drop-shadow-lg">Join Gujarat Civic Portal</h2>
            <p className="text-xl text-white/90 leading-relaxed">Be part of transparent governance and make your voice heard</p>
          </div>
          <div className="space-y-4 pt-8 text-left">
            {[
              { title: 'Report Issues Instantly', sub: '24/7 complaint registration' },
              { title: 'Track Progress', sub: 'Real-time status updates' },
              { title: 'Direct Communication', sub: 'Connect with departments' },
            ].map(item => (
              <div key={item.title} className="flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-2xl p-4 hover:bg-white/20 transition-all">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{item.title}</p>
                  <p className="text-sm text-white/80">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-background via-background to-secondary/5">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center space-y-2">
            <div className="inline-block p-3 bg-primary/10 rounded-2xl mb-4">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Create Account</h1>
            <p className="text-muted-foreground text-lg">Sign up to get started</p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Username</label>
              <div className="relative group">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input type="text" value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border-2 border-input bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Enter your username" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input type="email" value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border-2 border-input bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="your@email.com" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Role</label>
              <div className="relative group">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border-2 border-input bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer" required>
                  <option value="Civic-User">Civic User</option>
                  <option value="Department-User">Department User</option>
                  <option value="Officer">Officer</option>
                  <option value="Admin-User">Admin User</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input type={showPassword ? 'text' : 'password'} value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-12 py-3.5 rounded-xl border-2 border-input bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Create a password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-muted-foreground hover:text-primary transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input type={showPassword ? 'text' : 'password'} value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border-2 border-input bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Confirm your password" required />
              </div>
            </div>

            <Button type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all group"
              disabled={loading}>
              {loading ? 'Creating account...' : (
                <span className="flex items-center justify-center gap-2">
                  Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-background text-muted-foreground uppercase tracking-wider">Or continue with</span>
            </div>
          </div>

          <GoogleProvider>
            <div className="flex justify-center"><GoogleLoginBtn /></div>
          </GoogleProvider>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-semibold transition-colors">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
