import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  padding = 'md',
  shadow = 'md',
  ...props 
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  }

  const baseClasses = 'bg-white rounded-lg border border-gray-200'
  const hoverClasses = hover ? 'hover:shadow-lg transition-shadow duration-200' : ''

  return (
    <motion.div
      whileHover={hover ? { y: -2 } : {}}
      transition={{ duration: 0.2 }}
      className={`${baseClasses} ${shadowClasses[shadow]} ${paddingClasses[padding]} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card
