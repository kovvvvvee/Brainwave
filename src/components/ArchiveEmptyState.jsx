import React from 'react'
import './ArchiveEmptyState.css'

const ArchiveEmptyState = ({ 
  icon = '✦',
  title = 'No items found',
  message = 'Create your first item to get started',
  action = null
}) => {
  return (
    <div className="archive-empty-state">
      <div className="archive-empty-icon">{icon}</div>
      <h3 className="archive-empty-title">{title}</h3>
      <p className="archive-empty-message">{message}</p>
      {action && <div className="archive-empty-action">{action}</div>}
    </div>
  )
}

export default ArchiveEmptyState
