import React from "react"
import { ChevronDown, ChevronRight } from 'lucide-react'

interface SubItem {
  label: string
  active?: boolean
  path?: string
}

export interface NavSectionProps {
  icon: string
  label: string
  subItems: SubItem[]
  expanded?: boolean
  onClick?: () => void
  onSubItemClick?: (label: string, path?: string) => void
}

const NavSection: React.FC<NavSectionProps> = ({ icon, label, subItems, expanded = false, onClick, onSubItemClick }) => {
  return (
    <div className="px-4 py-2">
      <div
        onClick={onClick}
        className="flex items-center cursor-pointer py-2 hover:bg-gray-100 rounded-md"
      >
        <div className="w-6 text-center">{icon}</div>
        <div className="ml-2 font-medium">{label}</div>
        <div className="ml-auto text-xs">{expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</div>
      </div>

      {expanded && (
        <ul className="pl-8 mt-2 space-y-1">
          {subItems.map((item, index) => (
            <li
              key={index}
              className={`cursor-pointer px-2 py-1 rounded-md ${item.active ? "bg-blue-100 font-semibold" : "hover:bg-gray-200"}`}
              onClick={() => onSubItemClick?.(item.label, item.path)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default NavSection
