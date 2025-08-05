import React from "react"
import { Edit2 } from "lucide-react"
import { WizardData } from "./JobSchedulingWizard"

interface ReviewStepProps {
  wizardData: WizardData
  onContinue: () => void
  onBack: () => void
  onEdit: (step: number) => void
}

const ReviewStep: React.FC<ReviewStepProps> = ({ 
  wizardData, 
  onContinue, 
  onBack, 
  onEdit 
}) => {
  const { jobDefinition, frequencies } = wizardData

  const formatTime = (hour: string, minute: string) => {
    return `${hour}:${minute}`
  }

  const getHolidayActionLabel = (action: string) => {
    switch (action) {
      case "run-on-holiday":
        return "Run on holiday"
      case "do-not-run-before-holiday":
        return "Do not run on day before holiday"
      case "do-not-run-after-holiday":
        return "Do not run on day after holiday"
      default:
        return action
    }
  }

  return (
    <div className="py-8">
      <div className="bg-white">
        <div className="p-6">
          {/* Request Details Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">REQUEST DETAILS</h3>
              <button
                onClick={() => onEdit(2)}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="border-t border-gray-200"></div>
          </div>

          {/* Job Information Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">JOB INFORMATION</h3>
              <button
                onClick={() => onEdit(2)}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Job Name</span>
                  <p className="text-sm font-medium text-gray-900">{jobDefinition?.jobName || "NA"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">LPAR</span>
                  <p className="text-sm font-medium text-gray-900">{jobDefinition?.lpar || "NA"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">UID</span>
                  <p className="text-sm font-medium text-gray-900">{jobDefinition?.uid || "NA"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">JCL Library</span>
                  <p className="text-sm font-medium text-gray-900">{jobDefinition?.jclLibrary || "NA"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Region</span>
                  <p className="text-sm font-medium text-gray-900">{jobDefinition?.region || "NA"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Distribution Email</span>
                  <p className="text-sm font-medium text-gray-900">{jobDefinition?.distributionEmailList || "NA"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Future Scheduled</span>
                  <p className="text-sm font-medium text-gray-900">{jobDefinition?.isFutureScheduled || "No"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Job on Request</span>
                  <p className="text-sm font-medium text-gray-900">{jobDefinition?.isJobOnRequest || "No"}</p>
                </div>
                {jobDefinition?.isFutureScheduled === "Yes" && (
                  <>
                    <div>
                      <span className="text-sm text-gray-600">Activation Date</span>
                      <p className="text-sm font-medium text-gray-900">{jobDefinition?.activateJobOn || "NA"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Activation Time</span>
                      <p className="text-sm font-medium text-gray-900">
                        {formatTime(jobDefinition?.activationTimeHH || "00", jobDefinition?.activationTimeMM || "00")}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Frequencies Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">FREQUENCIES</h3>
              <button
                onClick={() => onEdit(3)}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            </div>
            
            {frequencies.schedules.length === 0 && frequencies.datasetTriggers.length === 0 ? (
              <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                No frequencies configured
              </div>
            ) : (
              <div className="space-y-4">
                {/* Calendar Schedules */}
                {frequencies.schedules.map((schedule, index) => (
                  <div key={`schedule-${index}`} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Calendar Schedule {index + 1}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Frequency:</span>
                        <span className="ml-2 text-gray-900">{schedule.frequency}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Submit Time:</span>
                        <span className="ml-2 text-gray-900">
                          {formatTime(schedule.submitTimeHour, schedule.submitTimeMinute)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Holiday Action:</span>
                        <span className="ml-2 text-gray-900">{getHolidayActionLabel(schedule.holidayAction)}</span>
                      </div>
                      {schedule.hasIntervals && (
                        <>
                          <div>
                            <span className="text-gray-600">Repeat Start:</span>
                            <span className="ml-2 text-gray-900">
                              {formatTime(schedule.repeatStartHour || "00", schedule.repeatStartMinute || "00")}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Repeat End:</span>
                            <span className="ml-2 text-gray-900">
                              {formatTime(schedule.repeatEndHour || "00", schedule.repeatEndMinute || "00")}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Repeat Type:</span>
                            <span className="ml-2 text-gray-900">{schedule.repeatType || "N/A"}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {/* Dataset Triggers */}
                {frequencies.datasetTriggers.map((trigger, index) => (
                  <div key={`dataset-${index}`} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Dataset Trigger {index + 1}</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Dataset Name:</span>
                        <span className="ml-2 text-gray-900">{trigger.datasetName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Source Job:</span>
                        <span className="ml-2 text-gray-900">{trigger.sourceJobName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">NDM Transmission:</span>
                        <span className="ml-2 text-gray-900">{trigger.isNdmTransmission ? "Yes" : "No"}</span>
                      </div>
                      {trigger.ndmSourceNode && (
                        <div>
                          <span className="text-gray-600">NDM Source Node:</span>
                          <span className="ml-2 text-gray-900">{trigger.ndmSourceNode}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trigger Jobs Section (placeholder) */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Trigger Jobs</h3>
            <div className="bg-gray-50 p-4 rounded-lg text-gray-500 text-sm">
              NA
            </div>
          </div>

          {/* Requirement Jobs Section (placeholder) */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Requirement Jobs</h3>
            <div className="bg-gray-50 p-4 rounded-lg text-gray-500 text-sm">
              NA
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onBack}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-all duration-200"
            >
              Back
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => alert("Add to Batch functionality coming soon")}
                className="px-6 py-2.5 text-sm font-medium text-blue-500 bg-white border border-blue-500 hover:bg-blue-50 rounded-md transition-all duration-200"
              >
                Add to Batch
              </button>
              <button
                onClick={onContinue}
                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-all duration-200"
              >
                Submit Batch
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewStep
