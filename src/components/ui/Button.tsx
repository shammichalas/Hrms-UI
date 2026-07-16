import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  loading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  loading = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-sans font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-primary/50 disabled:opacity-50 disabled:pointer-events-none select-none'
  
  const variants = {
    primary: 'bg-gradient-to-r from-orange-primary to-orange-secondary text-white shadow-orange-glow hover:shadow-orange-glow-hover border border-transparent',
    secondary: 'bg-black/[0.02] hover:bg-black/[0.05] text-text-primary border border-black/[0.08] hover:border-black/[0.15] backdrop-blur-md',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-black/[0.03] border border-transparent'
  }

  const sizes = {
    sm: 'px-4 py-1.5 text-xs rounded-button',
    md: 'px-6 py-2.5 text-sm rounded-button',
    lg: 'px-8 py-3.5 text-base rounded-button'
  }

  const motionProps = disabled || loading ? {} : {
    whileHover: { y: -2, scale: 1.02 },
    whileTap: { y: 0, scale: 0.98 },
    transition: { type: 'spring', stiffness: 500, damping: 25 }
  }

  return (
    <motion.button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...motionProps}
      {...(props as any)}
    >
      {loading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : null}
      {children}
    </motion.button>
  )
}
