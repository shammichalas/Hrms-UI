import React, { useEffect, useState } from 'react'
import { Bell, Search, Sun, User, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  role: string
  jobTitle?: string
  departmentName?: string
}

export const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        setProfile(JSON.parse(userStr))
      } catch (e) {
        console.error('Failed to parse user profile', e)
      }
    }
  }, [])

  const triggerNotification = () => {
    toast.success('Zero pending notifications', {
      description: 'Your workspace is fully up to date.',
    })
  }

  const triggerSearch = () => {
    toast('Command menu opened', {
      description: 'Search features are currently fully indexed.',
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : 'System User'
  const displayRole = profile ? (profile.jobTitle || profile.role) : 'Guest'

  return (
    <header className="sticky top-0 z-30 w-full bg-bg-primary/45 border-b border-b-border-custom backdrop-blur-md px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between select-none">
      {/* Mobile Brand Logo */}
      <div className="flex items-center space-x-2 md:hidden">
        <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-orange-primary to-orange-secondary flex items-center justify-center shadow-orange-glow flex-shrink-0">
          <span className="text-white font-display text-[10px] font-bold">W</span>
        </div>
        <span className="text-text-primary font-sans font-bold tracking-wider text-[11px] uppercase">
          WorkForHub
        </span>
      </div>

      {/* Search Bar Widget */}
      <div className="relative max-w-md w-full hidden sm:block">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-custom">
          <Search size={16} />
        </span>
        <input
          type="text"
          placeholder="Search workspace (Press ⌘K)"
          onClick={triggerSearch}
          readOnly
          className="w-full bg-black/[0.02] text-text-primary pl-10 pr-4 py-1.5 rounded-full text-xs border border-border-custom outline-none hover:border-black/[0.12] transition-colors cursor-pointer"
        />
      </div>

      {/* Header Actions */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Search trigger on mobile */}
        <button
          onClick={triggerSearch}
          className="p-2 sm:hidden rounded-full text-text-secondary hover:text-text-primary hover:bg-black/[0.03] transition-colors"
        >
          <Search size={18} />
        </button>

        {/* Theme Toggle (Light Editorial Luxury Locked Indicator) */}
        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 bg-black/[0.02] border border-border-custom rounded-full text-xs text-text-secondary select-none">
          <Sun size={12} className="text-orange-primary animate-pulse" />
          <span>Light Editorial</span>
        </div>

        {/* Notification Bell */}
        <button
          onClick={triggerNotification}
          className="relative p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-black/[0.03] transition-colors"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-orange-primary shadow-orange-glow" />
        </button>

        {/* User Profile Widget */}
        <div className="flex items-center space-x-2.5 pl-2 border-l border-border-custom">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-primary/20 to-orange-secondary/10 border border-orange-primary/30 flex items-center justify-center text-orange-primary font-bold text-xs shadow-orange-glow">
            <User size={14} />
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-text-primary leading-none">{fullName}</p>
            <p className="text-[10px] text-text-secondary mt-0.5">{displayRole}</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="Sign Out"
          className="p-2 rounded-full text-text-secondary hover:text-danger-custom hover:bg-danger-custom/5 transition-colors border border-transparent hover:border-danger-custom/10"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  )
}
