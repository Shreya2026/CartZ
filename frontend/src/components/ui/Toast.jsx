import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

const Toast = ({ 
  message, 
  type = 'info', 
  isVisible = false, 
  onClose,
  duration = 5000 
}) => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon
  }

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  const Icon = icons[type]

  React.useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose && onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          className="fixed top-4 right-4 z-50 max-w-sm w-full"
        >
          <div className={`rounded-lg border p-4 shadow-lg ${colors[type]}`}>
            <div className="flex items-start">
              <Icon className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">{message}</p>
              </div>
              <button
                onClick={onClose}
                className="ml-3 flex-shrink-0 hover:opacity-70 transition-opacity"
              >
                <XCircleIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast
