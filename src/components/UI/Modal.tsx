import type React from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className={`bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden ${className || 'max-w-md w-11/12'}`}>
        <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 m-0">{title}</h3>
          <button
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1 transition-colors"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>{children}</div>
      </div>
    </div>
  )
}

export default Modal
