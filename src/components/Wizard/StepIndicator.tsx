import React from "react"

interface StepIndicatorProps {
  currentStep: number
  steps: {
    number: number
    title: string
  }[]
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full bg-white py-4">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step */}
            <div className="relative z-10 flex items-center">
              <div className="flex flex-col items-center">
                {/* Step Number Above */}
                <span className={`
                  text-xs font-medium mb-1
                  ${currentStep === step.number ? 'text-blue-600' : 
                    currentStep > step.number ? 'text-green-600' : 'text-gray-400'}
                `}>
                  {step.number}
                </span>
                
                {/* Step Circle */}
                <div 
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    transition-all duration-300 border-2
                    ${currentStep === step.number 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : currentStep > step.number
                      ? 'bg-green-50 text-green-600 border-green-600'
                      : 'bg-gray-50 text-gray-400 border-gray-300'
                    }
                  `}
                >
                  {currentStep > step.number ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    ''
                  )}
                </div>
                
                {/* Step Title */}
                <span 
                  className={`
                    mt-2 text-xs font-normal whitespace-nowrap
                    ${currentStep === step.number ? 'text-gray-700 font-medium' : 
                      currentStep > step.number ? 'text-gray-600' : 'text-gray-400'}
                  `}
                >
                  {step.title}
                </span>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2 mt-[-20px]">
                <div 
                  className={`
                    h-[2px] transition-all duration-300
                    ${currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'}
                  `}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default StepIndicator
