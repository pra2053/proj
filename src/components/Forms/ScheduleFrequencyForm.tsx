import { useState } from "react"
import { Button, BackButton } from "../UI"
import AddFileModal from "./AddFileModal"
import DatasetTriggerModal from "./DatasetTrigger/DatasetTriggerModal"

interface ScheduleFrequencyFormProps {
  onContinue: () => void;
  onBack: () => void;
}

interface FileData {
  datasetName: string;
  sourceJobName?: string;
  isNdmTransmission?: boolean;
  ndmSourceNode?: string;
}

const ScheduleFrequencyForm: React.FC<ScheduleFrequencyFormProps> = ({ onContinue, onBack }) => {
  const [isJobOnRequest, setIsJobOnRequest] = useState("")
  const [hasSelected, setHasSelected] = useState(false)
  const [scheduleType, setScheduleType] = useState("daily")
  const [startTime, setStartTime] = useState("09:00")
  const [frequency, setFrequency] = useState("daily")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDatasetTriggerModalOpen, setIsDatasetTriggerModalOpen] = useState(false)
  const [addedFiles, setAddedFiles] = useState<FileData[]>([])

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setIsJobOnRequest(value)
    setHasSelected(true)

    // Reset form fields when switching
    if (value === "No") {
      setScheduleType("daily")
      setStartTime("09:00")
      setFrequency("daily")
    }
  }

  const handleReset = () => {
    setIsJobOnRequest("")
    setHasSelected(false)
    setScheduleType("daily")
    setStartTime("09:00")
    setFrequency("daily")
    setAddedFiles([])
  }

  const handleContinue = () => {
    onContinue()
  }

  const handleDatasetTriggerClick = () => {
    setIsDatasetTriggerModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleDatasetTriggerModalClose = () => {
    setIsDatasetTriggerModalOpen(false)
  }

  const handleAddFile = (fileData: FileData) => {
    setAddedFiles([...addedFiles, fileData])
  }

  const handleAddDatasetTrigger = (triggerData: FileData) => {
    setAddedFiles([...addedFiles, triggerData])
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Warning Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex items-start">
          <span className="text-yellow-600 mr-2">⚠️</span>
          <div className="text-sm">
            <strong className="text-yellow-800">WARNING</strong>
            <div className="text-yellow-700">VRM section is disabled for non-executable jobs</div>
          </div>
        </div>
      </div>

      <div className="flex gap-5 max-w-7xl mx-auto mt-5 bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Left Sidebar Navigation */}
        <div className="w-64 bg-gray-50 p-5 border-r border-gray-200">
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-md bg-green-50 text-green-700">
              <span className="text-xl">✅</span>
              <span className="text-sm font-medium">General Information</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-md bg-blue-50 text-blue-700 font-medium">
              <span className="text-xl">📅</span>
              <span className="text-sm">Frequency Information</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-md text-gray-600 cursor-pointer hover:bg-gray-100">
              <span className="text-xl">📋</span>
              <span className="text-sm">Review & Submit</span>
            </div>
          </div>
        </div>

        {/* Main Form Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl">
            {/* Main Question */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">Is the job on request?</label>
              <div className="flex gap-3">
                <select 
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  value={isJobOnRequest} 
                  onChange={handleDropdownChange}
                >
                  <option value="">--Select Option--</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {hasSelected && (
                  <Button onClick={handleReset} variant="danger" className="text-sm">
                    Reset
                  </Button>
                )}
              </div>
            </div>

            {/* Add Frequency Section - Only show when selection is made */}
            {hasSelected && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Frequency</h3>

                {/* Show 2 buttons for "Yes" */}
                {isJobOnRequest === "Yes" && (
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-md cursor-not-allowed" disabled>
                      <span className="text-lg">📋</span>
                      Add a Resource
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-md cursor-not-allowed" disabled>
                      <span className="text-lg">⏮️</span>
                      Add a Predecessor
                    </button>
                  </div>
                )}

                {/* Show 3 buttons for "No" */}
                {isJobOnRequest === "No" && (
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-md cursor-not-allowed" disabled>
                      <span className="text-lg">📅</span>
                      Add Schedule
                    </button>
                    <button 
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" 
                      onClick={handleDatasetTriggerClick}
                    >
                      <span className="text-lg">📊</span>
                      Add Dataset Trigger
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-md cursor-not-allowed" disabled>
                      <span className="text-lg">⚡</span>
                      Add Job Trigger
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Frequencies Section - Only show when selection is made */}
            {hasSelected && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequencies</h3>
                <div className="border border-gray-200 rounded-md p-4">
                  {addedFiles.length > 0 ? (
                    <div className="space-y-3">
                      {addedFiles.map((file, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-md text-sm">
                          <div className="font-medium text-gray-700">
                            <span className="font-semibold">Dataset:</span> {file.datasetName}
                          </div>
                          <div className="text-gray-600 mt-1">
                            <span className="font-semibold">Source:</span> {file.sourceJobName || 'N/A'}
                          </div>
                          {file.isNdmTransmission && file.ndmSourceNode && (
                            <div className="text-gray-600 mt-1">
                              <span className="font-semibold">NDM Node:</span> {file.ndmSourceNode}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Job does not have any frequency attached</p>
                  )}
                </div>
              </div>
            )}

            {/* Conditional Content for Yes/No */}
            {isJobOnRequest === "Yes" && (
              <div className="mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                  <span className="text-blue-600 text-xl">ℹ️</span>
                  <div>
                    <p className="font-semibold text-blue-900">On-Request Job</p>
                    <p className="text-sm text-blue-800 mt-1">This job will be executed manually when requested. No automatic scheduling is required.</p>
                  </div>
                </div>
              </div>
            )}

            {isJobOnRequest === "No" && (
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Schedule Type: <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={scheduleType}
                    onChange={(e) => setScheduleType(e.target.value)}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Start Time: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Frequency:</label>
                  <select 
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    value={frequency} 
                    onChange={(e) => setFrequency(e.target.value)}
                  >
                    <option value="daily">Every Day</option>
                    <option value="weekdays">Weekdays Only</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
            )}

            {/* Form Actions at Bottom */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
              <BackButton onClick={onBack}>Back to Job Definition</BackButton>
              {hasSelected && (
                <Button onClick={handleContinue} variant="primary">
                  Continue to Review
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add File Modal */}
      <AddFileModal isOpen={isModalOpen} onClose={handleModalClose} onAdd={handleAddFile} />

      {/* Dataset Trigger Modal */}
      <DatasetTriggerModal isOpen={isDatasetTriggerModalOpen} onClose={handleDatasetTriggerModalClose} onAdd={handleAddDatasetTrigger} />
    </div>
  )
}

export default ScheduleFrequencyForm
