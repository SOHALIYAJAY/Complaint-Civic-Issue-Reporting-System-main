import { ArrowRight } from 'lucide-react'

interface Department {
  name: string
  icon: string
  description: string
  color: string
  complaints: number
}

const departments: Department[] = [
  {
    name: 'Roads & Highways',
    icon: '🛣️',
    description: 'Potholes, road maintenance, traffic issues',
    color: 'from-blue-500 to-blue-600',
    complaints: 8234,
  },
  {
    name: 'Water Supply',
    icon: '💧',
    description: 'Water disruption, quality issues',
    color: 'from-cyan-500 to-cyan-600',
    complaints: 5123,
  },
  {
    name: 'Sanitation',
    icon: '🧹',
    description: 'Waste management, cleanliness',
    color: 'from-green-500 to-green-600',
    complaints: 3456,
  },
  {
    name: 'Street Lighting',
    icon: '💡',
    description: 'Non-functional lights, brightness issues',
    color: 'from-yellow-500 to-yellow-600',
    complaints: 2789,
  },
  {
    name: 'Urban Planning',
    icon: '🏗️',
    description: 'Construction, zoning, development',
    color: 'from-purple-500 to-purple-600',
    complaints: 1923,
  },
  {
    name: 'Drainage',
    icon: '🚿',
    description: 'Clogged drains, water stagnation',
    color: 'from-indigo-500 to-indigo-600',
    complaints: 2145,
  },
]

export default function DepartmentsSection() {
  return (
    <section className="py-16 sm:py-24 bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Active Departments
          </h2>
          <p className="text-lg text-muted-foreground">
            Report issues to the right department with a single click
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept, index) => (
            <div
              key={dept.name}
              className="group cursor-pointer slide-in-up"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="relative h-full bg-white rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
                {/* Gradient Header */}
                <div className={`h-24 bg-gradient-to-br ${dept.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/20 rounded-full"></div>
                  </div>
                  <div className="relative h-full flex items-center justify-between px-6">
                    <span className="text-5xl">{dept.icon}</span>
                    <span className="text-white/80 font-bold text-3xl group-hover:scale-110 transition-transform duration-300">
                      →
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    {dept.description}
                  </p>

                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 mb-6">
                    <p className="text-xs text-muted-foreground mb-1">Active Complaints</p>
                    <p className="text-2xl font-bold text-foreground">
                      {dept.complaints.toLocaleString()}
                    </p>
                  </div>

                  <button className="w-full py-2 px-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3">
                    Report Issue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Can't find your issue? Browse all 28 active departments
          </p>
          <button className="inline-flex items-center justify-center px-8 py-3 bg-white border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300">
            Explore All Departments
          </button>
        </div>
      </div>
    </section>
  )
}
