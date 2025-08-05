import React from "react"
import { CheckCircle } from "lucide-react"

interface SubmitStepProps {
  onSubmit: () => void
  onAddMore: () => void
}

const SubmitStep: React.FC<SubmitStepProps> = ({ onSubmit, onAddMore }) => {
  // In a real implementation, this would be triggered after a successful API call
  React.useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      onSubmit()
    }, 500)
    
    return () => clearTimeout(timer)
  }, [onSubmit])

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg p-8">
        {/* Success Message */}
        <div className="text-center">
          <div className="mx-auto mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Request has been accepted !
          </h2>
          
          <p className="text-gray-600 mb-2">
            Your request has been successfully submitted, and we will process it within 1-3 working days.
          </p>
          
          <p className="text-gray-600 mb-8">
            You can check the request status in the request record.
          </p>
          
          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={onAddMore}
              className="px-6 py-2.5 text-sm font-medium text-blue-500 bg-white border border-blue-500 hover:bg-blue-50 rounded-md transition-all duration-200 min-w-[150px]"
            >
              Add More
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-all duration-200 min-w-[150px]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubmitStep
