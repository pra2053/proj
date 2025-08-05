import type React from "react"

const UserGreeting: React.FC = () => {
  const getCurrentTimestamp = (): string => {
    const now = new Date()
    return `⏰ ${now.toLocaleDateString()}, ${now.toLocaleTimeString()}`
  }

  return (
    <div className="bg-white px-8 py-6 border-b border-gray-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="text-2xl font-semibold text-gray-900 mb-1">Hello John Doe</div>
          <div className="text-gray-600">What would you like to do today?</div>
        </div>
        <div className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">{getCurrentTimestamp()}</div>
      </div>
    </div>
  )
}

export default UserGreeting
