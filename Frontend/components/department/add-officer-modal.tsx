"use client"

import { useState, useEffect } from "react"
import { X, UserPlus } from "lucide-react"
import api, { apiPost } from '@/lib/api'

interface AddOfficerModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface FormData {
  officer_id: string
  name: string
  email: string
  phone: string
  is_available: boolean
}

interface FormErrors {
  [key: string]: string
}

export default function AddOfficerModal({ open, onClose, onSuccess }: AddOfficerModalProps) {
  const [formData, setFormData] = useState<FormData>({
    officer_id: '',
    name: '',
    email: '',
    phone: '',
    is_available: true,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setAnimateIn(true))
      resetForm()
    } else {
      setAnimateIn(false)
    }
  }, [open])

  const resetForm = () => {
    setFormData({ officer_id: '', name: '', email: '', phone: '', is_available: true })
    setErrors({})
  }

  const validate = (): boolean => {
    const e: FormErrors = {}
    if (!formData.officer_id.trim()) e.officer_id = 'Officer ID is required'
    if (!formData.name.trim()) e.name = 'Name is required'
    if (!formData.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Invalid email'
    if (!formData.phone.trim()) e.phone = 'Phone is required'
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) e.phone = 'Phone must be 10 digits'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    try {
      setSubmitting(true)
      await apiPost('/api/create-officer/', {
        officer_id: formData.officer_id.trim(),
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.replace(/\D/g, ''),
        is_available: formData.is_available,
      })
      handleClose()
      onSuccess?.()
    } catch (error: any) {
      const msg = error?.response?.data?.detail || error?.response?.data?.message || error?.message || 'Failed to add officer'
      alert(String(msg))
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setAnimateIn(false)
    setTimeout(() => { resetForm(); onClose() }, 300)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={handleClose}>
      <div
        className={`bg-white rounded-lg shadow-xl max-w-md w-full transition-all duration-300 ${animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <UserPlus className="w-5 h-5 text-blue-700" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Add New Officer</h2>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Officer ID */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Officer ID *</label>
            <input
              type="text"
              name="officer_id"
              value={formData.officer_id}
              onChange={handleChange}
              placeholder="e.g. OFC001"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${errors.officer_id ? 'border-red-500 focus:ring-red-400' : 'border-slate-300 focus:ring-blue-500'}`}
            />
            {errors.officer_id && <p className="text-xs text-red-600 mt-1">{errors.officer_id}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter officer name"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${errors.name ? 'border-red-500 focus:ring-red-400' : 'border-slate-300 focus:ring-blue-500'}`}
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="officer@example.com"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${errors.email ? 'border-red-500 focus:ring-red-400' : 'border-slate-300 focus:ring-blue-500'}`}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10 digit number"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${errors.phone ? 'border-red-500 focus:ring-red-400' : 'border-slate-300 focus:ring-blue-500'}`}
            />
            {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
          </div>

          {/* Availability */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_available"
              id="is_available"
              checked={formData.is_available}
              onChange={handleChange}
              className="w-4 h-4 accent-blue-600"
            />
            <label htmlFor="is_available" className="text-sm font-medium text-slate-700">Available for assignment</label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Adding...' : 'Add Officer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
