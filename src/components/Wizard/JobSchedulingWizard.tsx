import React, { useState } from "react"
import StepIndicator from "./StepIndicator"
import OptionSelection from "./OptionSelection"
import JobDefinitionFormWizard from "../Forms/JobDefinition/JobDefinitionFormWizard"
import FrequencyInformation from "./FrequencyInformation"
import ReviewStep from "./ReviewStep"
import SubmitStep from "./SubmitStep"

export interface WizardData {
  selectedOption: string | null
  jobDefinition: any
  frequencies: {
    schedules: any[]
    datasetTriggers: any[]
    jobTriggers: any[]
  }
}

const JobSchedulingWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [wizardData, setWizardData] = useState<WizardData>({
    selectedOption: null,
    jobDefinition: null,
    frequencies: {
      schedules: [],
      datasetTriggers: [],
      jobTriggers: [],
    }
  })

  const steps = [
    { number: 1, title: "Select an Option" },
    { number: 2, title: "Job Information" },
    { number: 3, title: "Frequency Information" },
    { number: 4, title: "Review" },
    { number: 5, title: "Submit" }
  ]

  const handleSelectOption = (option: string) => {
    setWizardData(prev => ({ ...prev, selectedOption: option }))
  }

  const handleContinueFromOption = () => {
    if (wizardData.selectedOption) {
      setCurrentStep(2)
    }
  }

  const handleJobDefinitionContinue = (data: any) => {
    setWizardData(prev => ({ ...prev, jobDefinition: data }))
    setCurrentStep(3)
  }

  const handleFrequencyContinue = (frequencies: any) => {
    setWizardData(prev => ({ ...prev, frequencies }))
    setCurrentStep(4)
  }

  const handleReviewContinue = () => {
    setCurrentStep(5)
  }

  const handleSubmit = () => {
    // Handle final submission
    console.log("Final wizard data:", wizardData)
    // You can add API call here
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleEdit = (step: number) => {
    setCurrentStep(step)
  }

  return (
    <div className="bg-white">
      {/* Title */}
      <div className="px-8 pt-6 pb-4">
        <h1 className="text-xl font-semibold text-gray-900">Job Scheduling</h1>
      </div>

      {/* Step Indicator */}
      <div className="px-8">
        <StepIndicator currentStep={currentStep} steps={steps} />
      </div>

      {/* Content */}
      <div className="px-8 pb-8">
        {currentStep === 1 && (
          <OptionSelection
            selectedOption={wizardData.selectedOption}
            onSelectOption={handleSelectOption}
            onContinue={handleContinueFromOption}
          />
        )}

        {currentStep === 2 && (
          <JobDefinitionFormWizard 
            onContinue={handleJobDefinitionContinue}
            onBack={handleBack}
          />
        )}

        {currentStep === 3 && (
          <FrequencyInformation
            frequencies={wizardData.frequencies}
            jobName={wizardData.jobDefinition?.jobName}
            onContinue={handleFrequencyContinue}
            onBack={handleBack}
          />
        )}

        {currentStep === 4 && (
          <ReviewStep
            wizardData={wizardData}
            onContinue={handleReviewContinue}
            onBack={handleBack}
            onEdit={handleEdit}
          />
        )}

        {currentStep === 5 && (
          <SubmitStep
            onSubmit={handleSubmit}
            onAddMore={() => {
              // Reset wizard
              setCurrentStep(1)
              setWizardData({
                selectedOption: null,
                jobDefinition: null,
                frequencies: {
                  schedules: [],
                  datasetTriggers: [],
                  jobTriggers: [],
                }
              })
            }}
          />
        )}
      </div>
    </div>
  )
}

export default JobSchedulingWizard
