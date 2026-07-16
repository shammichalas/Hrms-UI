import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '../../utils/cn'

interface CardProps extends Omit<React.ComponentPropsWithoutRef<typeof motion.div>, 'children'> {
  children: React.ReactNode
  glow?: boolean
  hoverLift?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glow = true,
  hoverLift = true,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  // Motion values for tracking mouse cursor coordinate inside the card
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring animations to smooth out coordinate tracking
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 })

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    mouseX.set(x)
    mouseY.set(y)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative overflow-hidden rounded-card bg-card-bg border border-border-custom backdrop-blur-xl transition-colors duration-500 shadow-premium',
        isHovered ? 'bg-card-hover border-white/12' : '',
        className
      )}
      {...(hoverLift
        ? {
            whileHover: { y: -6 },
            transition: { type: 'spring', stiffness: 400, damping: 30 }
          }
        : {})}
      {...props}
    >
      {/* Premium Spotlight Orange Glow following the mouse cursor */}
      {glow && isHovered && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-card opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(300px circle at ${springX.get()}px ${springY.get()}px, rgba(255, 122, 0, 0.08), transparent 80%)`,
            opacity: isHovered ? 1 : 0
          }}
        />
      )}
      
      {/* Decorative Border Highlights */}
      {glow && isHovered && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-card opacity-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(120px circle at ${springX.get()}px ${springY.get()}px, rgba(255, 122, 0, 0.18), transparent 80%)`,
            opacity: isHovered ? 1 : 0,
            maskImage: 'linear-gradient(black, black)',
            WebkitMaskImage: 'linear-gradient(black, black)',
            // Trick to paint only the border area
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
          }}
        />
      )}

      <div className="relative z-10 p-6 h-full flex flex-col">{children}</div>
    </motion.div>
  )
}

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div className={cn('flex flex-col space-y-1.5 mb-4', className)} {...props} />
)

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => (
  <h3
    className={cn('text-lg font-bold leading-none tracking-tight text-text-primary', className)}
    {...props}
  />
)
export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  ...props
}) => (
  <p className={cn('text-sm text-text-secondary', className)} {...props} />
)

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn('flex-1', className)} {...props} />

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div className={cn('flex items-center mt-6 pt-4 border-t border-white/[0.05]', className)} {...props} />
)
