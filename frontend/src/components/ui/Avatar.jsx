import React from 'react'
import { UserIcon } from '@heroicons/react/24/outline'

const Avatar = ({ 
  user, 
  size = 'md', 
  className = '', 
  showOnlineStatus = false,
  onClick 
}) => {
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-20 w-20 text-2xl'
  }

  const statusSizeClasses = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4',
    '2xl': 'h-5 w-5'
  }

  // Generate consistent color based on user name
  const getAvatarColor = (name) => {
    if (!name) return 'bg-gray-500'
    
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
    ]
    
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  const getInitials = (name) => {
    if (!name) return '?'
    const nameParts = name.split(' ')
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase()
    }
    return name.charAt(0).toUpperCase()
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <div 
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center overflow-hidden cursor-pointer transition-transform hover:scale-105 ${
          onClick ? 'cursor-pointer' : ''
        }`}
        onClick={onClick}
      >
        {user?.avatar?.url ? (
          <img
            src={user.avatar.url}
            alt={user.name || 'User'}
            className="h-full w-full object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        
        <div 
          className={`${sizeClasses[size]} rounded-full ${getAvatarColor(user?.name)} text-white font-medium flex items-center justify-center ${
            user?.avatar?.url ? 'hidden' : 'flex'
          }`}
        >
          {user?.name ? getInitials(user.name) : <UserIcon className="h-1/2 w-1/2" />}
        </div>
      </div>

      {/* Online status indicator */}
      {showOnlineStatus && (
        <div className={`absolute bottom-0 right-0 ${statusSizeClasses[size]} bg-green-500 border-2 border-white rounded-full`}></div>
      )}
    </div>
  )
}

export default Avatar
