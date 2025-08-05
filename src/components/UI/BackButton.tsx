import type React from "react"

interface BackButtonProps {
  onClick: () => void
  disabled?: boolean
  children?: React.ReactNode
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, disabled = false, children = "Back" }) => {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        disabled ? "opacity-50 cursor-not-allowed bg-gray-50 text-gray-400" : "hover:-translate-x-0.5"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="text-base font-bold transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
      {children}
    </button>
  )
}

export default BackButton
