import React, { useState } from "react"
import { Button } from "../../UI"

interface JobDefinitionFormProps {
  onContinue: (data: JobDefinitionData) => void
}

interface JobDefinitionData {
  jobName: string
  region: string
  lpar: string
  uid: string
  jclLibrary: string
  distributionEmailList: string
  changeRequestNumber: string
  crqNumber: string
  isFutureScheduled: string
  activateJobOn: string
  activationTimeHH: string
  activationTimeMM: string
  conditionCodeCheck: boolean
  calloutPriority: string
}

const JobDefinitionForm: React.FC<JobDefinitionFormProps> = ({ onContinue }) => {
  const [jobName, setJobName] = useState("")
  const [region, setRegion] = useState("")
  const [lpar, setLpar] = useState("")
  const [uid, setUid] = useState("255") // Default to 255
  const [jclLibrary, setJclLibrary] = useState("PROD.NBSP.PROD.JCLLIB") // Default value
  const [distributionEmailList, setDistributionEmailList] = useState("")
  const [changeRequestNumber, setChangeRequestNumber] = useState("")
  const [crqNumber, setCrqNumber] = useState("")
  const [isFutureScheduled, setIsFutureScheduled] = useState("No")
  const [activateJobOn, setActivateJobOn] = useState("")
  const [activationTimeHH, setActivationTimeHH] = useState("")
  const [activationTimeMM, setActivationTimeMM] = useState("")
  const [conditionCodeCheck, setConditionCodeCheck] = useState(false)
  const [calloutPriority, setCalloutPriority] = useState("")
  const [isApiCallInProgress, setIsApiCallInProgress] = useState(false)
  const [apiCallFailed, setApiCallFailed] = useState(false)
  const [errors, setErrors] = useState({
    jobName: "",
    region: "",
    lpar: "",
    uid: "",
    jclLibrary: "",
    distributionEmailList: "",
    changeRequestNumber: "",
    crqNumber: "",
    isFutureScheduled: "",
    activateJobOn: "",
    activationTimeHH: "",
    activationTimeMM: "",
    conditionCodeCheck: "",
    calloutPriority: "",
  })

  // Mock data for dropdowns - replace with API calls
  const regions = ["EAST", "WEST", "NORTH", "SOUTH", "CENTRAL", "EMEA"]
  const lpars = ["LPAR01", "LPAR02", "LPAR03", "LPAR04", "LPAR05"]
  const uids = ["255", "300", "400", "500", "600"]
  const jclLibraries = ["PROD.NBSP.PROD.JCLLIB", "LIB.JCL.TEST", "LIB.JCL.DEV", "LIB.JCL.UAT"]
  const distributionEmailLists = ["team1@company.com", "team2@company.com", "admin@company.com", "ops@company.com"]
  const isFutureScheduledOptions = ["No", "Yes"]
  const calloutPriorities = ["1", "2", "3", "4", "5"]
  
  // Generate hours and minutes for time dropdowns
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))
  
  // Check if the first 3 primary fields are completed
  const arePrimaryFieldsCompleted = (): boolean => {
    return jobName.trim() !== "" && region.trim() !== "" && lpar.trim() !== ""
  }
  
  // Helper function for disabled state styling
  const isPrimaryFieldDisabled = arePrimaryFieldsCompleted() || isApiCallInProgress
  
  // Check if region is EMEA for conditional fields
  const isEmeaRegion = region === "EMEA"

  // Validation regex patterns
  const jobNameRegex = /^[A-Z@#$][A-Z0-9@#$]*$/ // Cannot start with number, uppercase only, A-Z, 0-9, @, #, $
  const regionRegex = /^[a-zA-Z]+$/
  const lparRegex = /^[a-zA-Z0-9]+$/

  // Validation functions that update error state
  const validateJobName = (value: string): boolean => {
    if (!value) {
      setErrors(prev => ({ ...prev, jobName: "Job Name is required" }))
      return false
    }
    if (!jobNameRegex.test(value)) {
      setErrors(prev => ({ ...prev, jobName: "Job Name cannot start with a number and can contain A-Z, 0-9, @, # or $. All chars must be uppercase" }))
      return false
    }
    setErrors(prev => ({ ...prev, jobName: "" }))
    return true
  }

  const validateRegion = (value: string): boolean => {
    if (!value) {
      setErrors(prev => ({ ...prev, region: "Region is required" }))
      return false
    }
    if (!regionRegex.test(value)) {
      setErrors(prev => ({ ...prev, region: "Region must contain only alphabets" }))
      return false
    }
    setErrors(prev => ({ ...prev, region: "" }))
    return true
  }

  const validateLpar = (value: string): boolean => {
    if (!value) {
      setErrors(prev => ({ ...prev, lpar: "LPAR is required" }))
      return false
    }
    if (!lparRegex.test(value)) {
      setErrors(prev => ({ ...prev, lpar: "LPAR must be alphanumeric" }))
      return false
    }
    setErrors(prev => ({ ...prev, lpar: "" }))
    return true
  }

  // Check if form is valid without updating state
  const isFormValid = (): boolean => {
    // Primary validation - first 3 fields must be filled and valid
    if (!jobName || !region || !lpar) return false
    if (!jobNameRegex.test(jobName)) return false
    if (!regionRegex.test(region)) return false
    if (!lparRegex.test(lpar)) return false
    
    // If primary fields are completed, check secondary fields (only if they are shown)
    if (arePrimaryFieldsCompleted()) {
      if (!uid || !jclLibrary || !distributionEmailList) return false
      
      // Additional validation for future schedule fields
      if (isFutureScheduled === "Yes") {
        if (!activateJobOn || !activationTimeHH || !activationTimeMM) return false
      }
      
      // EMEA region specific validation
      if (isEmeaRegion) {
        if (!calloutPriority) return false
      }
    }
    
    return true
  }

  // Continue button should be enabled when primary fields are valid (for step-by-step progression)
  const isContinueEnabled = (): boolean => {
    // Enable continue when first 3 fields are valid, even if secondary fields aren't filled yet
    const primaryFieldsValid = jobName.trim() !== "" && region.trim() !== "" && lpar.trim() !== "" && 
                               jobNameRegex.test(jobName) && regionRegex.test(region) && lparRegex.test(lpar)
    
    // If primary fields are valid, allow continue
    if (primaryFieldsValid) {
      return true
    }
    
    // Also allow continue if API call failed and form is otherwise valid
    return apiCallFailed && isFormValid()
  }

  const handleJobNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase() // Convert to uppercase
    setJobName(value)
    if (value) {
      validateJobName(value)
    } else {
      setErrors(prev => ({ ...prev, jobName: "" }))
    }
  }

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setRegion(value)
    if (value) {
      validateRegion(value)
    } else {
      setErrors(prev => ({ ...prev, region: "" }))
    }
  }

  const handleLparChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setLpar(value)
    if (value) {
      validateLpar(value)
    } else {
      setErrors(prev => ({ ...prev, lpar: "" }))
    }
  }

  const handleUidChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUid(e.target.value)
  }

  const handleJclLibraryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setJclLibrary(e.target.value)
  }

  const handleDistributionEmailListChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistributionEmailList(e.target.value)
  }

  const handleChangeRequestNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChangeRequestNumber(e.target.value)
  }

  const handleCrqNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCrqNumber(e.target.value)
  }

  const handleIsFutureScheduledChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setIsFutureScheduled(value)
    // Reset future schedule fields when switching to No
    if (value === "No") {
      setActivateJobOn("")
      setActivationTimeHH("")
      setActivationTimeMM("")
    }
  }

  const handleActivateJobOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActivateJobOn(e.target.value)
  }

  const handleActivationTimeHHChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActivationTimeHH(e.target.value)
  }

  const handleActivationTimeMMChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActivationTimeMM(e.target.value)
  }

  const handleConditionCodeCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConditionCodeCheck(e.target.checked)
  }

  const handleCalloutPriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCalloutPriority(e.target.value)
  }

  const handleContinue = async () => {
    // For step-by-step validation, check if we have the minimum required fields filled
    const isJobNameValid = validateJobName(jobName)
    const isRegionValid = validateRegion(region)
    const isLparValid = validateLpar(lpar)
    
    // Allow continue if primary fields are valid (progressive disclosure)
    if (isJobNameValid && isRegionValid && isLparValid) {
      try {
        setIsApiCallInProgress(true)
        setApiCallFailed(false)
        
        // Simulate API call - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const data: JobDefinitionData = {
          jobName,
          region,
          lpar,
          uid,
          jclLibrary,
          distributionEmailList,
          changeRequestNumber,
          crqNumber,
          isFutureScheduled,
          activateJobOn,
          activationTimeHH,
          activationTimeMM,
          conditionCodeCheck,
          calloutPriority,
        }
        onContinue(data)
      } catch (error) {
        setApiCallFailed(true)
        console.error("API call failed:", error)
      } finally {
        setIsApiCallInProgress(false)
      }
    }
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Main Form Content */}
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Job Definition</h2>
            <p className="text-sm text-gray-600">Please fill in the job details below</p>
          </div>

          <div className="max-w-7xl">
            {/* Main Layout: Column-based approach with enhanced visual hierarchy */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 xl:gap-12">
              
              {/* Left Column - Primary Fields (1/4 width) */}
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Primary Information</h4>
                  <p className="text-sm text-gray-600 mb-6">Complete these required fields to continue</p>
                  
                  {/* Job Name Field - Vertical stack */}
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Job Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 text-sm border rounded-md transition-colors ${
                        isPrimaryFieldDisabled 
                          ? 'bg-gray-100 cursor-not-allowed opacity-60 border-gray-300' 
                          : 'bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                      } ${errors.jobName ? 'border-red-500' : 'border-gray-300'}`}
                      value={jobName}
                      onChange={handleJobNameChange}
                      disabled={isPrimaryFieldDisabled}
                      placeholder="Enter job name"
                    />
                    {errors.jobName && (
                      <span className="block mt-1 text-xs text-red-500">{errors.jobName}</span>
                    )}
                  </div>

                  {/* Region Field - Vertical stack */}
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Region <span className="text-red-500">*</span>
                    </label>
                    <select
                      className={`w-full px-3 py-2 text-sm border rounded-md transition-colors ${
                        isPrimaryFieldDisabled 
                          ? 'bg-gray-100 cursor-not-allowed opacity-60 border-gray-300' 
                          : 'bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                      } ${errors.region ? 'border-red-500' : 'border-gray-300'}`}
                      value={region}
                      onChange={handleRegionChange}
                      disabled={isPrimaryFieldDisabled}
                    >
                      <option value="">--Select Region--</option>
                      {regions.map((regionOption) => (
                        <option key={regionOption} value={regionOption}>
                          {regionOption}
                        </option>
                      ))}
                    </select>
                    {errors.region && (
                      <span className="block mt-1 text-xs text-red-500">{errors.region}</span>
                    )}
                  </div>

                  {/* LPAR Field - Vertical stack */}
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      LPAR <span className="text-red-500">*</span>
                    </label>
                    <select
                      className={`w-full px-3 py-2 text-sm border rounded-md transition-colors ${
                        isPrimaryFieldDisabled 
                          ? 'bg-gray-100 cursor-not-allowed opacity-60 border-gray-300' 
                          : 'bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                      } ${errors.lpar ? 'border-red-500' : 'border-gray-300'}`}
                      value={lpar}
                      onChange={handleLparChange}
                      disabled={isPrimaryFieldDisabled}
                    >
                      <option value="">--Select LPAR--</option>
                      {lpars.map((lparOption) => (
                        <option key={lparOption} value={lparOption}>
                          {lparOption}
                        </option>
                      ))}
                    </select>
                    {errors.lpar && (
                      <span className="block mt-1 text-xs text-red-500">{errors.lpar}</span>
                    )}
                  </div>

                  {/* Visual completion indicator */}
                  {arePrimaryFieldsCompleted() && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-green-700 font-medium">Primary fields completed</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Columns - Secondary Fields (3/4 width) */}
              {arePrimaryFieldsCompleted() && (
                <div className="lg:col-span-3">

                  {/* Secondary Fields Grid - 3 columns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Column 1 - UID, JCL Library, Distribution Email List */}
                    <div className="space-y-6">
                      {/* UID Field */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          UID <span className="text-red-500">*</span>
                        </label>
                        <select
                          className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.uid ? 'border-red-500' : 'border-gray-300'
                          } ${isApiCallInProgress ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}`}
                          value={uid}
                          onChange={handleUidChange}
                          disabled={isApiCallInProgress}
                        >
                          {uids.map((uidOption) => (
                            <option key={uidOption} value={uidOption}>
                              {uidOption}
                            </option>
                          ))}
                        </select>
                        {errors.uid && (
                          <span className="block mt-1 text-xs text-red-500">{errors.uid}</span>
                        )}
                      </div>

                      {/* JCL Library Field */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          JCL Library <span className="text-red-500">*</span>
                        </label>
                        <select
                          className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.jclLibrary ? 'border-red-500' : 'border-gray-300'
                          } ${isApiCallInProgress ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}`}
                          value={jclLibrary}
                          onChange={handleJclLibraryChange}
                          disabled={isApiCallInProgress}
                        >
                          {jclLibraries.map((libraryOption) => (
                            <option key={libraryOption} value={libraryOption}>
                              {libraryOption}
                            </option>
                          ))}
                        </select>
                        {errors.jclLibrary && (
                          <span className="block mt-1 text-xs text-red-500">{errors.jclLibrary}</span>
                        )}
                      </div>

                      {/* Distribution Email List Field */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Distribution Email List <span className="text-red-500">*</span>
                        </label>
                        <select
                          className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.distributionEmailList ? 'border-red-500' : 'border-gray-300'
                          } ${isApiCallInProgress ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}`}
                          value={distributionEmailList}
                          onChange={handleDistributionEmailListChange}
                          disabled={isApiCallInProgress}
                        >
                          <option value="">--Select Email List--</option>
                          {distributionEmailLists.map((emailOption) => (
                            <option key={emailOption} value={emailOption}>
                              {emailOption}
                            </option>
                          ))}
                        </select>
                        {errors.distributionEmailList && (
                          <span className="block mt-1 text-xs text-red-500">{errors.distributionEmailList}</span>
                        )}
                      </div>
                    </div>

                    {/* Column 2 - Change Request Number, CRQ Number */}
                    <div className="space-y-6">
                      {/* Change Request Number Field - Always Disabled */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Change Request Number
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border rounded-md bg-gray-100 cursor-not-allowed opacity-60 border-gray-300 transition-colors"
                          value={changeRequestNumber}
                          onChange={handleChangeRequestNumberChange}
                          disabled={true}
                          placeholder="Enter change request number"
                        />
                        {errors.changeRequestNumber && (
                          <span className="block mt-1 text-xs text-red-500">{errors.changeRequestNumber}</span>
                        )}
                      </div>

                      {/* CRQ Number Field - Always Disabled */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          CRQ Number
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border rounded-md bg-gray-100 cursor-not-allowed opacity-60 border-gray-300 transition-colors"
                          value={crqNumber}
                          onChange={handleCrqNumberChange}
                          disabled={true}
                          placeholder="Enter CRQ number"
                        />
                        {errors.crqNumber && (
                          <span className="block mt-1 text-xs text-red-500">{errors.crqNumber}</span>
                        )}
                      </div>
                    </div>

                    {/* Column 3 - Future Scheduling */}
                    <div className="space-y-6">
                      {/* Activate Schedule in Future Field */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Activate schedule in future <span className="text-red-500">*</span>
                        </label>
                        <select
                          className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.isFutureScheduled ? 'border-red-500' : 'border-gray-300'
                          } ${isApiCallInProgress ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}`}
                          value={isFutureScheduled}
                          onChange={handleIsFutureScheduledChange}
                          disabled={isApiCallInProgress}
                        >
                          {isFutureScheduledOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        {errors.isFutureScheduled && (
                          <span className="block mt-1 text-xs text-red-500">{errors.isFutureScheduled}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* EMEA Region Specific Fields - Full width section */}
                  {isEmeaRegion && (
                    <div className="mb-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="text-md font-medium text-gray-900 mb-4">EMEA Region Specific Fields</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Condition Code Check Field - Disabled with checkbox to remove */}
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Condition Code Check
                          </label>
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-not-allowed opacity-60"
                              checked={conditionCodeCheck}
                              onChange={handleConditionCodeCheckChange}
                              disabled={true}
                            />
                            <span className="text-sm text-gray-500">Enabled (Only removal can be done)</span>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input type="checkbox" className="w-4 h-4 text-red-600" />
                              <span className="text-sm text-red-600">Remove</span>
                            </label>
                          </div>
                        </div>

                        {/* Callout Priority Field - Required for EMEA */}
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Callout Priority <span className="text-red-500">*</span>
                          </label>
                          <select
                            className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              errors.calloutPriority ? 'border-red-500' : 'border-gray-300'
                            } ${isApiCallInProgress ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}`}
                            value={calloutPriority}
                            onChange={handleCalloutPriorityChange}
                            disabled={isApiCallInProgress}
                          >
                            <option value="">SELECT ONE (Range 1 to 5)</option>
                            {calloutPriorities.map((priority) => (
                              <option key={priority} value={priority}>
                                {priority}
                              </option>
                            ))}
                          </select>
                          {errors.calloutPriority && (
                            <span className="block mt-1 text-xs text-red-500">{errors.calloutPriority}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Future Scheduling Button - Only show when not already enabled */}
                  {isFutureScheduled === "No" && (
                    <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-md font-medium text-gray-900">Future Schedule Configuration</h4>
                          <p className="text-sm text-gray-600">Enable future scheduling to set activation date and time</p>
                        </div>
                        <button
                          type="button"
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                          onClick={() => setIsFutureScheduled("Yes")}
                        >
                          Enable Future Scheduling
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Conditional Fields for Future Schedule - Full width section */}
                  {isFutureScheduled === "Yes" && (
                    <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Future Schedule Configuration</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Activate the job on Field */}
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Activate the job on (date) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              errors.activateJobOn ? 'border-red-500' : 'border-gray-300'
                            } ${isApiCallInProgress ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}`}
                            value={activateJobOn}
                            onChange={handleActivateJobOnChange}
                            disabled={isApiCallInProgress}
                            min={new Date().toISOString().split('T')[0]} // Cannot be before current date
                          />
                          {errors.activateJobOn && (
                            <span className="block mt-1 text-xs text-red-500">{errors.activateJobOn}</span>
                          )}
                          <span className="block mt-1 text-xs text-gray-500">Date cannot be before current date</span>
                        </div>

                        {/* Activation Time Fields */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                              Activation Time (HH) <span className="text-red-500">*</span>
                            </label>
                            <select
                              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.activationTimeHH ? 'border-red-500' : 'border-gray-300'
                              } ${isApiCallInProgress ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}`}
                              value={activationTimeHH}
                              onChange={handleActivationTimeHHChange}
                              disabled={isApiCallInProgress}
                            >
                              <option value="">HH</option>
                              {hours.map((hour) => (
                                <option key={hour} value={hour}>
                                  {hour}
                                </option>
                              ))}
                            </select>
                            {errors.activationTimeHH && (
                              <span className="block mt-1 text-xs text-red-500">{errors.activationTimeHH}</span>
                            )}
                          </div>
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                              Activation Time (MM) <span className="text-red-500">*</span>
                            </label>
                            <select
                              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.activationTimeMM ? 'border-red-500' : 'border-gray-300'
                              } ${isApiCallInProgress ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}`}
                              value={activationTimeMM}
                              onChange={handleActivationTimeMMChange}
                              disabled={isApiCallInProgress}
                            >
                              <option value="">MM</option>
                              {minutes.map((minute) => (
                                <option key={minute} value={minute}>
                                  {minute}
                                </option>
                              ))}
                            </select>
                            {errors.activationTimeMM && (
                              <span className="block mt-1 text-xs text-red-500">{errors.activationTimeMM}</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Enable/Disable Future Scheduling Control */}
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Enable Future Scheduling
                          </label>
                          <select
                            className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              errors.isFutureScheduled ? 'border-red-500' : 'border-gray-300'
                            } ${isApiCallInProgress ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}`}
                            value={isFutureScheduled}
                            onChange={handleIsFutureScheduledChange}
                            disabled={isApiCallInProgress}
                          >
                            {isFutureScheduledOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                          {errors.isFutureScheduled && (
                            <span className="block mt-1 text-xs text-red-500">{errors.isFutureScheduled}</span>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 text-xs text-gray-500">
                        <p>• Time cannot be before current time</p>
                        <p>• Follow 24 hours display scheme in HH:mm</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* API Error Message */}
            {apiCallFailed && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-sm text-red-600">API call failed. You can still continue.</span>
              </div>
            )}

            {/* Form Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
              <Button
                onClick={handleContinue}
                variant="primary"
                disabled={!isContinueEnabled()}
              >
                {isApiCallInProgress ? "Processing..." : "Continue"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDefinitionForm