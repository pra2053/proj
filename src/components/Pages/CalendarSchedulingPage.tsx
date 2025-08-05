import React, { useState } from "react"
import CalendarSchedulingModal from "../Forms/CalendarScheduling/CalendarSchedulingModal"

interface ScheduleData {
  frequency: string
  submitTimeHour: string
  submitTimeMinute: string
  holidayAction: string
  hasIntervals: boolean
  runDays?: string[]
  runMonths?: string[]
  runOccurrences?: string[]
  holidays?: string[]
  repeatStartHour?: string
  repeatStartMinute?: string
  repeatEndHour?: string
  repeatEndMinute?: string
  repeatType?: string
  repeatIntervalHour?: string
  repeatIntervalMinute?: string
}

const CalendarSchedulingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true) // Open modal by default when page loads
  const [schedules, setSchedules] = useState<ScheduleData[]>([])

  const handleAddSchedule = (data: ScheduleData) => {
    setSchedules([...schedules, data])
    console.log("Added calendar schedule:", data)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

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
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Calendar Scheduling Form
            </h2>
            <p className="text-gray-600">
              Manage calendar-based job scheduling
            </p>
          </div>
          <button
            onClick={handleOpenModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add Schedule
          </button>
        </div>

        {/* Display existing schedules */}
        {schedules.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Calendar Schedules</h3>
            <div className="space-y-4">
              {schedules.map((schedule, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Basic Schedule Info */}
                    <div>
                      <span className="text-sm font-medium text-gray-700">Frequency:</span>
                      <p className="text-sm text-gray-900">{schedule.frequency}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Submit Time:</span>
                      <p className="text-sm text-gray-900">
                        {formatTime(schedule.submitTimeHour, schedule.submitTimeMinute)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Holiday Action:</span>
                      <p className="text-sm text-gray-900">{getHolidayActionLabel(schedule.holidayAction)}</p>
                    </div>

                    {/* Conditional Fields */}
                    {schedule.runDays && schedule.runDays.length > 0 && (
                      <div className="md:col-span-2 lg:col-span-3">
                        <span className="text-sm font-medium text-gray-700">Run Days:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {schedule.runDays.map((day, dayIndex) => (
                            <span key={dayIndex} className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {schedule.runMonths && schedule.runMonths.length > 0 && (
                      <div className="md:col-span-2 lg:col-span-3">
                        <span className="text-sm font-medium text-gray-700">Run Months:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {schedule.runMonths.map((month, monthIndex) => (
                            <span key={monthIndex} className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                              {month}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {schedule.runOccurrences && schedule.runOccurrences.length > 0 && (
                      <div className="md:col-span-2 lg:col-span-3">
                        <span className="text-sm font-medium text-gray-700">Run Occurrences:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {schedule.runOccurrences.map((occurrence, occurrenceIndex) => (
                            <span key={occurrenceIndex} className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                              {occurrence}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {schedule.holidays && schedule.holidays.length > 0 && (
                      <div className="md:col-span-2 lg:col-span-3">
                        <span className="text-sm font-medium text-gray-700">Holidays:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {schedule.holidays.map((holiday, holidayIndex) => (
                            <span key={holidayIndex} className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                              {holiday}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {schedule.hasIntervals && (
                      <div className="md:col-span-2 lg:col-span-3 mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Interval Settings</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                          <div>
                            <span className="text-xs text-gray-600">Repeat Start:</span>
                            <p className="text-sm text-gray-900">
                              {formatTime(schedule.repeatStartHour || "00", schedule.repeatStartMinute || "00")}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-600">Repeat End:</span>
                            <p className="text-sm text-gray-900">
                              {formatTime(schedule.repeatEndHour || "00", schedule.repeatEndMinute || "00")}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-600">Repeat Type:</span>
                            <p className="text-sm text-gray-900">{schedule.repeatType || "N/A"}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-600">Repeat Interval:</span>
                            <p className="text-sm text-gray-900">
                              {formatTime(schedule.repeatIntervalHour || "00", schedule.repeatIntervalMinute || "00")}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {schedules.length === 0 && !isModalOpen && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Calendar Schedules</h3>
            <p className="text-gray-600 mb-4">You haven't added any calendar schedules yet.</p>
            <button
              onClick={handleOpenModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add Your First Schedule
            </button>
          </div>
        )}
      </div>

      {/* Calendar Scheduling Modal */}
      <CalendarSchedulingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddSchedule}
      />
    </div>
  )
}

export default CalendarSchedulingPage