import type React from "react"
import { ChevronRight } from 'lucide-react'

interface NavItemProps {
  icon: string
  label: string
  hasArrow?: boolean
  onClick?: () => void
  active?: boolean
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, hasArrow, onClick, active }) => {
  return (
    <div
      className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors duration-200 text-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-100 ${
        active ? 'text-gray-900 bg-gray-100 font-medium' : 'text-gray-700'
      }`}
      onClick={onClick}
    >
      <span className="w-4 text-center text-sm">{icon}</span>
      <span className="flex-1">{label}</span>
      {hasArrow && <span className="text-xs text-gray-400">{ <ChevronRight size={16} />}</span>}
    </div>
  )
}

export default NavItem
