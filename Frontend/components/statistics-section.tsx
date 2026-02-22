'use client'

import { useEffect, useState } from 'react'

interface StatCard {
  label: string
  value: string
  icon: string
  color: string
}

const stats: StatCard[] = [
  {
    label: 'Total Complaints',
    value: '45,892',
    icon: '📝',
    color: 'from-blue-500 to-blue-600',
  },
  {
    label: 'Resolved',
    value: '43,210',
    icon: '✅',
    color: 'from-green-500 to-green-600',
  },
  {
    label: 'Pending',
    value: '2,682',
    icon: '⏳',
    color: 'from-amber-500 to-amber-600',
  },
  {
    label: 'SLA Compliance',
    value: '94.2%',
    icon: '📊',
    color: 'from-purple-500 to-purple-600',
  },
  {
    label: 'Active Departments',
    value: '28',
    icon: '🏢',
    color: 'from-indigo-500 to-indigo-600',
  },
]

export default function StatisticsSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="py-16 sm:py-24 bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Live System Statistics
          </h2>
          <p className="text-lg text-muted-foreground">
            Real-time data from our smart governance platform
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`group relative ${
                isVisible ? 'scale-in' : 'opacity-0 scale-95'
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 50}ms` : '0ms',
                transitionDuration: '500ms',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              
              <div className={`relative bg-white rounded-xl p-6 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg`}>
                <div className={`inline-block bg-gradient-to-br ${stat.color} rounded-lg p-3 mb-4 text-2xl`}>
                  {stat.icon}
                </div>
                
                <p className="text-muted-foreground text-sm font-medium mb-2">
                  {stat.label}
                </p>
                
                <p className="text-3xl font-bold text-foreground">
                  {stat.value}
                </p>

                <div className="mt-4 h-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                    style={{
                      width: '100%',
                      animation: isVisible ? `slideInUp 0.8s ease-out ${index * 100}ms both` : 'none',
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
