import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, Users, FileText, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { cn } from '../../utils/cn'

export const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true)
  const location = useLocation()

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Employees', path: '/employees', icon: Users },
    { name: 'Multi-Step Form', path: '/forms', icon: FileText }
  ]

  return (
    <motion.aside
      animate={{ width: isExpanded ? 240 : 80 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="hidden md:flex flex-col fixed left-4 top-4 bottom-4 z-40 rounded-card bg-white/70 border border-black/[0.06] backdrop-blur-2xl p-4 select-none shadow-sm"
    >
      {/* Brand Logo Header */}
      <div className="flex items-center justify-between mb-8 px-2 py-1">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-orange-primary to-orange-secondary flex items-center justify-center shadow-orange-glow flex-shrink-0">
            <Sparkles size={16} className="text-white" />
          </div>
          {isExpanded && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-text-primary font-sans font-bold tracking-[0.22em] text-[10px] uppercase"
            >
              Emp Dashboard
            </motion.span>
          )}
        </div>
        
        {/* Toggle Collapse Button */}
        {isExpanded && (
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1 rounded-full text-text-secondary hover:text-text-primary hover:bg-black/[0.03] transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Navigation Menu Links */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'relative flex items-center h-11 px-3 rounded-xl transition-colors duration-300 font-sans text-sm font-medium focus:outline-none group',
                  isActive ? 'text-text-primary font-semibold' : 'text-text-secondary hover:text-text-primary'
                )
              }
            >
              {/* Sliding Orange Active Capsule Pill */}
              {isActive && (
                <motion.div
                  layoutId="sidebarActivePill"
                  className="absolute inset-0 bg-black/[0.02] rounded-xl border border-black/[0.05]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Vertical Orange Indicator line */}
              {isActive && (
                <motion.div
                  layoutId="sidebarActiveIndicator"
                  className="absolute left-0 top-3 bottom-3 w-1 bg-orange-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              <div className="relative z-10 flex items-center space-x-3 w-full">
                <item.icon
                  size={18}
                  className={cn(
                    'transition-colors duration-300',
                    isActive ? 'text-orange-primary' : 'text-text-secondary group-hover:text-text-primary'
                  )}
                />
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {item.name}
                  </motion.span>
                )}
              </div>
            </NavLink>
          )
        })}
      </nav>

      {/* Collapse Trigger for small sidebar */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="self-center p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-black/[0.03] transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {/* Sidebar Footer */}
      {isExpanded && (
        <div className="mt-auto p-2 border-t border-white/[0.05] text-[9px] uppercase font-bold tracking-[0.22em] text-muted-custom">
          EMP DASHBOARD v1.0.0
        </div>
      )}
    </motion.aside>
  )
}
