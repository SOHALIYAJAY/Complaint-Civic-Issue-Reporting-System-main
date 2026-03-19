"use client"

import { useEffect, useState } from "react"
import {
  Users,
  UserCheck,
  FileText,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react"
import { getCardColors } from "@/lib/card-colors"

interface KpiCard {
  label: string
  value: string
  trendUp: boolean
  icon: React.ReactNode
  colorType: "users" | "officers" | "total" | "inProgress" | "pending" | "resolved" | "escalated" | "sla" | "admins" | "high" | "medium" | "low"
  suffix?: string
}

function AnimatedValue({ target, suffix }: { target: string; suffix?: string }) {
  const [display, setDisplay] = useState("0")
  const numericTarget = parseFloat(target.replace(/,/g, ""))

  useEffect(() => {
    if (isNaN(numericTarget)) {
      setDisplay(target)
      return
    }
    const duration = 1400
    const steps = 40
    const increment = numericTarget / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= numericTarget) {
        setDisplay(target)
        clearInterval(timer)
      } else {
        setDisplay(
          numericTarget >= 100
            ? Math.floor(current).toLocaleString()
            : current.toFixed(1)
        )
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [numericTarget, target])

  return (
    <span>
      {display}
      {suffix}
    </span>
  )
}

import axios from "@/lib/axios"

export default function OfficersKpiCards() {
  const [kpiData, setKpiData] = useState<KpiCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchKpi() {
      setLoading(true)
      try {
        const res = await axios.get("/api/officer-kpi/")
        const data = res.data
        setKpiData([
          {
            label: "Total Officers",
            value: data.total_officers.toString(),
            trendUp: true,
            icon: <Users className="w-5 h-5" />,
            colorType: "users",
          },
          {
            label: "Active Officers",
            value: data.active_officers.toString(),
            trendUp: true,
            icon: <UserCheck className="w-5 h-5" />,
            colorType: "officers",
          },
          {
            label: "In-Active Officers",
            value: (data.total_officers - data.active_officers).toString(),
            trendUp: false,
            icon: <AlertCircle className="w-5 h-5" />,
            colorType: "inProgress",
          },
          {
            label: "Total Assigned",
            value: data.total_assigned.toString(),
            trendUp: true,
            icon: <FileText className="w-5 h-5" />,
            colorType: "total",
          },
        ])
      } catch (e) {
        setKpiData([])
      } finally {
        setLoading(false)
      }
    }
    fetchKpi()
  }, [])

  if (loading) return <div>Loading KPI cards...</div>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiData.map((card, i) => {
        const colors = getCardColors(card.colorType)
        return (
          <div
            key={i}
            className={`glass-effect rounded-lg border border-[#e2e8f0] border-t-4 ${colors.borderColor} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-4`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`${colors.iconBg} ${colors.iconColor} p-2 rounded-lg`}>
                {card.icon}
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-semibold ${
                  card.label === "Overloaded"
                    ? card.trendUp
                      ? "text-[#dc2626]"
                      : "text-[#16a34a]"
                    : card.label === "Avg Resolution"
                    ? card.trendUp
                      ? "text-[#dc2626]"
                      : "text-[#16a34a]"
                    : card.trendUp
                    ? "text-[#16a34a]"
                    : "text-[#dc2626]"
                }`}
              >
                {(card.label === "Overloaded" || card.label === "Avg Resolution")
                  ? card.trendUp
                    ? <TrendingUp className="w-3.5 h-3.5" />
                    : <TrendingDown className="w-3.5 h-3.5" />
                  : card.trendUp
                  ? <TrendingUp className="w-3.5 h-3.5" />
                  : <TrendingDown className="w-3.5 h-3.5" />
                }
              </div>
            </div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
              {card.label}
            </p>
            <p className="text-2xl font-bold text-slate-800">
              <AnimatedValue target={card.value} suffix={card.suffix} />
            </p>
          </div>
        )
      })}
    </div>
  )
}
