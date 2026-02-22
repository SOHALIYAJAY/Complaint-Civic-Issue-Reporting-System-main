'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Edit2, Save, X } from 'lucide-react'

export default function PersonalInformation() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    mobile: '+91 98765 43210',
    address: '123 MG Road, Ahmedabad',
    district: 'Ahmedabad',
    taluka: 'Ahmedabad',
    wardNumber: '45',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSave = () => {
    console.log('Saved:', formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <Card className="bg-white border border-slate-200 shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-900">Personal Information</h3>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-slate-700 font-semibold">
            Full Name
          </Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={!isEditing}
            className="border-slate-300 focus:border-blue-600 focus:ring-blue-600 disabled:bg-slate-100"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 font-semibold">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            className="border-slate-300 focus:border-blue-600 focus:ring-blue-600 disabled:bg-slate-100"
          />
        </div>

        {/* Mobile Number */}
        <div className="space-y-2">
          <Label htmlFor="mobile" className="text-slate-700 font-semibold">
            Mobile Number
          </Label>
          <Input
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            disabled={!isEditing}
            className="border-slate-300 focus:border-blue-600 focus:ring-blue-600 disabled:bg-slate-100"
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address" className="text-slate-700 font-semibold">
            Address
          </Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={!isEditing}
            className="border-slate-300 focus:border-blue-600 focus:ring-blue-600 disabled:bg-slate-100"
          />
        </div>

        {/* District */}
        <div className="space-y-2">
          <Label htmlFor="district" className="text-slate-700 font-semibold">
            District
          </Label>
          <Select value={formData.district} onValueChange={(value) => handleSelectChange('district', value)} disabled={!isEditing}>
            <SelectTrigger id="district" className="border-slate-300 focus:border-blue-600 focus:ring-blue-600 disabled:bg-slate-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
              <SelectItem value="Surat">Surat</SelectItem>
              <SelectItem value="Vadodara">Vadodara</SelectItem>
              <SelectItem value="Rajkot">Rajkot</SelectItem>
              <SelectItem value="Bhavnagar">Bhavnagar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Taluka */}
        <div className="space-y-2">
          <Label htmlFor="taluka" className="text-slate-700 font-semibold">
            Taluka
          </Label>
          <Select value={formData.taluka} onValueChange={(value) => handleSelectChange('taluka', value)} disabled={!isEditing}>
            <SelectTrigger id="taluka" className="border-slate-300 focus:border-blue-600 focus:ring-blue-600 disabled:bg-slate-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
              <SelectItem value="Bavla">Bavla</SelectItem>
              <SelectItem value="Dholka">Dholka</SelectItem>
              <SelectItem value="Sanand">Sanand</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Ward Number */}
        <div className="space-y-2">
          <Label htmlFor="wardNumber" className="text-slate-700 font-semibold">
            Ward Number
          </Label>
          <Input
            id="wardNumber"
            name="wardNumber"
            value={formData.wardNumber}
            onChange={handleChange}
            disabled={!isEditing}
            className="border-slate-300 focus:border-blue-600 focus:ring-blue-600 disabled:bg-slate-100"
          />
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-300">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="border-slate-300 hover:bg-slate-100 gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      )}
    </Card>
  )
}
