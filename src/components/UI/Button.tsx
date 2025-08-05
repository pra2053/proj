import type React from "react"

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
variant?: "primary" | "secondary" | "danger" | "outline";
  type?: "button" | "submit" | "reset"
  className?: string
}


const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  type = "button",
  className = "",
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"

  const variantClasses = {
    primary: disabled
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-md",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400",
    danger:
      "bg-red-600 text-white hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-md",
        outline: "border border-gray-400 text-gray-700 bg-white hover:bg-gray-100",

  }

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
