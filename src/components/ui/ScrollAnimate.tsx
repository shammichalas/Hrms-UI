import React, { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface ScrollAnimateProps {
  children: React.ReactNode
  className?: string
  delay?: number
  threshold?: number
}

export const ScrollAnimate: React.FC<ScrollAnimateProps> = ({
  children,
  className,
  delay = 0,
  threshold = 0.2 // Using 0.2 to ensure animation runs smoothly across mobile, tablet and desktop
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          if (ref.current) {
            observer.unobserve(ref.current)
          }
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -10% 0px' // Offset to trigger slightly before/after crossing
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [threshold])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25, scale: 0.97 }}
      animate={
        isIntersecting
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 25, scale: 0.97 }
      }
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 0.61, 0.36, 1] // Custom luxury cubic-bezier easing requested
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
