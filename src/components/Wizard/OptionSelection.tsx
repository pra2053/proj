import React from "react"
import { FileText, FolderEdit, Trash2 } from "lucide-react"

interface OptionSelectionProps {
  selectedOption: string | null
  onSelectOption: (option: string) => void
  onContinue: () => void
}

const OptionSelection: React.FC<OptionSelectionProps> = ({ 
  selectedOption, 
  onSelectOption, 
  onContinue 
}) => {
  const options = [
    {
      id: 'add-new',
      icon: FileText,
      title: 'Add New Job Schedule',
      description: 'Add a new job and define it\'s scheduling criteria in CA7',
    },
    {
      id: 'modify-existing',
      icon: FolderEdit,
      title: 'Modify Existing Job Schedule',
      description: 'Modify an existing job parameters and/or scheduling information in CA7',
    },
    {
      id: 'delete-job',
      icon: Trash2,
      title: 'Delete a Job',
      description: 'Delete a Job alongwith scheduling information from CA7',
    },
  ]

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => onSelectOption(option.id)}
            className={`
              relative p-5 rounded-lg border cursor-pointer transition-all duration-200
              ${selectedOption === option.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
          >
            {/* Selection indicator - blue circle with checkmark */}
            {selectedOption === option.id && (
              <div className="absolute -top-2 -right-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
            
            {/* Icon */}
            <div className="mb-3">
              <option.icon className="w-8 h-8 text-gray-600" strokeWidth={1.5} />
            </div>
            
            {/* Title */}
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {option.title}
            </h3>
            
            {/* Description */}
            <p className="text-xs text-gray-600 leading-relaxed">
              {option.description}
            </p>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <div className="flex justify-start">
        <button
          onClick={onContinue}
          disabled={!selectedOption}
          className={`
            px-6 py-2 text-sm font-medium rounded-md transition-all duration-200
            ${selectedOption 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default OptionSelection
