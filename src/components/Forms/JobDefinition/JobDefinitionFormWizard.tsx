import React, { useState } from "react"

interface JobDefinitionFormWizardProps {
  onContinue: (data: JobDefinitionData) => void
  onBack: () => void
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
  isJobOnRequest: string
}

const JobDefinitionFormWizard: React.FC<JobDefinitionFormWizardProps> = ({ onContinue, onBack }) => {
  // Primary fields - shown initially
  const [jobName, setJobName] = useState("")
  const [region, setRegion] = useState("")
  const [lpar, setLpar] = useState("")
  
  // Secondary fields - shown after validation
  const [uid, setUid] = useState("255") // Default to 255
  const [jclLibrary, setJclLibrary] = useState("NBSP.NBS.JCLLIB") // Default value - Updated to match screenshot
  const [distributionEmailList, setDistributionEmailList] = useState("")
  const [changeRequestNumber, setChangeRequestNumber] = useState("")
  const [crqNumber, setCrqNumber] = useState("")
  const [isFutureScheduled, setIsFutureScheduled] = useState("No")
  const [activateJobOn, setActivateJobOn] = useState("")
  const [activationTimeHH, setActivationTimeHH] = useState("")
  const [activationTimeMM, setActivationTimeMM] = useState("")
  const [conditionCodeCheck, setConditionCodeCheck] = useState(false)
  const [calloutPriority, setCalloutPriority] = useState("")
  const [isJobOnRequest, setIsJobOnRequest] = useState("No")
  
  // UI state
  const [showSecondaryFields, setShowSecondaryFields] = useState(false)
  const [isApiCallInProgress, setIsApiCallInProgress] = useState(false)
  const [apiCallFailed, setApiCallFailed] = useState(false)
  const [errors, setErrors] = useState({
    jobName: "",
    region: "",
    lpar: "",
    uid: "",
    jclLibrary: "",
    changeRequestNumber: "",
    crqNumber: "",
    isFutureScheduled: "",
    activateJobOn: "",
    activationTimeHH: "",
    activationTimeMM: "",
    conditionCodeCheck: "",
    calloutPriority: "",
  })

  // Options - matching the screenshots exactly
  const regions = [
    { value: "AMRS", label: "AMRS", disabled: false },
    { value: "EMEA", label: "EMEA", disabled: true },
  ]
  
  const lpars = [
    { value: "1X", label: "1X", disabled: false },
    { value: "1O", label: "1O", disabled: true },
    { value: "9S", label: "9S", disabled: true },
  ]
  
  const uids = ["255", "300", "400", "500", "600"]
  const jclLibraries = ["NBSP.NBS.JCLLIB", "PROD.NBSP.PROD.JCLLIB", "LIB.JCL.TEST", "LIB.JCL.DEV", "LIB.JCL.UAT"]
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
    
    // If primary fields are completed, check secondary fields
    if (showSecondaryFields) {
      if (!uid || !jclLibrary) return false
      // Distribution Email List is optional - removed from validation
      
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

  // Continue button should be enabled when primary fields are valid
  const isContinueEnabled = (): boolean => {
    // Enable continue when first 3 fields are valid
    const primaryFieldsValid = jobName.trim() !== "" && region.trim() !== "" && lpar.trim() !== "" && 
                               jobNameRegex.test(jobName) && regionRegex.test(region) && lparRegex.test(lpar)
    
    return primaryFieldsValid
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
        
        setShowSecondaryFields(true)
      } catch (error) {
        setApiCallFailed(true)
        console.error("API call failed:", error)
      } finally {
        setIsApiCallInProgress(false)
      }
    }
  }

  const handleNext = () => {
    if (isFormValid()) {
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
        isJobOnRequest,
      }
      onContinue(data)
    }
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

  const handleUidChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUid(e.target.value)
  }

  const handleJclLibraryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setJclLibrary(e.target.value)
  }

  const handleDistributionEmailListChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistributionEmailList(e.target.value)
  }

  const handleCalloutPriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCalloutPriority(e.target.value)
  }

  return (
    <div className="py-8">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-700 mb-6">
          {showSecondaryFields ? "Complete the rest of the information" : "Enter the following information"}
        </h2>

        {/* Primary Fields - Only shown before validation */}
        {!showSecondaryFields && (
          <div className="space-y-6 max-w-md">
          {/* Job Name */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Job Name</label>
            <input
              type="text"
              value={jobName}
              onChange={handleJobNameChange}
              disabled={showSecondaryFields || isApiCallInProgress}
              className={`w-full px-3 py-2.5 text-sm border rounded-md ${
                (showSecondaryFields || isApiCallInProgress) ? 'bg-gray-100 text-gray-700 cursor-not-allowed' : 'bg-white'
              } ${errors.jobName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="CA7$AS"
            />
            {errors.jobName && (
              <span className="text-xs text-red-500 mt-1 block">{errors.jobName}</span>
            )}
          </div>

          {/* Region */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Region</label>
            <div className="relative">
              <select
                value={region}
                onChange={handleRegionChange}
                disabled={showSecondaryFields || isApiCallInProgress}
                className={`w-full px-3 py-2.5 text-sm border rounded-md appearance-none ${
                  (showSecondaryFields || isApiCallInProgress) ? 'bg-gray-100 text-gray-700 cursor-not-allowed' : 'bg-white'
                } ${errors.region ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">--Select Region--</option>
                {regions.map((r) => (
                  <option key={r.value} value={r.value} disabled={r.disabled}>
                    {r.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            {errors.region && (
              <span className="text-xs text-red-500 mt-1 block">{errors.region}</span>
            )}
          </div>

          {/* LPAR */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">LPAR</label>
            <div className="relative">
              <select
                value={lpar}
                onChange={handleLparChange}
                disabled={showSecondaryFields || isApiCallInProgress}
                className={`w-full px-3 py-2.5 text-sm border rounded-md appearance-none ${
                  (showSecondaryFields || isApiCallInProgress) ? 'bg-gray-100 text-gray-700 cursor-not-allowed' : 'bg-white'
                } ${errors.lpar ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">--Select LPAR--</option>
                {lpars.map((l) => (
                  <option key={l.value} value={l.value} disabled={l.disabled}>
                    {l.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            {errors.lpar && (
              <span className="text-xs text-red-500 mt-1 block">{errors.lpar}</span>
            )}
          </div>

          {/* Continue Button - Changed from Validating */}
          <div className="pt-2">
            <button
              onClick={handleContinue}
              disabled={!isContinueEnabled() || isApiCallInProgress}
              className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                !isContinueEnabled()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isApiCallInProgress
                  ? 'bg-blue-400 text-white cursor-wait'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isApiCallInProgress ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Validating
                </span>
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </div>
        )}

        {/* Secondary Fields - Shown after validation */}
        {showSecondaryFields && (
          <div className="mt-8 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
              {/* Column 1 - Read-only fields */}
              <div className="space-y-4">
                {/* Job Name - Read only */}
                <div className="max-w-[220px]">
                  <label className="block text-sm text-gray-600 mb-2">Job Name</label>
                  <div className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                    {jobName}
                  </div>
                </div>

                {/* Region - Read only */}
                <div className="max-w-[220px]">
                  <label className="block text-sm text-gray-600 mb-2">Region</label>
                  <div className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                    {region}
                  </div>
                </div>

                {/* LPAR - Read only */}
                <div className="max-w-[220px]">
                  <label className="block text-sm text-gray-600 mb-2">LPAR</label>
                  <div className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                    {lpar}
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                {/* UID */}
                <div className="max-w-[220px]">
                  <label className="block text-sm text-gray-600 mb-2">UID</label>
                  <div className="relative">
                    <select
                      value={uid}
                      onChange={handleUidChange}
                      disabled={isApiCallInProgress}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {uids.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* JCL Library */}
                <div className="max-w-[220px]">
                  <label className="block text-sm text-gray-600 mb-2">JCL Library</label>
                  <div className="relative">
                    <select
                      value={jclLibrary}
                      onChange={handleJclLibraryChange}
                      disabled={isApiCallInProgress}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {jclLibraries.map((lib) => (
                        <option key={lib} value={lib}>{lib}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Distribution Email List */}
                <div className="max-w-[220px]">
                  <label className="block text-sm text-gray-600 mb-2">Distribution Email List</label>
                  <div className="relative">
                    <select
                      value={distributionEmailList}
                      onChange={handleDistributionEmailListChange}
                      disabled={isApiCallInProgress}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">--Select Email List--</option>
                      {distributionEmailLists.map((email) => (
                        <option key={email} value={email}>{email}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 3 */}
              <div className="space-y-4">
                {/* Change Request Number */}
                <div className="max-w-[220px]">
                  <label className="block text-sm text-gray-600 mb-2">Change Request Number</label>
                  <input
                    type="text"
                    value={changeRequestNumber}
                    onChange={(e) => setChangeRequestNumber(e.target.value)}
                    disabled
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    placeholder=""
                  />
                </div>

                {/* Activate schedule in future */}
                <div className="max-w-[220px]">
                  <label className="block text-sm text-gray-600 mb-2">Activate schedule in future</label>
                  <div className="relative">
                    <select
                      value={isFutureScheduled}
                      onChange={handleIsFutureScheduledChange}
                      disabled={isApiCallInProgress}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {isFutureScheduledOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom row fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 mt-4">
              <div className="md:col-start-2">
                {/* CRQ Number */}
                <div className="max-w-[220px]">
                  <label className="block text-sm text-gray-600 mb-2">CRQ Number</label>
                  <input
                    type="text"
                    value={crqNumber}
                    onChange={(e) => setCrqNumber(e.target.value)}
                    disabled
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    placeholder=""
                  />
                </div>
              </div>

              <div>
                {/* Is the job on request? */}
                <div className="max-w-[220px]">
                  <label className="block text-sm text-gray-600 mb-2">Is the job on request?</label>
                  <div className="relative">
                    <select
                      value={isJobOnRequest}
                      onChange={(e) => setIsJobOnRequest(e.target.value)}
                      disabled={isApiCallInProgress}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conditional Fields for Future Schedule */}
            {isFutureScheduled === "Yes" && (
              <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-md font-medium text-gray-900 mb-4">Future Schedule Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Activate the job on */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Activate the job on (date) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={activateJobOn}
                      onChange={(e) => setActivateJobOn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      disabled={isApiCallInProgress}
                      className={`w-full px-3 py-2.5 text-sm border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.activateJobOn ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.activateJobOn && (
                      <span className="text-xs text-red-500 mt-1 block">{errors.activateJobOn}</span>
                    )}
                    <span className="block mt-1 text-xs text-gray-500">Date cannot be before current date</span>
                  </div>

                  {/* Activation Time */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Time (HH) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={activationTimeHH}
                        onChange={(e) => setActivationTimeHH(e.target.value)}
                        disabled={isApiCallInProgress}
                        className={`w-full px-3 py-2.5 text-sm border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.activationTimeHH ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">HH</option>
                        {hours.map((hour) => (
                          <option key={hour} value={hour}>{hour}</option>
                        ))}
                      </select>
                      {errors.activationTimeHH && (
                        <span className="text-xs text-red-500 mt-1 block">{errors.activationTimeHH}</span>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        (MM) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={activationTimeMM}
                        onChange={(e) => setActivationTimeMM(e.target.value)}
                        disabled={isApiCallInProgress}
                        className={`w-full px-3 py-2.5 text-sm border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.activationTimeMM ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">MM</option>
                        {minutes.map((minute) => (
                          <option key={minute} value={minute}>{minute}</option>
                        ))}
                      </select>
                      {errors.activationTimeMM && (
                        <span className="text-xs text-red-500 mt-1 block">{errors.activationTimeMM}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  <p>• Time cannot be before current time</p>
                  <p>• Follow 24 hours display scheme in HH:mm</p>
                </div>
              </div>
            )}

            {/* EMEA Region Specific Fields */}
            {isEmeaRegion && (
              <div className="mt-6 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="text-md font-medium text-gray-900 mb-4">EMEA Region Specific Fields</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Condition Code Check */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Condition Code Check
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={conditionCodeCheck}
                        onChange={(e) => setConditionCodeCheck(e.target.checked)}
                        disabled={true}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-not-allowed opacity-60"
                      />
                      <span className="text-sm text-gray-500">Enabled (Only removal can be done)</span>
                      <label className="flex items-center space-x-2 cursor-pointer ml-4">
                        <input type="checkbox" className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-600">Remove</span>
                      </label>
                    </div>
                  </div>

                  {/* Callout Priority */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Callout Priority <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={calloutPriority}
                      onChange={handleCalloutPriorityChange}
                      disabled={isApiCallInProgress}
                      className={`w-full px-3 py-2.5 text-sm border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.calloutPriority ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">SELECT ONE (Range 1 to 5)</option>
                      {calloutPriorities.map((priority) => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                    {errors.calloutPriority && (
                      <span className="text-xs text-red-500 mt-1 block">{errors.calloutPriority}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* API Error Message */}
            {apiCallFailed && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-sm text-red-600">API call failed. You can still continue.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="px-6 py-2.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-all duration-200"
        >
          Back
        </button>
        {showSecondaryFields && (
          <button
            onClick={handleNext}
            disabled={!isFormValid()}
            className={`px-6 py-2.5 text-sm font-medium text-white rounded-md transition-all duration-200 ${
              isFormValid() 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}

export default JobDefinitionFormWizard
