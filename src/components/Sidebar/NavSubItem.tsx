import type React from "react"

interface NavSubItemProps {
  label: string
  active?: boolean
  onClick?: () => void
}

const NavSubItem: React.FC<NavSubItemProps> = ({ label, active, onClick }) => {
  const handleClick = () => {
    console.log(`Clicked on sub-item: ${label}`)
    if (onClick) onClick()
  }

  return (
    <div
      className={`px-7 py-2 text-sm cursor-pointer transition-colors duration-200 ${
        active
          ? "text-blue-600 font-medium bg-blue-50 border-l-3 border-blue-600"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
      }`}
      onClick={handleClick}
    >
      {label}
    </div>
  )
}

export default NavSubItem
