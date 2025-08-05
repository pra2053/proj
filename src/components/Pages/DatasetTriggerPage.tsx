import React, { useState } from "react"
import DatasetTriggerModal from "../Forms/DatasetTrigger/DatasetTriggerModal"

interface DatasetTriggerData {
  isNdmTransmission: boolean
  sourceJobName: string
  ndmSourceNode?: string
  datasetName: string
}

const DatasetTriggerPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true) // Open modal by default when page loads
  const [triggers, setTriggers] = useState<DatasetTriggerData[]>([])

  const handleAddTrigger = (data: DatasetTriggerData) => {
    setTriggers([...triggers, data])
    console.log("Added dataset trigger:", data)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Dataset Trigger
            </h2>
            <p className="text-gray-600">
              Manage dataset triggers for your jobs
            </p>
          </div>
          <button
            onClick={handleOpenModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add Dataset Trigger
          </button>
        </div>

        {/* Display existing triggers */}
        {triggers.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dataset Triggers</h3>
            <div className="space-y-4">
              {triggers.map((trigger, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Dataset Name:</span>
                      <p className="text-sm text-gray-900">{trigger.datasetName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Source Job:</span>
                      <p className="text-sm text-gray-900">{trigger.sourceJobName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">NDM Transmission:</span>
                      <p className="text-sm text-gray-900">{trigger.isNdmTransmission ? "Yes" : "No"}</p>
                    </div>
                    {trigger.ndmSourceNode && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">NDM Source Node:</span>
                        <p className="text-sm text-gray-900">{trigger.ndmSourceNode}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {triggers.length === 0 && !isModalOpen && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Dataset Triggers</h3>
            <p className="text-gray-600 mb-4">You haven't added any dataset triggers yet.</p>
            <button
              onClick={handleOpenModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add Your First Dataset Trigger
            </button>
          </div>
        )}
      </div>

      {/* Dataset Trigger Modal */}
      <DatasetTriggerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddTrigger}
      />
    </div>
  )
}

export default DatasetTriggerPage
