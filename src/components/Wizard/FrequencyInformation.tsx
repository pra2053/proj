import React, { useState } from "react"
import CalendarSchedulingModal from "../Forms/CalendarScheduling/CalendarSchedulingModal"
import DatasetTriggerModal from "../Forms/DatasetTrigger/DatasetTriggerModal"
import { Info, Calendar, Database, Briefcase, Trash2, Edit2, FileText } from "lucide-react"

interface FrequencyInformationProps {
  frequencies: {
    schedules: any[]
    datasetTriggers: any[]
    jobTriggers: any[]
  }
  jobName?: string
  onContinue: (frequencies: any) => void
  onBack: () => void
}

const FrequencyInformation: React.FC<FrequencyInformationProps> = ({
  frequencies: initialFrequencies,
  jobName,
  onContinue,
  onBack
}) => {
  const [frequencies, setFrequencies] = useState(initialFrequencies)
  const [activeModal, setActiveModal] = useState<'schedule' | 'dataset' | 'job' | null>(null)

  const handleAddSchedule = (data: any) => {
    setFrequencies(prev => ({
      ...prev,
      schedules: [...prev.schedules, data]
    }))
    setActiveModal(null)
  }

  const handleAddDatasetTrigger = (data: any) => {
    setFrequencies(prev => ({
      ...prev,
      datasetTriggers: [...prev.datasetTriggers, data]
    }))
    setActiveModal(null)
  }

  const handleAddJobTrigger = () => {
    // Job trigger implementation will be added later
    alert("Job Trigger functionality will be implemented in the next phase")
  }

  const handleDeleteSchedule = (index: number) => {
    setFrequencies(prev => ({
      ...prev,
      schedules: prev.schedules.filter((_, i) => i !== index)
    }))
  }

  const handleDeleteDatasetTrigger = (index: number) => {
    setFrequencies(prev => ({
      ...prev,
      datasetTriggers: prev.datasetTriggers.filter((_, i) => i !== index)
    }))
  }

  const handleContinue = () => {
    onContinue(frequencies)
  }

  const formatScheduleDescription = (schedule: any) => {
    const days = schedule.expectedDays?.join(', ') || ''
    const time = `${schedule.submitTimeHour}:${schedule.submitTimeMinute}`
    const freq = schedule.frequency === 'Weekly' ? `Weekly at ${time} hrs (Local LPAR Time) thru ${days}` : 
                  schedule.frequency === 'Daily' ? `Daily at ${time} hrs (Local LPAR Time)` :
                  `${schedule.frequency} at ${time} hrs`
    
    const holidayAction = schedule.holidayAction === 'doNotRun' ? 'Job does not run on the day after holiday' :
                         schedule.holidayAction === 'onHoliday' ? 'Job runs on holiday' :
                         'Job runs on the day after holiday'
    
    return { freq, holidayAction }
  }

  const hasAnyFrequency = () => {
    return frequencies.schedules.length > 0 || 
           frequencies.datasetTriggers.length > 0 || 
           frequencies.jobTriggers.length > 0
  }

  return (
    <div className="py-8">
      <div className="space-y-6">
        {/* Add Frequency Section */}
        <div className="border border-gray-200 rounded-md p-6">
          <h3 className="text-base font-medium text-gray-700 mb-4">Add Frequency</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Add Schedule Button */}
            <div className="relative">
              <button
                onClick={() => setActiveModal('schedule')}
                className="w-full flex items-center justify-center p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium"
              >
                Add Schedule
              </button>
              <div className="absolute -top-2 -right-2">
                <div className="relative group">
                  <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center cursor-help">
                    <span className="text-white text-xs font-medium">?</span>
                  </div>
                  <div className="absolute bottom-full mb-2 right-0 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                    Maximum 10 schedules can be added<br/>
                    Schedule is added to a Job as it's execution is time dependent
                  </div>
                </div>
              </div>
            </div>

            {/* Add Dataset Trigger Button */}
            <div className="relative">
              <button
                onClick={() => setActiveModal('dataset')}
                className="w-full flex items-center justify-center p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium"
              >
                Add Dataset Trigger
              </button>
              <div className="absolute -top-2 -right-2">
                <div className="relative group">
                  <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center cursor-help">
                    <span className="text-white text-xs font-medium">?</span>
                  </div>
                  <div className="absolute bottom-full mb-2 right-0 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                    Maximum 5 Dataset Triggers can be added<br/><br/>
                    VDSN name for Executable job trigger:<br/>
                    Virtual data set to this job with the compliant name: CA7TRIG.xxxP.(jobname) Process name NDMED<br/><br/>
                    • CA7TRIG is the constant<br/>
                    • xxxP denotes that the profile for this can be created and users added/deleted by the owner of the AIT owner.(Assuming CPE is application prefix)<br/>
                    • (jobname) is the job name initiated by this VDSN with xxxP being CPEP, the job name here can only be CPE, @CPE, #CPE, $CPE or C$CPE<br/>
                    • Process name is the process name that is executing the U7SVC program to "create" this virtual data set at the receiving site<br/>
                    • NDMED - this denotes the NDM task that sent it (not receiving it) and required only NDM process is involved for the post.
                  </div>
                </div>
              </div>
            </div>

            {/* Add Job Trigger Button */}
            <div className="relative">
              <button
                onClick={handleAddJobTrigger}
                className="w-full flex items-center justify-center p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium"
              >
                Add Job Trigger
              </button>
              <div className="absolute -top-2 -right-2">
                <div className="relative group">
                  <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center cursor-help">
                    <span className="text-white text-xs font-medium">?</span>
                  </div>
                  <div className="absolute bottom-full mb-2 right-0 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                    Add job-based trigger for the job
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Frequencies Section */}
        <div className="border border-gray-200 rounded-md p-6">
          <h3 className="text-base font-medium text-gray-700 mb-4">Frequencies</h3>
          
          {!hasAnyFrequency() ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm">Job does not have any frequency attached</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 rounded text-xs font-medium text-gray-600">
                <div className="col-span-6">Frequency</div>
                <div className="col-span-6 text-right">Action</div>
              </div>

              {/* Calendar Schedules */}
              {frequencies.schedules.map((schedule, index) => {
                const { freq, holidayAction } = formatScheduleDescription(schedule)
                return (
                  <div key={`schedule-${index}`} className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-100 items-center">
                    <div className="col-span-6">
                      <p className="text-sm text-gray-900">{freq}</p>
                      <p className="text-xs text-gray-500 mt-1">({holidayAction})</p>
                    </div>
                    <div className="col-span-6 flex items-center justify-end gap-3">
                      <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        PRED
                        <span className="bg-gray-600 text-white px-1 rounded text-xs">0</span>
                      </button>
                      <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        VRM
                        <span className="bg-gray-600 text-white px-1 rounded text-xs">0</span>
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <span className="text-xs bg-gray-600 text-white px-1.5 py-0.5 rounded">Profile: 0</span>
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(index)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}

              {/* Dataset Triggers */}
              {frequencies.datasetTriggers.map((trigger, index) => (
                <div key={`dataset-${index}`} className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-100 items-center">
                  <div className="col-span-6">
                    <p className="text-sm text-gray-900">Dataset Trigger: {trigger.datasetName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {trigger.isNdmTransmission ? `NDM Node: ${trigger.ndmSourceNode}` : `Source Job: ${trigger.sourceJobName}`}
                    </p>
                  </div>
                  <div className="col-span-6 flex items-center justify-end gap-3">
                    <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      PRED
                      <span className="bg-gray-600 text-white px-1 rounded text-xs">0</span>
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDatasetTrigger(index)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <button
            onClick={onBack}
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all duration-200"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all duration-200"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      <CalendarSchedulingModal
        isOpen={activeModal === 'schedule'}
        onClose={() => setActiveModal(null)}
        onAdd={handleAddSchedule}
      />

      <DatasetTriggerModal
        isOpen={activeModal === 'dataset'}
        onClose={() => setActiveModal(null)}
        onAdd={handleAddDatasetTrigger}
      />
    </div>
  )
}

export default FrequencyInformation
