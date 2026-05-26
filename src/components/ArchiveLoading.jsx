import React from 'react'
import './ArchiveLoading.css'

const ArchiveLoading = ({ message = 'Loading archive...' }) => {
  return (
    <div className="archive-loading">
      <div className="archive-loading-content">
        <div className="archive-loading-scan">
          <div className="scan-line"></div>
        </div>
        <p className="archive-loading-message">{message}</p>
        <div className="archive-loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  )
}

export default ArchiveLoading
