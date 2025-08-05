import React, { useState, useEffect } from "react"
import Modal from "../../UI/Modal"
import { Button } from "../../UI"
import { CheckCircle } from "lucide-react"

interface CalendarSchedulingModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (data: ScheduleData) => void
}

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

interface ValidationError {
  field: string
  message: string
}

const CalendarSchedulingModal: React.FC<CalendarSchedulingModalProps> = ({ isOpen, onClose, onAdd }) => {
  // Add success state
  const [showSuccess, setShowSuccess] = useState(false)
  // Main form state
  const [frequency, setFrequency] = useState("Daily")
  const [submitTimeHour, setSubmitTimeHour] = useState("00")
  const [submitTimeMinute, setSubmitTimeMinute] = useState("00")
  const [holidayAction, setHolidayAction] = useState("run-on-holiday")
  const [holidaySubAction, setHolidaySubAction] = useState("") // for before/after holiday selection
  const [hasIntervals, setHasIntervals] = useState(false)
  
  // Conditional form state
  const [runDays, setRunDays] = useState<string[]>([])
  const [runMonths, setRunMonths] = useState<string[]>([])
  const [runOccurrences, setRunOccurrences] = useState<string[]>([])
  const [holidays, setHolidays] = useState<string[]>([])
  
  // Repeat/Interval state
  const [repeatStartHour, setRepeatStartHour] = useState("04")
  const [repeatStartMinute, setRepeatStartMinute] = useState("07")
  const [repeatEndHour, setRepeatEndHour] = useState("08")
  const [repeatEndMinute, setRepeatEndMinute] = useState("13")
  const [repeatType, setRepeatType] = useState("")
  const [repeatIntervalHour, setRepeatIntervalHour] = useState("00")
  const [repeatIntervalMinute, setRepeatIntervalMinute] = useState("15")
  
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])

  // Options
  const frequencyOptions = [
    "Daily", "Weekly", "Monthly", "Annually", 
    "Run Only on holiday", "Run Only on day before holiday", "Run Only on day after holiday"
  ]
  
  const weekDayOptions = [
    "Mon - Fri", "Tue - Sat", "Mon - Sat", "Sat & Sun",
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ]
  
  const monthOptions = [
    "All months", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  
  const occurrenceOptions = ["First", "Last", "2nd", "3rd", "4th", "5th", "6th", "7th"]
  
  const holidayOptions = [
    "Federal Reserve Holidays",
    "IMSL Non Branch Working day (NBW)",
    "IMSE Non Branch Working day (NBW)", 
    "IMSF Non Branch Working day (NBW)"
  ]
  
  const repeatTypeOptions = [
    { value: "C", label: "Clock" },
    { value: "S", label: "Start" }, 
    { value: "E", label: "End" }
  ]

  // Generate hour options (00-23)
  const hourOptions = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0')
  )
  
  // Generate minute options (00-59) 
  const minuteOptions = Array.from({ length: 60 }, (_, i) => 
    i.toString().padStart(2, '0')
  )

  // Reset form when frequency changes
  useEffect(() => {
    setRunDays([])
    setRunMonths([])
    setRunOccurrences([])
    setHolidays([])
    setValidationErrors([])
    setHolidaySubAction("") // Reset holiday sub-action
    
    // Set default values based on frequency
    if (frequency === "Daily") {
      // Daily shows "Sunday to Saturday" as static display
      setRunDays(["Sunday to Saturday"])
    } else if (frequency === "Weekly") {
      // Weekly starts with empty selection
      setRunDays([])
    } else if (frequency === "Monthly") {
      // Monthly starts with "All months" selected
      setRunMonths(["All months"])
      setRunDays([])
      setRunOccurrences([])
    } else if (frequency === "Annually") {
      // Annually starts with empty day selection
      setRunDays([])
    } else if (frequency.includes("holiday")) {
      // Holiday-based frequencies start with empty holiday selection
      setHolidays([])
    }
  }, [frequency])

  // Sync repeat start time with submit time
  useEffect(() => {
    if (hasIntervals) {
      setRepeatStartHour(submitTimeHour)
      setRepeatStartMinute(submitTimeMinute)
    }
  }, [submitTimeHour, submitTimeMinute, hasIntervals])

  // Validation
  const validateForm = (): ValidationError[] => {
    const errors: ValidationError[] = []
    
    // Submit time validation
    if (!submitTimeHour || !submitTimeMinute) {
      errors.push({ field: 'submitTime', message: 'Submit time is required' })
    }
    
    // Holiday action validation
    if (!holidayAction) {
      errors.push({ field: 'holidayAction', message: 'Please select holiday action' })
    }
    
    // If "Do not run the job" is selected, user must choose before or after holiday
    if (holidayAction === "do-not-run" && !holidaySubAction) {
      errors.push({ field: 'holidaySubAction', message: 'Please select when not to run the job (before or after holiday)' })
    }
    
    // Frequency-specific validation
    if (frequency === "Weekly" && runDays.length === 0) {
      errors.push({ field: 'runDays', message: 'Please select run days for weekly frequency' })
    }
    
    if (frequency === "Monthly") {
      if (runMonths.length === 0) {
        errors.push({ field: 'runMonths', message: 'Please select months' })
      }
    }
    
    if (frequency.includes("holiday") && holidays.length === 0) {
      errors.push({ field: 'holidays', message: 'Please select holidays' })
    }
    
    // Interval validation
    if (hasIntervals) {
      if (!repeatStartHour || !repeatStartMinute) {
        errors.push({ field: 'repeatStart', message: 'Repeat start time is required' })
      }
      
      if (!repeatEndHour || !repeatEndMinute) {
        errors.push({ field: 'repeatEnd', message: 'Repeat end time is required' })
      }
      
      if (!repeatType) {
        errors.push({ field: 'repeatType', message: 'Repeat type is required' })
      }
      
      // Time validation
      const startTime = parseInt(repeatStartHour) * 60 + parseInt(repeatStartMinute)
      const endTime = parseInt(repeatEndHour) * 60 + parseInt(repeatEndMinute)
      const intervalTime = parseInt(repeatIntervalHour) * 60 + parseInt(repeatIntervalMinute)
      
      if (endTime <= startTime) {
        errors.push({ field: 'repeatEnd', message: 'End time must be greater than start time' })
      }
      
      if (endTime >= 1439) { // 23:59 in minutes
        errors.push({ field: 'repeatEnd', message: 'End time must be less than 23:59' })
      }
      
      if (intervalTime < 15) {
        errors.push({ field: 'repeatInterval', message: 'Repeat interval must be at least 15 minutes' })
      }
      
      if (intervalTime >= (endTime - startTime)) {
        errors.push({ field: 'repeatInterval', message: 'Repeat interval must be less than time difference' })
      }
    }
    
    return errors
  }

  const resetForm = () => {
    setFrequency("Daily")
    setSubmitTimeHour("00")
    setSubmitTimeMinute("00")
    setHolidayAction("run-on-holiday")
    setHolidaySubAction("")
    setHasIntervals(false)
    setRunDays([])
    setRunMonths([])
    setRunOccurrences([])
    setHolidays([])
    setRepeatStartHour("04")
    setRepeatStartMinute("07")
    setRepeatEndHour("08")
    setRepeatEndMinute("13")
    setRepeatType("")
    setRepeatIntervalHour("00")
    setRepeatIntervalMinute("15")
    setValidationErrors([])
  }

  const handleAdd = () => {
    const errors = validateForm()
    
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    const data: ScheduleData = {
      frequency,
      submitTimeHour,
      submitTimeMinute,
      holidayAction: holidayAction === "do-not-run" ? `${holidayAction}-${holidaySubAction}` : holidayAction,
      hasIntervals,
      runDays: runDays.length > 0 ? runDays : undefined,
      runMonths: runMonths.length > 0 ? runMonths : undefined,
      runOccurrences: runOccurrences.length > 0 ? runOccurrences : undefined,
      holidays: holidays.length > 0 ? holidays : undefined,
      repeatStartHour: hasIntervals ? repeatStartHour : undefined,
      repeatStartMinute: hasIntervals ? repeatStartMinute : undefined,
      repeatEndHour: hasIntervals ? repeatEndHour : undefined,
      repeatEndMinute: hasIntervals ? repeatEndMinute : undefined,
      repeatType: hasIntervals ? repeatType : undefined,
      repeatIntervalHour: hasIntervals ? repeatIntervalHour : undefined,
      repeatIntervalMinute: hasIntervals ? repeatIntervalMinute : undefined,
    }
    
    // Show success state
    setShowSuccess(true)
    setValidationErrors([])
    
    // Add the data after a brief delay
    setTimeout(() => {
      onAdd(data)
      resetForm()
      setShowSuccess(false)
    }, 100)
  }

  const handleClose = () => {
    setValidationErrors([])
    setHolidaySubAction("") // Reset sub-action
    setShowSuccess(false)
    onClose()
  }

  const handleAddMore = () => {
    resetForm()
    setShowSuccess(false)
  }

  const getFieldError = (field: string): string | undefined => {
    return validationErrors.find(error => error.field === field)?.message
  }

  const hasFieldError = (field: string): boolean => {
    return validationErrors.some(error => error.field === field)
  }

  const handleRunDayChange = (day: string, checked: boolean) => {
    if (checked) {
      setRunDays([...runDays, day])
    } else {
      setRunDays(runDays.filter(d => d !== day))
    }
  }

  const handleRunMonthChange = (month: string, checked: boolean) => {
    if (checked) {
      setRunMonths([...runMonths, month])
    } else {
      setRunMonths(runMonths.filter(m => m !== month))
    }
  }

  const handleRunOccurrenceChange = (occurrence: string, checked: boolean) => {
    if (checked) {
      setRunOccurrences([...runOccurrences, occurrence])
    } else {
      setRunOccurrences(runOccurrences.filter(o => o !== occurrence))
    }
  }

  const handleHolidayChange = (holiday: string, checked: boolean) => {
    if (checked) {
      setHolidays([...holidays, holiday])
    } else {
      setHolidays(holidays.filter(h => h !== holiday))
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add schedule" className="w-[800px] max-w-[90vw]">
      <div className="p-6">
        {showSuccess ? (
          // Success state UI
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Record Added Successfully
            </h3>
            <div className="flex justify-center gap-3 mt-6">
              <Button onClick={handleAddMore} variant="outline" className="min-w-[100px]">
                Add More
              </Button>
              <Button onClick={handleClose} variant="outline" className="min-w-[100px]">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <>
        {/* Job Run Schedule */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-medium text-gray-700">Job Run Schedule</label>
            <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 text-xs cursor-help"
                 title="Select the frequency for job execution">
              ?
            </div>
          </div>
          <div className="mb-2">
            <span className="text-xs text-gray-500">Select Frequency</span>
          </div>
          <select
            className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasFieldError('frequency') ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            {frequencyOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {getFieldError('frequency') && (
            <span className="text-xs text-red-500 mt-1 block">{getFieldError('frequency')}</span>
          )}
        </div>

        {/* Schedule Submit Time */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-medium text-gray-700">Schedule Submit time (LPAR)</label>
            <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 text-xs cursor-help"
                 title="The job is not submitted to CA7 before this time. If the submit time is before deadline start time, the submit time requirement is automatically satisfied when the job enters the queue.">
              ?
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <span className="text-xs text-gray-500 block mb-1">HH</span>
              <select
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  hasFieldError('submitTime') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                value={submitTimeHour}
                onChange={(e) => setSubmitTimeHour(e.target.value)}
              >
                {hourOptions.map((hour) => (
                  <option key={hour} value={hour}>{hour}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <span className="text-xs text-gray-500 block mb-1">MM</span>
              <select
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  hasFieldError('submitTime') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                value={submitTimeMinute}
                onChange={(e) => setSubmitTimeMinute(e.target.value)}
              >
                {minuteOptions.map((minute) => (
                  <option key={minute} value={minute}>{minute}</option>
                ))}
              </select>
            </div>
          </div>
          {getFieldError('submitTime') && (
            <span className="text-xs text-red-500 mt-1 block">{getFieldError('submitTime')}</span>
          )}
        </div>

        {/* Expected run days - Conditional based on frequency */}
        {frequency === "Daily" && (
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-800 mb-3">Daily Frequency</h3>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700">Expected run days of the week:</label>
              <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 text-xs cursor-help"
                   title="Specific days of the week on which to run the job">
                ?
              </div>
            </div>
            <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700">
              Sunday to Saturday
            </div>
          </div>
        )}

        {frequency === "Weekly" && (
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-800 mb-3">Weekly Frequency</h3>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700">Expected run days of the week:</label>
              <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 text-xs cursor-help"
                   title="Select the days of run">
                ?
              </div>
            </div>
            <span className="text-xs text-blue-600 block mb-2">Select the days of run</span>
            <div className="max-h-40 overflow-y-auto border border-blue-400 rounded-md p-3">
              {weekDayOptions.map((day) => (
                <label key={day} className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={runDays.includes(day)}
                    onChange={(e) => handleRunDayChange(day, e.target.checked)}
                  />
                  <span className="text-sm text-gray-700">{day}</span>
                </label>
              ))}
            </div>
            {getFieldError('runDays') && (
              <span className="text-xs text-red-500 mt-1 block">{getFieldError('runDays')}</span>
            )}
          </div>
        )}

        {frequency === "Monthly" && (
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-800 mb-3">Monthly:</h3>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700">Expected run days of the month:</label>
              <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 text-xs cursor-help"
                   title="Select months and occurrences">
                ?
              </div>
            </div>
            
            {/* Top-level tags display */}
            <div className="mb-4">
              <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 min-h-[40px] flex flex-wrap gap-2 items-center">
                {runMonths.map((month) => (
                  <span key={month} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                    {month}
                    <button
                      onClick={() => handleRunMonthChange(month, false)}
                      className="text-gray-500 hover:text-gray-700 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 min-h-[40px] flex flex-wrap gap-2 items-center">
                {runDays.map((day) => (
                  <span key={day} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                    {day}
                    <button
                      onClick={() => handleRunDayChange(day, false)}
                      className="text-gray-500 hover:text-gray-700 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 min-h-[40px] flex flex-wrap gap-2 items-center">
                {runOccurrences.map((occurrence) => (
                  <span key={occurrence} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                    {occurrence}
                    <button
                      onClick={() => handleRunOccurrenceChange(occurrence, false)}
                      className="text-gray-500 hover:text-gray-700 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Month selection */}
              <div>
                <span className="text-xs text-blue-600 block mb-2">Select the months of run</span>
                <div className="max-h-40 overflow-y-auto border border-blue-400 rounded-md">
                  <div className="p-2 bg-blue-50 border-b">
                    <span className="text-xs font-medium text-gray-600">OPTIONS</span>
                  </div>
                  <div className="p-2">
                    {monthOptions.map((month) => (
                      <label key={month} className="flex items-center gap-2 mb-1 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={runMonths.includes(month)}
                          onChange={(e) => handleRunMonthChange(month, e.target.checked)}
                        />
                        <span className="text-sm text-gray-700">{month}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Day type and weekday selection */}
              <div>
                <span className="text-xs text-blue-600 block mb-2">Select the days of run</span>
                <div className="max-h-40 overflow-y-auto border border-blue-400 rounded-md">
                  <div className="p-2">
                    <label className="flex items-center gap-2 mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={runDays.includes("Business day")}
                        onChange={(e) => handleRunDayChange("Business day", e.target.checked)}
                      />
                      <span className="text-sm text-gray-700">Business day</span>
                    </label>
                    <label className="flex items-center gap-2 mb-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={runDays.includes("Calendar day")}
                        onChange={(e) => handleRunDayChange("Calendar day", e.target.checked)}
                      />
                      <span className="text-sm text-gray-700">Calendar day</span>
                    </label>
                    <div className="border-t pt-2">
                      <span className="text-xs font-medium text-gray-600 block mb-2">WEEKDAYS</span>
                      {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                        <label key={day} className="flex items-center gap-2 mb-1 cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={runDays.includes(day)}
                            onChange={(e) => handleRunDayChange(day, e.target.checked)}
                          />
                          <span className="text-sm text-gray-700">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Occurrence selection */}
            <div className="mt-4">
              <span className="text-xs text-blue-600 block mb-2">Select the occurrences of run</span>
              <div className="max-h-32 overflow-y-auto border border-blue-400 rounded-md p-2">
                {["First", "Last", "2nd", "3rd", "4th", "5th", "6th", "7th"].map((occurrence) => (
                  <label key={occurrence} className="flex items-center gap-2 mb-1 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={runOccurrences.includes(occurrence)}
                      onChange={(e) => handleRunOccurrenceChange(occurrence, e.target.checked)}
                    />
                    <span className="text-sm text-gray-700">{occurrence}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {getFieldError('runMonths') && (
              <span className="text-xs text-red-500 mt-1 block">{getFieldError('runMonths')}</span>
            )}
          </div>
        )}

        {frequency === "Annually" && (
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-800 mb-3">Annually:</h3>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700">Expected run days of the year:</label>
              <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 text-xs cursor-help"
                   title="Select the days of run">
                ?
              </div>
            </div>
            <span className="text-xs text-blue-600 block mb-2">Select the days of run</span>
            <div className="max-h-40 overflow-y-auto border border-blue-400 rounded-md p-3">
              {Array.from({ length: 8 }, (_, i) => 358 + i).map((day) => (
                <label key={day} className="flex items-center gap-2 mb-1 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={runDays.includes(day.toString())}
                    onChange={(e) => handleRunDayChange(day.toString(), e.target.checked)}
                  />
                  <span className="text-sm text-gray-700">{day}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {frequency.includes("holiday") && (
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-800 mb-4">
              Run on Holiday/Day before holiday/Day after holiday
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700">Expected run days of the year:</label>
              <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 text-xs cursor-help"
                   title="Select the holidays when job would run">
                ?
              </div>
            </div>
            <span className="text-xs text-blue-600 block mb-2">Select the holidays when job would run</span>
            <div className="max-h-40 overflow-y-auto border border-blue-400 rounded-md p-3">
              {holidayOptions.map((holiday) => (
                <label key={holiday} className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={holidays.includes(holiday)}
                    onChange={(e) => handleHolidayChange(holiday, e.target.checked)}
                  />
                  <span className="text-sm text-gray-700">{holiday}</span>
                </label>
              ))}
            </div>
            {getFieldError('holidays') && (
              <span className="text-xs text-red-500 mt-1 block">{getFieldError('holidays')}</span>
            )}
          </div>
        )}

        {/* Holiday Action */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Please select appropriate action for holidays
          </label>
          <div className="space-y-3">
            {/* Run the job on holiday */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="holidayAction"
                  value="run-on-holiday"
                  checked={holidayAction === "run-on-holiday"}
                  onChange={(e) => {
                    setHolidayAction(e.target.value)
                    setHolidaySubAction("") // Reset sub-action
                  }}
                  className="text-blue-600"
                />
                <span className="text-sm text-gray-700">Run the job</span>
              </label>
              <span className="text-sm text-gray-500">on holiday</span>
            </div>
            
            {/* Do not run the job */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="holidayAction"
                    value="do-not-run"
                    checked={holidayAction === "do-not-run"}
                    onChange={(e) => {
                      setHolidayAction(e.target.value)
                      setHolidaySubAction("") // Reset sub-action when changing main action
                    }}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Do not run the job</span>
                </label>
              </div>
              
              {/* Sub-options for "Do not run the job" */}
              {holidayAction === "do-not-run" && (
                <div className="ml-6 space-y-2 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="holidaySubAction"
                      value="before-holiday"
                      checked={holidaySubAction === "before-holiday"}
                      onChange={(e) => setHolidaySubAction(e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-500">on the day before holiday</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="holidaySubAction"
                      value="after-holiday"
                      checked={holidaySubAction === "after-holiday"}
                      onChange={(e) => setHolidaySubAction(e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-500">on the day after holiday</span>
                  </label>
                  {getFieldError('holidaySubAction') && (
                    <span className="text-xs text-red-500 block">{getFieldError('holidaySubAction')}</span>
                  )}
                </div>
              )}
            </div>
          </div>
          {getFieldError('holidayAction') && (
            <span className="text-xs text-red-500 mt-1 block">{getFieldError('holidayAction')}</span>
          )}
        </div>

        {/* Intervals */}
        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={hasIntervals}
              onChange={(e) => setHasIntervals(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Job scheduled to run at fixed intervals in a run window?</span>
          </label>

          {hasIntervals && (
            <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
              <span className="text-xs text-gray-600 block mb-3">Enables below form if selected</span>
              
              {/* Repeat Start Time */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">Repeat Start Time</label>
                  <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 text-xs cursor-help"
                       title="Same as Job Submit Time">
                    ?
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <span className="text-xs text-gray-500 block mb-1">HH</span>
                    <select
                      className="w-full px-3 py-2 text-sm border rounded-md bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                      value={repeatStartHour}
                      disabled
                    >
                      {hourOptions.map((hour) => (
                        <option key={hour} value={hour}>{hour}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-gray-500 block mb-1">MM</span>
                    <select
                      className="w-full px-3 py-2 text-sm border rounded-md bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                      value={repeatStartMinute}
                      disabled
                    >
                      {minuteOptions.map((minute) => (
                        <option key={minute} value={minute}>{minute}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {getFieldError('repeatStart') && (
                  <span className="text-xs text-red-500 mt-1 block">{getFieldError('repeatStart')}</span>
                )}
              </div>

              {/* Repeat End Time */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">Repeat End Time</label>
                  <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 text-xs cursor-help"
                       title="For repeat scheduling, the time after which the job should not be repeated. Value should be greater than end time and less than 23:59">
                    ?
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <span className="text-xs text-gray-500 block mb-1">HH</span>
                    <select
                      className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        hasFieldError('repeatEnd') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      value={repeatEndHour}
                      onChange={(e) => setRepeatEndHour(e.target.value)}
                    >
                      {hourOptions.map((hour) => (
                        <option key={hour} value={hour}>{hour}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-gray-500 block mb-1">MM</span>
                    <select
                      className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        hasFieldError('repeatEnd') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      value={repeatEndMinute}
                      onChange={(e) => setRepeatEndMinute(e.target.value)}
                    >
                      {minuteOptions.map((minute) => (
                        <option key={minute} value={minute}>{minute}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {getFieldError('repeatEnd') && (
                  <span className="text-xs text-red-500 mt-1 block">{getFieldError('repeatEnd')}</span>
                )}
              </div>

              {/* Repeat Type */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">Repeat Type</label>
                  <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 text-xs cursor-help"
                       title="For repeat scheduling, how the next iteration should be calculated. Values are C = Clock; S = Start; E = End.">
                    ?
                  </div>
                </div>
                <select
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    hasFieldError('repeatType') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  value={repeatType}
                  onChange={(e) => setRepeatType(e.target.value)}
                >
                  <option value="">Select Repeat Type</option>
                  {repeatTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.value} = {option.label}
                    </option>
                  ))}
                </select>
                {getFieldError('repeatType') && (
                  <span className="text-xs text-red-500 mt-1 block">{getFieldError('repeatType')}</span>
                )}
              </div>

              {/* Repeat Interval */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">Repeat Interval</label>
                  <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 text-xs cursor-help"
                       title="Value should be equal or greater than 00:15 and less than the difference of start time and end time">
                    ?
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <span className="text-xs text-gray-500 block mb-1">HH</span>
                    <select
                      className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        hasFieldError('repeatInterval') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      value={repeatIntervalHour}
                      onChange={(e) => setRepeatIntervalHour(e.target.value)}
                    >
                      {hourOptions.map((hour) => (
                        <option key={hour} value={hour}>{hour}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-gray-500 block mb-1">MM</span>
                    <select
                      className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        hasFieldError('repeatInterval') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      value={repeatIntervalMinute}
                      onChange={(e) => setRepeatIntervalMinute(e.target.value)}
                    >
                      {minuteOptions.map((minute) => (
                        <option key={minute} value={minute}>{minute}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {getFieldError('repeatInterval') && (
                  <span className="text-xs text-red-500 mt-1 block">{getFieldError('repeatInterval')}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Validation Errors Summary */}
        {validationErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <h4 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h4>
            <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
              {validationErrors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-3">
          <Button 
            onClick={handleAdd} 
            variant="outline" 
            className={`min-w-[100px] ${validationErrors.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={validationErrors.length > 0}
          >
            Add
          </Button>
          <Button onClick={handleClose} variant="outline" className="min-w-[100px]">
            Close
          </Button>
        </div>
          </>
        )}
      </div>
    </Modal>
  )
}

export default CalendarSchedulingModal