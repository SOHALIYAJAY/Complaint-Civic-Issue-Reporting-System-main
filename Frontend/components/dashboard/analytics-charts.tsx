'use client'

export default function AnalyticsCharts() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-primary">Analytics Overview</h2>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Complaint Status Pie Chart */}
        <div className="glass-effect rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Complaint Status Distribution</h3>
          
          <div className="flex items-end justify-center gap-4 h-64">
            {/* Pie Chart Placeholder */}
            <div className="relative w-40 h-40 rounded-full border-8 border-blue-500 flex items-center justify-center" style={{
              background: 'conic-gradient(from 0deg, #3b82f6 0deg 108deg, #22c55e 108deg 180deg, #f97316 180deg 216deg, #8b5cf6 216deg 360deg)'
            }}>
              <div className="absolute w-32 h-32 rounded-full bg-background flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-primary">24</p>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-muted-foreground">Open (6)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-muted-foreground">Resolved (18)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm text-muted-foreground">In Progress (4)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-sm text-muted-foreground">Pending (2)</span>
            </div>
          </div>
        </div>

        {/* Monthly Trend Chart */}
        <div className="glass-effect rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Monthly Complaint Trend</h3>

          <div className="flex items-end justify-center gap-2 h-64">
            {/* Bar Chart Placeholder */}
            {[3, 5, 8, 6, 9, 7, 4, 5, 6, 8, 7, 5].map((value, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="w-full bg-gradient-to-t from-primary to-secondary rounded-t transition-all duration-500 hover:opacity-80"
                  style={{ height: `${(value / 10) * 200}px` }}
                ></div>
                <span className="text-xs text-muted-foreground">
                  {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
                </span>
              </div>
            ))}
          </div>

          {/* Stats Footer */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Average</p>
              <p className="text-lg font-bold text-primary">6.25</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Peak Month</p>
              <p className="text-lg font-bold text-primary">September</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-bold text-primary">75</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
