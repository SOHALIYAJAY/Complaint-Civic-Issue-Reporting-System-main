// Standardized color system for all KPI cards across the website
export const CARD_COLORS = {
  // Primary status colors
  total: {
    borderColor: 'border-t-[#1e40af]', // blue-800
    iconBg: 'bg-blue-50',
    iconColor: 'text-[#1e40af]',
    progressLine: 'bg-blue-500'
  },
  pending: {
    borderColor: 'border-t-[#f59e0b]', // amber-500
    iconBg: 'bg-amber-50',
    iconColor: 'text-[#f59e0b]',
    progressLine: 'bg-orange-500'
  },
  inProgress: {
    borderColor: 'border-t-[#3b82f6]', // blue-500
    iconBg: 'bg-sky-50',
    iconColor: 'text-[#3b82f6]',
    progressLine: 'bg-blue-500'
  },
  resolved: {
    borderColor: 'border-t-[#16a34a]', // green-600
    iconBg: 'bg-green-50',
    iconColor: 'text-[#16a34a]',
    progressLine: 'bg-green-500'
  },
  
  // Secondary status colors
  escalated: {
    borderColor: 'border-t-[#dc2626]', // red-600
    iconBg: 'bg-red-50',
    iconColor: 'text-[#dc2626]',
    progressLine: 'bg-red-500'
  },
  sla: {
    borderColor: 'border-t-[#7c3aed]', // violet-600
    iconBg: 'bg-violet-50',
    iconColor: 'text-[#7c3aed]',
    progressLine: 'bg-purple-500'
  },
  
  // User/Role colors
  users: {
    borderColor: 'border-t-[#1e40af]', // blue-800
    iconBg: 'bg-blue-50',
    iconColor: 'text-[#1e40af]',
    progressLine: 'bg-blue-500'
  },
  officers: {
    borderColor: 'border-t-[#16a34a]', // green-600
    iconBg: 'bg-green-50',
    iconColor: 'text-[#16a34a]',
    progressLine: 'bg-green-500'
  },
  admins: {
    borderColor: 'border-t-[#f59e0b]', // amber-500
    iconBg: 'bg-amber-50',
    iconColor: 'text-[#f59e0b]',
    progressLine: 'bg-orange-500'
  },
  
  // Performance colors
  high: {
    borderColor: 'border-t-[#dc2626]', // red-600
    iconBg: 'bg-red-50',
    iconColor: 'text-[#dc2626]',
    progressLine: 'bg-red-500'
  },
  medium: {
    borderColor: 'border-t-[#f59e0b]', // amber-500
    iconBg: 'bg-amber-50',
    iconColor: 'text-[#f59e0b]',
    progressLine: 'bg-orange-500'
  },
  low: {
    borderColor: 'border-t-[#16a34a]', // green-600
    iconBg: 'bg-green-50',
    iconColor: 'text-[#16a34a]',
    progressLine: 'bg-green-500'
  }
}

// Helper function to get colors by card type
export function getCardColors(type: keyof typeof CARD_COLORS) {
  return CARD_COLORS[type] || CARD_COLORS.total
}
