import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ComplaintsHeader() {
  return (
    <section className="py-8 sm:py-12 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-2">
              My Complaints
            </h1>
            <p className="text-lg text-muted-foreground">
              Track and monitor your submitted civic issues with real-time updates
            </p>
          </div>
          
        </div>
      </div>
    </section>
  )
}
