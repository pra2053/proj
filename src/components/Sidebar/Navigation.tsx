"use client"

import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import NavItem from "./NavItem"
import NavSection from "./NavSection"

const Navigation: React.FC = () => {
  const [isSchedulingExpanded, setIsSchedulingExpanded] = useState(true)
  const [isApprovalsExpanded, setIsApprovalsExpanded] = useState(false)
  const [isCA7Expanded, setIsCA7Expanded] = useState(false)
  const [isOperationalExpanded, setIsOperationalExpanded] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const mainNavItems = [
    { icon: "🏠", label: "Home", path: "/" },
    { icon: "📊", label: "Dashboard", path: "/dashboard" },
    { icon: "🔍", label: "Global Search", path: "/global-search" },
  ]

  const schedulingSubItems = [
    { label: "Add Job", path: "/add-job", active: location.pathname === "/add-job" },
    { label: "Schedule Job v1", path: "/schedule-job-v1", active: location.pathname === "/schedule-job-v1" || location.pathname === "/" },
    { label: "Modify Job", path: "/modify-job", active: location.pathname === "/modify-job" },
    { label: "Delete Job", path: "/delete-job", active: location.pathname === "/delete-job" },
    { label: "TEST", path: "/test", active: location.pathname === "/test" },
  ]

  const ca7SubItems = [
    { label: "Requests", path: "/requests", active: location.pathname === "/requests" },
    { label: "Vacation Plan", path: "/vacation-plan", active: location.pathname === "/vacation-plan" },
  ]

  const handleNavClick = (label: string, path?: string) => {
    console.log(`Clicked on: ${label}`)
    if (path) {
      navigate(path)
    }
  }

  return (
    <nav className="flex-1 py-2">
      {mainNavItems.map((item, index) => (
        <NavItem 
          key={index} 
          icon={item.icon} 
          label={item.label} 
          onClick={() => handleNavClick(item.label, item.path)} 
          active={location.pathname === item.path}
        />
      ))}

      <NavSection
        icon="✏️"
        label="Scheduling"
        subItems={schedulingSubItems}
        expanded={isSchedulingExpanded}
        onClick={() => setIsSchedulingExpanded(!isSchedulingExpanded)}
        onSubItemClick={handleNavClick}
      />

      <NavSection
        icon="✅"
        label="Approvals"
        subItems={[]}
        expanded={isApprovalsExpanded}
        onClick={() => setIsApprovalsExpanded(!isApprovalsExpanded)}
      />

      <NavSection
        icon="⚙️"
        label="CA7 Administration"
        subItems={ca7SubItems}
        expanded={isCA7Expanded}
        onClick={() => setIsCA7Expanded(!isCA7Expanded)}
        onSubItemClick={handleNavClick}
      />

      <NavSection
        icon="⚙️"
        label="Operational Requests"
        subItems={[]}
        expanded={isOperationalExpanded}
        onClick={() => setIsOperationalExpanded(!isOperationalExpanded)}
      />
    </nav>
  )
}

export default Navigation
