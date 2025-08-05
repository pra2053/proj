import React, { useState, useEffect } from "react"
import Modal from "../../UI/Modal"
import { Button } from "../../UI"

interface DatasetTriggerModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (data: DatasetTriggerData) => void
}

interface DatasetTriggerData {
  isNdmTransmission: boolean
  sourceJobName: string
  ndmSourceNode?: string
  datasetName: string
}

interface ValidationError {
  field: string
  message: string
}

const DatasetTriggerModal: React.FC<DatasetTriggerModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [isNdmTransmission, setIsNdmTransmission] = useState(false)
  const [sourceJobName, setSourceJobName] = useState("CA7TRIG.CA7P.CA7DUMMY")
  const [ndmSourceNode, setNdmSourceNode] = useState("")
  const [datasetName, setDatasetName] = useState("")
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])

  // Dataset naming rules validation
  const validateDatasetName = (name: string): ValidationError[] => {
    const errors: ValidationError[] = []
    
    if (!name) {
      errors.push({ field: 'datasetName', message: 'Dataset name is required' })
      return errors
    }

    // Rule: Must be composed of at least two joined character segments separated by periods
    const segments = name.split('.')
    if (segments.length < 2) {
      errors.push({ field: 'datasetName', message: 'Dataset name must have at least two segments separated by periods' })
    }

    // Rule: Cannot be longer than 44 characters
    if (name.length > 44) {
      errors.push({ field: 'datasetName', message: 'Dataset name cannot be longer than 44 characters' })
    }

    // Rule: Cannot contain two successive periods
    if (name.includes('..')) {
      errors.push({ field: 'datasetName', message: 'Dataset name cannot contain two successive periods' })
    }

    // Rule: Cannot end with a period
    if (name.endsWith('.')) {
      errors.push({ field: 'datasetName', message: 'Dataset name cannot end with a period' })
    }

    // Rule: Cannot contain accented characters
    const accentedChars = /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/i
    if (accentedChars.test(name)) {
      errors.push({ field: 'datasetName', message: 'Dataset name cannot contain accented characters' })
    }

    // Validate each segment
    segments.forEach((segment, index) => {
      if (segment === '') {
        errors.push({ field: 'datasetName', message: `Segment ${index + 1} cannot be empty` })
        return
      }

      // Rule: A segment cannot be longer than eight characters
      if (segment.length > 8) {
        errors.push({ field: 'datasetName', message: `Segment "${segment}" cannot be longer than 8 characters` })
      }

      // Rule: First segment character must be a letter or #, @, $
      const firstChar = segment[0]
      if (!/[A-Za-z#@$]/.test(firstChar)) {
        errors.push({ field: 'datasetName', message: `First character of segment "${segment}" must be a letter or #, @, $` })
      }

      // Rule: Remaining characters can be letters, numbers, #, @, $
      const remainingChars = segment.slice(1)
      if (remainingChars && !/^[A-Za-z0-9#@$]*$/.test(remainingChars)) {
        errors.push({ field: 'datasetName', message: `Invalid characters in segment "${segment}". Only letters, numbers, #, @, $ are allowed` })
      }
    })

    return errors
  }

  // Validate individual fields
  const validateFields = (): ValidationError[] => {
    const errors: ValidationError[] = []

    if (!sourceJobName.trim()) {
      errors.push({ field: 'sourceJobName', message: 'Source job or process name is required' })
    }

    if (isNdmTransmission && !ndmSourceNode.trim()) {
      errors.push({ field: 'ndmSourceNode', message: 'NDM source node is required when NDM transmission is enabled' })
    }

    // Validate dataset name
    const datasetErrors = validateDatasetName(datasetName)
    errors.push(...datasetErrors)

    return errors
  }

  // Update dataset name when inputs change
  useEffect(() => {
    let newDatasetName = ""
    
    if (isNdmTransmission && sourceJobName && ndmSourceNode) {
      // When NDM is ON: sourceJobName.PROC1.ndmSourceNode
      newDatasetName = `${sourceJobName}.PROC1.${ndmSourceNode}`
    } else if (sourceJobName) {
      // When NDM is OFF: sourceJobName.PROC1
      newDatasetName = `${sourceJobName}.PROC1`
    }
    
    setDatasetName(newDatasetName)
    
    // Validate the generated dataset name
    const errors = validateDatasetName(newDatasetName)
    setValidationErrors(errors)
  }, [isNdmTransmission, sourceJobName, ndmSourceNode])

  const handleToggleChange = () => {
    setIsNdmTransmission(!isNdmTransmission)
    if (isNdmTransmission) {
      // When turning OFF NDM (from ON to OFF)
      setNdmSourceNode("")
    } else {
      // When turning ON NDM (from OFF to ON)
      setNdmSourceNode("PROC1")
    }
  }

  const handleAdd = () => {
    const errors = validateFields()
    
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    const data: DatasetTriggerData = {
      isNdmTransmission,
      sourceJobName: sourceJobName.trim(),
      ndmSourceNode: isNdmTransmission ? ndmSourceNode.trim() : undefined,
      datasetName,
    }
    onAdd(data)
    onClose()
    
    // Reset form and errors
    setValidationErrors([])
  }

  const handleClose = () => {
    setValidationErrors([])
    onClose()
  }

  const getFieldError = (field: string): string | undefined => {
    return validationErrors.find(error => error.field === field)?.message
  }

  const hasFieldError = (field: string): boolean => {
    return validationErrors.some(error => error.field === field)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add File" className="max-w-2xl w-full">
      <div className="p-6">
        {/* NDM Transmission Toggle */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={isNdmTransmission}
                onChange={handleToggleChange}
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${
                isNdmTransmission ? 'bg-blue-600' : 'bg-gray-200'
              }`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  isNdmTransmission ? 'translate-x-5' : ''
                }`} />
              </div>
            </div>
            <span className="text-sm font-medium text-gray-700">
              File transmitted through NDM transmission?
            </span>
          </label>
        </div>

        {/* Help Icon and Input Fields */}
        <div className="mb-6">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-600 text-xs font-bold cursor-help"
                   title="Enter the source job or process name and NDM node information">
                ?
              </div>
            </div>
            
            <div className="flex-1">
              {isNdmTransmission ? (
                // Two fields when NDM is ON
                <div className="flex gap-3 w-full">
                  <div className="flex-1">
                    <input
                      type="text"
                      className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        hasFieldError('sourceJobName') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      value={sourceJobName}
                      onChange={(e) => setSourceJobName(e.target.value)}
                      placeholder="Enter source job or process name"
                    />
                    <span className="text-xs text-gray-500 mt-1 block">Enter source job or process name</span>
                    {getFieldError('sourceJobName') && (
                      <span className="text-xs text-red-500 mt-1 block">{getFieldError('sourceJobName')}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        hasFieldError('ndmSourceNode') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      value={ndmSourceNode}
                      onChange={(e) => setNdmSourceNode(e.target.value)}
                      placeholder="Enter source NDM node"
                    />
                    <span className="text-xs text-gray-500 mt-1 block">Enter source NDM node</span>
                    {getFieldError('ndmSourceNode') && (
                      <span className="text-xs text-red-500 mt-1 block">{getFieldError('ndmSourceNode')}</span>
                    )}
                  </div>
                </div>
              ) : (
                // Single field when NDM is OFF
                <div>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      hasFieldError('sourceJobName') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    value={sourceJobName}
                    onChange={(e) => setSourceJobName(e.target.value)}
                    placeholder="Enter source job or process name"
                  />
                  <span className="text-xs text-gray-500 mt-1 block">Enter source job or process name</span>
                  {getFieldError('sourceJobName') && (
                    <span className="text-xs text-red-500 mt-1 block">{getFieldError('sourceJobName')}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dataset Name */}
        <div className="mb-6">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-600 text-xs font-bold cursor-help"
                   title="Dataset name is automatically generated based on naming rules">
                ?
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dataset Name:
              </label>
              <div className={`px-3 py-2 border rounded-md text-sm ${
                hasFieldError('datasetName') ? 'bg-red-50 border-red-300 text-red-700' : 'bg-gray-100 border-gray-300 text-gray-700'
              }`}>
                {datasetName}
              </div>
              {getFieldError('datasetName') && (
                <span className="text-xs text-red-500 mt-1 block">{getFieldError('datasetName')}</span>
              )}
            </div>
          </div>
        </div>

        {/* Naming Rules Info */}
        {validationErrors.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Dataset Naming Rules:</h4>
            <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
              <li>Must have at least two segments separated by periods (e.g., HLQ.ABC.XYZ)</li>
              <li>Cannot be longer than 44 characters</li>
              <li>Cannot contain two successive periods</li>
              <li>Cannot end with a period</li>
              <li>Each segment cannot be longer than 8 characters</li>
              <li>First character of each segment must be a letter or #, @, $</li>
              <li>Remaining characters can be letters, numbers, #, @, $</li>
              <li>Cannot contain accented characters</li>
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
      </div>
    </Modal>
  )
}

export default DatasetTriggerModal