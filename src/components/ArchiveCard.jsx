import React from 'react'
import './ArchiveCard.css'

const ArchiveCard = ({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'default'
}) => {
  const getPaddingClass = () => {
    const paddings = {
      'default': 'archive-card-padding-default',
      'lg': 'archive-card-padding-lg',
      'xl': 'archive-card-padding-xl',
      'none': 'archive-card-padding-none'
    }
    return paddings[padding] || paddings['default']
  }

  return (
    <div className={`archive-card archive-card-${variant} ${getPaddingClass()} ${className}`}>
      {children}
    </div>
  )
}

export default ArchiveCard
