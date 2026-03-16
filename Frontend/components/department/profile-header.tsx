"use client"

import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  BadgeCheck,
  Shield,
  Hash,
} from "lucide-react"

const profileData = {
  name: "Shri Rajesh K. Patel",
  designation: "Department Head - Public Works",
  department: "Public Works Department",
  employeeId: "GJ-PWD-DH-001",
  email: "rajesh.patel@gujarat.gov.in",
  phone: "+91 79 2325 1100",
  office: "Block-B, 3rd Floor, Sachivalay, Gandhinagar",
  joiningDate: "15 March 2018",
  status: "Active",
}

export default function ProfileHeader() {
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
      {/* Blue accent header */}
      <div className="h-32 bg-gradient-to-r from-[#1e40af] to-[#3b82f6] relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-8 w-24 h-24 rounded-full border-2 border-white/30" />
          <div className="absolute bottom-2 left-16 w-16 h-16 rounded-full border-2 border-white/20" />
        </div>
      </div>

      <div className="px-6 pb-6 -mt-12">
        <div className="flex flex-col lg:flex-row lg:items-end gap-5">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center flex-shrink-0">
            <div className="w-full h-full rounded-full bg-[#1e40af] flex items-center justify-center">
              <span className="text-3xl font-bold text-white">RP</span>
            </div>
          </div>

          {/* Name and designation */}
          <div className="flex-1 min-w-0 pt-2 lg:pt-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800 text-balance">{profileData.name}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-[#16a34a] border border-green-200 w-fit">
                <BadgeCheck className="w-3.5 h-3.5" />
                {profileData.status}
              </span>
            </div>
            <p className="text-sm text-[#3b82f6] font-medium mt-1">{profileData.designation}</p>
            <p className="text-sm text-slate-500 mt-0.5">{profileData.department}</p>
          </div>

          {/* Authority badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e40af]/5 border border-[#1e40af]/15">
            <Shield className="w-5 h-5 text-[#1e40af]" />
            <div>
              <p className="text-xs font-semibold text-[#1e40af]">Administrative Authority</p>
              <p className="text-[10px] text-slate-500">Level-1 Department Leadership</p>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DetailItem
            icon={<Hash className="w-4 h-4" />}
            label="Employee ID"
            value={profileData.employeeId}
          />
          <DetailItem
            icon={<Mail className="w-4 h-4" />}
            label="Email Address"
            value={profileData.email}
          />
          <DetailItem
            icon={<Phone className="w-4 h-4" />}
            label="Contact Number"
            value={profileData.phone}
          />
          <DetailItem
            icon={<Calendar className="w-4 h-4" />}
            label="Joining Date"
            value={profileData.joiningDate}
          />
          <div className="sm:col-span-2 lg:col-span-4">
            <DetailItem
              icon={<MapPin className="w-4 h-4" />}
              label="Office Location"
              value={profileData.office}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f1f5f9]/70 border border-[#e2e8f0]">
      <div className="text-[#3b82f6] mt-0.5">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-slate-700 truncate">{value}</p>
      </div>
    </div>
  )
}
