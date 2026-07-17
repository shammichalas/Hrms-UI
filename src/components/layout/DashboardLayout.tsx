import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { BottomNav } from './BottomNav'
import { cn } from '../../utils/cn'

export const DashboardLayout: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex">
      {/* Sidebar Navigation - Fixed Left on Desktop */}
      <Sidebar isExpanded={isSidebarExpanded} onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)} />

      {/* Main Content Container */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        isSidebarExpanded ? "md:pl-[272px]" : "md:pl-[112px]"
      )}>
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
