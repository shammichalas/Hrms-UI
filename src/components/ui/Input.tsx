import React, { useState, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, placeholder, value, onChange, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasVal, setHasVal] = useState(!!value)

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      if (onFocus) onFocus(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setHasVal(!!e.target.value)
      if (onBlur) onBlur(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasVal(!!e.target.value)
      if (onChange) onChange(e)
    }

    // Determine if label should be floated (focused or has content)
    const isFloated = isFocused || hasVal

    return (
      <div className="relative w-full flex flex-col mb-4">
        <div className="relative flex items-center">
          <input
            type={type}
            ref={ref}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={isFocused ? placeholder : ''}
            className={cn(
              'peer w-full bg-black/[0.02] text-text-primary px-5 pt-6 pb-2 text-sm rounded-input border border-black/[0.06] backdrop-blur-md outline-none transition-all duration-300',
              isFocused ? 'border-orange-primary/80 ring-2 ring-orange-primary/20 bg-white/80' : '',
              error ? 'border-danger-custom focus:ring-danger-custom/20' : '',
              className
            )}
            {...props}
          />
          
          {/* Floating Label */}
          {label && (
            <motion.label
              initial={false}
              animate={{
                y: isFloated ? -10 : 0,
                scale: isFloated ? 0.85 : 1,
                color: error ? '#FF4D4D' : isFocused ? '#FF7A00' : 'rgba(0, 0, 0, 0.45)',
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute left-5 pointer-events-none select-none text-sm origin-top-left"
            >
              {label}
            </motion.label>
          )}
        </div>

        {/* Animated Validation Error Message */}
        <AnimatePresence>
          {error && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
              className="text-xs text-danger-custom mt-1.5 ml-4 font-sans font-medium"
            >
              {error}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

Input.displayName = 'Input'
