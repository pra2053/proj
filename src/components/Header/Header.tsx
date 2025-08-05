import React from "react"
import { Bell, Settings, User } from "lucide-react"

const Header: React.FC = () => {
  return (
    <header className="bg-white px-8 py-3 border-b border-gray-200">
      <div className="flex justify-between items-center">
        {/* Title */}
        <div className="text-gray-700 text-sm">
          Enterprise Job Scheduling
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-4">
          {/* Shopping cart icon */}
          <button className="p-1.5 text-gray-600 hover:text-gray-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>

          {/* Notification icon with badge */}
          <button className="relative p-1.5 text-gray-600 hover:text-gray-800">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Settings icon */}
          <button className="p-1.5 text-gray-600 hover:text-gray-800">
            <Settings className="w-5 h-5" />
          </button>

          {/* User avatar */}
          <button className="w-8 h-8 rounded-full overflow-hidden">
            <img 
              src="https://ui-avatars.com/api/?name=User&background=6366f1&color=fff" 
              alt="User" 
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
