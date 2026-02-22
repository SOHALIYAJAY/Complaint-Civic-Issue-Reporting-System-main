'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Lock, Eye, EyeOff } from 'lucide-react'

export default function SecuritySettings() {
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false })
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const calculateStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    if (/[^a-zA-Z0-9]/.test(password)) strength += 25
    setPasswordStrength(strength)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswords({ ...passwords, [name]: value })
    if (name === 'new') calculateStrength(value)
  }

  const getStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-red-500'
    if (passwordStrength < 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStrengthText = () => {
    if (passwordStrength < 50) return 'Weak'
    if (passwordStrength < 75) return 'Medium'
    return 'Strong'
  }

  return (
    <Card className="bg-white border border-slate-200 shadow-md p-6">
      <div className="space-y-8">
        {/* Change Password Section */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" />
            Change Password
          </h3>

          <div className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="current" className="text-slate-700 font-semibold">
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="current"
                  name="current"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwords.current}
                  onChange={handlePasswordChange}
                  placeholder="Enter your current password"
                  className="border-slate-300 focus:border-blue-600 focus:ring-blue-600 pr-10"
                />
                <button
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="new" className="text-slate-700 font-semibold">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="new"
                  name="new"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwords.new}
                  onChange={handlePasswordChange}
                  placeholder="Enter your new password"
                  className="border-slate-300 focus:border-blue-600 focus:ring-blue-600 pr-10"
                />
                <button
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {passwords.new && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Password Strength:</span>
                    <span className={`text-sm font-semibold ${
                      passwordStrength < 50 ? 'text-red-500' : 
                      passwordStrength < 75 ? 'text-yellow-500' : 
                      'text-green-500'
                    }`}>
                      {getStrengthText()}
                    </span>
                  </div>
                  <Progress value={passwordStrength} className="h-2" />
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-slate-700 font-semibold">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm"
                  name="confirm"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                  placeholder="Confirm your new password"
                  className="border-slate-300 focus:border-blue-600 focus:ring-blue-600 pr-10"
                />
                <button
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
              Update Password
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-300"></div>

        {/* Two-Factor Authentication */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-lg font-bold text-slate-900">Two-Factor Authentication</h4>
              <p className="text-sm text-slate-600 mt-1">Add an extra layer of security to your account</p>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
          </div>
          {twoFactorEnabled && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-slate-700">
              Two-factor authentication is enabled. You will need to enter a code from your authenticator app when signing in.
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-300"></div>

        {/* Last Login Info */}
        <div>
          <h4 className="text-lg font-bold text-slate-900 mb-4">Login Activity</h4>
          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Last Login</span>
              <span className="text-slate-900 font-semibold">Today at 2:45 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Last Login Location</span>
              <span className="text-slate-900 font-semibold">Ahmedabad, India</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Device</span>
              <span className="text-slate-900 font-semibold">Chrome on Windows</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
