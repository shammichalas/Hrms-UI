import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

interface SplitHeadingProps {
  text: string
  className?: string
}

export const SplitHeading: React.FC<SplitHeadingProps> = ({ text, className }) => {
  const words = text.split(' ')

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const wordVariants = {
    hidden: {
      y: 40,
      scale: 0.95,
      opacity: 0,
      filter: 'blur(10px)'
    },
    visible: {
      y: 0,
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 1.1,
        ease: [0.19, 1, 0.22, 1] as const // Expo.Out
      }
    }
  }

  return (
    <motion.h1
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      className={cn(
        'font-display font-black uppercase text-text-primary tracking-[-0.06em] leading-[0.82] select-none',
        'text-[clamp(40px,9vw,64px)] md:text-[clamp(60px,10vw,110px)] lg:text-[clamp(75px,11vw,150px)]',
        'flex flex-wrap justify-center gap-x-[0.22em] gap-y-[0.05em] text-center max-w-[95%] mx-auto',
        className
      )}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden py-3 -my-3">
          <motion.span
            variants={wordVariants}
            className="inline-block origin-bottom"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  )
}
export default SplitHeading
