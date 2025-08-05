import React from "react";
import { Routes, Route } from "react-router-dom";
import JobSchedulingWizard from "./components/Wizard/JobSchedulingWizard";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import UserProfile from "./components/Pages/UserProfile";

const App: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 bg-gray-50">
          <Routes>
            <Route path="/" element={<JobSchedulingWizard />} />
            <Route path="/schedule-job-v1" element={<JobSchedulingWizard />} />
            <Route path="/userprofile" element={<UserProfile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
