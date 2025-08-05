import React, { useState, useEffect } from "react"
import Modal from "../../UI/Modal"
import { Button } from "../../UI"
import { CheckCircle } from "lucide-react"

interface AddFileModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (data: FileData) => void
  jobName?: string
}

interface FileData {
  isNdmTransmission: boolean
  sourceJobOrNode: string
  datasetName: string
}

const AddFileModal: React.FC<AddFileModalProps> = ({ isOpen, onClose, onAdd, jobName = "CA7$AS" }) => {
  const [isNdmTransmission, setIsNdmTransmission] = useState(true)
  const [sourceJobOrNode, setSourceJobOrNode] = useState("")
  const [datasetName, setDatasetName] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [pendingData, setPendingData] = useState<FileData | null>(null)
  const [errors, setErrors] = useState({
    sourceJobOrNode: "",
    datasetName: ""
  })

  // Generate dataset name based on inputs
  const generateDatasetName = () => {
    if (!sourceJobOrNode) return ""
    const prefix = "CA7TRIG.CA7P."
    const suffix = isNdmTransmission ? `.${sourceJobOrNode}` : ""
    return `${prefix}${jobName}${suffix}`.toUpperCase()
  }

  // Update dataset name when inputs change
  useEffect(() => {
    setDatasetName(generateDatasetName())
  }, [sourceJobOrNode, isNdmTransmission, jobName])

  const handleAdd = () => {
    // Validation
    const newErrors = {
      sourceJobOrNode: "",
      datasetName: ""
    }

    if (!sourceJobOrNode.trim()) {
      newErrors.sourceJobOrNode = isNdmTransmission 
        ? "NDM source node is required" 
        : "Source job name is required"
    }

    setErrors(newErrors)

    if (newErrors.sourceJobOrNode) {
      return
    }

    // If validation passes, show success and then add
    const data: FileData = {
      isNdmTransmission,
      sourceJobOrNode,
      datasetName
    }
    setPendingData(data)
    setShowSuccess(true)
    
    // Don't close the modal automatically - let user click Close or Add More
  }

  const handleClose = () => {
    // If in success state, add the data before closing
    if (showSuccess && pendingData) {
      onAdd(pendingData)
    }
    
    // Reset form on close
    setIsNdmTransmission(true)
    setSourceJobOrNode("")
    setDatasetName("")
    setShowSuccess(false)
    setPendingData(null)
    setErrors({
      sourceJobOrNode: "",
      datasetName: ""
    })
    onClose()
  }

  const handleAddMore = () => {
    // Add the current data
    if (pendingData) {
      onAdd(pendingData)
    }
    
    // Reset form but keep modal open
    setIsNdmTransmission(true)
    setSourceJobOrNode("")
    setDatasetName("")
    setShowSuccess(false)
    setPendingData(null)
    setErrors({
      sourceJobOrNode: "",
      datasetName: ""
    })
  }

  if (showSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Add File" className="w-[500px]">
        <div className="p-6">
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
        </div>
      </Modal>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add File" className="w-[500px]">
      <div className="p-6">
        {/* NDM Transmission Toggle */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isNdmTransmission}
              onChange={(e) => {
                setIsNdmTransmission(e.target.checked)
                setSourceJobOrNode("") // Reset the field when toggling
                setErrors(prev => ({ ...prev, sourceJobOrNode: "" }))
              }}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              File transmitted through NDM transmission?
            </span>
            <div className="ml-auto">
              <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 text-xs cursor-help"
                   title="Select if the file is transmitted through NDM">
                ?
              </div>
            </div>
          </label>
        </div>

        {/* Source Job/Node Field */}
        <div className="mb-6">
          <label className="block mb-2">
            <span className="text-sm font-medium text-gray-700">
              {isNdmTransmission ? "Enter source NDM node:" : "Enter source job or program name:"}
            </span>
          </label>
          <input
            type="text"
            value={sourceJobOrNode}
            onChange={(e) => {
              setSourceJobOrNode(e.target.value)
              if (errors.sourceJobOrNode) {
                setErrors(prev => ({ ...prev, sourceJobOrNode: "" }))
              }
            }}
            placeholder={isNdmTransmission ? "SRWR" : "Enter job name"}
            className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.sourceJobOrNode ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.sourceJobOrNode && (
            <span className="text-xs text-red-500 mt-1 block">{errors.sourceJobOrNode}</span>
          )}
        </div>

        {/* Dataset Name Field */}
        <div className="mb-6">
          <label className="block mb-2">
            <span className="text-sm font-medium text-gray-700">Dataset Name:</span>
          </label>
          <div className="bg-gray-50 px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700">
            {datasetName || "CA7TRIG.CA7P.CA7$AS.SRWR"}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3">
          <Button onClick={handleAdd} variant="outline" className="min-w-[100px]">
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

export default AddFileModal
