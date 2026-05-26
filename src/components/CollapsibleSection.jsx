import { useState } from 'react'
import './CollapsibleSection.css'

function CollapsibleSection({ 
  title, 
  defaultExpanded = false, 
  children,
  archiveCode = null
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="collapsible-section">
      <div 
        className={`collapsible-header ${isExpanded ? 'expanded' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="header-left">
          <h3 className="section-title">{title}</h3>
          {archiveCode && <span className="archive-code-inline">{archiveCode}</span>}
        </div>
        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </div>
      
      {isExpanded && (
        <div className="collapsible-content">
          {children}
        </div>
      )}
    </div>
  )
}

export default CollapsibleSection
