// Dashboard.tsx

import Header from "@/app/components/dashboard/Header";
import Sidebar from "@/app/components/dashboard/Sidebar";
import { useState } from "react";

interface DashboardProps {
  children?: React.ReactNode;
}

const Dashboard = ({ children }: DashboardProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="max-h-screen bg-[#F9FAFB] overflow-hidden">
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      <div className="flex gap-0 h-screen">
        {/* Sidebar */}
        <div
          className={`
    bg-white h-[calc(100vh-64px)] overflow-y-auto transition-transform duration-300 ease-in-out 
    fixed md:static top-[64px] left-0 z-50 
    w-[300px] 
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
    md:translate-x-0
  `}
        >
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          />
        </div>

        {/* Main Content */}
        <div className="w-full">
          <div className="bg-[#f0f6ff] w-full p-5 rounded-md h-[calc(100vh-110px)] overflow-y-scroll">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
