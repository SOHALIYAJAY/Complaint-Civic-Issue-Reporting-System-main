'use client'

import { Phone, Globe, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function UtilityBar() {
  return (
    <div className="bg-primary text-primary-foreground py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          <span className="text-sm font-medium">Helpline: 1800-233-4567</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <Select defaultValue="en">
              <SelectTrigger className="w-32 bg-secondary text-secondary-foreground border-0 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="gu">Gujarati (ગુજરાતી)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              className="h-7 w-7 p-0 bg-secondary hover:bg-secondary text-secondary-foreground"
              aria-label="Increase text size"
            >
              <Plus className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 w-7 p-0 bg-secondary hover:bg-secondary text-secondary-foreground"
              aria-label="Decrease text size"
            >
              <Minus className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
