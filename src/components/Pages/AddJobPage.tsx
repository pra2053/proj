import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import JobDefinitionForm from "../Forms/JobDefinition/JobDefinitionForm"

const AddJobPage: React.FC = () => {
  const navigate = useNavigate()

  const handleContinue = (data: any) => {
    console.log("Job Definition Data:", data)
    // Here you would typically save the data to state or context
    // and navigate to the next step (Frequency Information)
    // For now, we'll just log the data
    alert(`Job Definition Created:\nJob Name: ${data.jobName}\nRegion: ${data.region}\nLPAR: ${data.lpar}`)
  }

  return <JobDefinitionForm onContinue={handleContinue} />
}

export default AddJobPage
