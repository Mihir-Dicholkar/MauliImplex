import Sidebar from "../components/Sidebar";
import React, { useState } from "react";
import Topbar from "../components/Topbar";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
      const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  return (
    <div className="flex">
   <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

<div
  className={`flex-1 min-h-screen bg-gradient-to-r from-[#f59e0b] via-[#fcd34d] to-[#fef9c3] transition-all duration-300 ${
    isSidebarOpen ? "ml-60" : "ml-0"
  }`}
>
        <Topbar />

        <motion.div
          className="p-8 "
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Overview</h2>
          <p className="text-gray-600 text-center">
            Use the sidebar to navigate between upload, inventory, logs, and
            settings.
          </p> */}

          {/* Add dashboard widgets/analytics here */}
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
