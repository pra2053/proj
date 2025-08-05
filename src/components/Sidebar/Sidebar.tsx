import type React from "react"
import Navigation from "./Navigation"

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-red-600 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" />
            <path d="M2 17L12 22L22 17M2 12L12 17L22 12" />
          </svg>
        </div>
        <span className="text-xs text-gray-600 font-medium">BANK OF AMERICA</span>
      </div>
      <Navigation />
    </div>
  )
}

export default Sidebar
