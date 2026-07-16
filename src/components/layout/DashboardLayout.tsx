import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { BottomNav } from './BottomNav'

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex">
      {/* Sidebar Navigation - Fixed Left on Desktop */}
      <Sidebar />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col md:pl-[80px] transition-all duration-300">
        <div className="w-full max-w-7xl mx-auto flex flex-col min-h-screen">
          {/* Top Navbar */}
          <Navbar />

          {/* Page Routing Port */}
          <main className="flex-1 p-4 md:p-8 pb-28 relative">
            <Outlet />
          </main>
        </div>

        {/* Floating Bottom Navigation Bar */}
        <BottomNav />
      </div>
    </div>
  )
}
export default DashboardLayout
