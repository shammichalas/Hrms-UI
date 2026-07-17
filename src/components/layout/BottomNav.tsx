import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, Users, FileText } from 'lucide-react'
import { cn } from '../../utils/cn'

export const BottomNav: React.FC = () => {
  const location = useLocation()

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Employees', path: '/employees', icon: Users },
    { name: 'Multi-Step Form', path: '/forms', icon: FileText }
  ]

  return (
    <motion.div
      initial={{ y: 50, opacity: 0, x: '-50%' }}
      animate={{ y: 0, opacity: 1, x: '-50%' }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      className="fixed bottom-6 left-1/2 z-40 select-none md:hidden"
    >
      <div className="flex items-center space-x-2 bg-white/80 border border-black/[0.06] backdrop-blur-2xl px-3 py-2 rounded-full shadow-premium">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'relative flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-medium transition-colors duration-300 focus:outline-none',
                    isActive ? 'text-white font-semibold' : 'text-text-secondary hover:text-text-primary'
                  )
                }
              >
                {/* Active Sliding Orange Pill */}
                {isActive && (
                  <motion.div
                    layoutId="bottomActivePill"
                    className="absolute inset-0 bg-gradient-to-r from-orange-primary to-orange-secondary rounded-full -z-10 shadow-orange-glow"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                <item.icon size={14} className="relative z-10" />
                <span className="relative z-10 hidden sm:inline">{item.name}</span>
              </NavLink>
            )
          })}
        </div>
      </motion.div>
  )
}
