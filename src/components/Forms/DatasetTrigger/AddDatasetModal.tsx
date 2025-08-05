import React, { useState } from "react"
import Modal from "../../UI/Modal"
import { Button } from "../../UI"

interface AddDatasetModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (data: DatasetData) => void
}

interface DatasetData {
  isNdmTransmission: boolean
  sourceJobName: string
  ndmSourceNode?: string
  datasetName: string
}

const AddDatasetModal: React.FC<AddDatasetModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [isNdmTransmission, setIsNdmTransmission] = useState(true)
  const [sourceJobName, setSourceJobName] = useState("")
  const [ndmSourceNode, setNdmSourceNode] = useState("")
  const [datasetName, setDatasetName] = useState("")

  const handleToggleNdm = (checked: boolean) => {
    setIsNdmTransmission(checked)
    if (!checked) {
      setNdmSourceNode("")
    }
  }

  const generateDatasetName = () => {
    // Generate dataset name based on source job and NDM node
    if (sourceJobName && isNdmTransmission && ndmSourceNode) {
      return `${sourceJobName}.${ndmSourceNode}`
    } else if (sourceJobName) {
      return sourceJobName
    }
    return ""
  }

  const handleSourceJobChange = (value: string) => {
    setSourceJobName(value)
    // Auto-generate dataset name
    const generatedName = value && isNdmTransmission && ndmSourceNode 
      ? `${value}.${ndmSourceNode}` 
      : value
    setDatasetName(generatedName)
  }

  const handleNdmNodeChange = (value: string) => {
    setNdmSourceNode(value)
    // Auto-generate dataset name
    const generatedName = sourceJobName && isNdmTransmission && value
      ? `${sourceJobName}.${value}`
      : sourceJobName
    setDatasetName(generatedName)
  }

  const handleAdd = () => {
    const data: DatasetData = {
      isNdmTransmission,
      sourceJobName,
      ndmSourceNode: isNdmTransmission ? ndmSourceNode : undefined,
      datasetName,
    }
    onAdd(data)
    // Reset form
    setIsNdmTransmission(true)
    setSourceJobName("")
    setNdmSourceNode("")
    setDatasetName("")
    onClose()
  }

  const isFormValid = () => {
    if (!sourceJobName) return false
    if (isNdmTransmission && !ndmSourceNode) return false
    return true
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add File">
      <div className="p-4 space-y-4">
        {/* NDM Transmission Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="ndmTransmission"
            checked={isNdmTransmission}
            onChange={(e) => handleToggleNdm(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="ndmTransmission" className="text-sm font-medium text-gray-700">
            File transmitted through NDM transmission?
          </label>
        </div>

        {/* Source Job Name */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Enter source job or process name
          </label>
          <div className="relative">
            <input
              type="text"
              value={sourceJobName}
              onChange={(e) => handleSourceJobChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="CA7TRIG.CA7P.CA7DUMMY.PROC1"
            />
            <span className="absolute right-2 top-2.5 text-orange-500">⚠️</span>
          </div>
        </div>

        {/* NDM Source Node - Only show when NDM transmission is enabled */}
        {isNdmTransmission && (
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Enter source NDM node
            </label>
            <div className="relative">
              <input
                type="text"
                value={ndmSourceNode}
                onChange={(e) => handleNdmNodeChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="NDM2"
              />
              <span className="absolute right-2 top-2.5 text-orange-500">⚠️</span>
            </div>
          </div>
        )}

        {/* Dataset Name - Disabled/Read-only */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Dataset Name:
          </label>
          <input
            type="text"
            value={datasetName}
            readOnly
            className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            onClick={handleAdd}
            variant="primary"
            disabled={!isFormValid()}
          >
            Add
          </Button>
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default AddDatasetModal
