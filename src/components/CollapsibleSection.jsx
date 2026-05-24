import { useState } from 'react'
import './CollapsibleSection.css'

function CollapsibleSection({ 
  title, 
  defaultExpanded = false, 
  children,
  summary = null,
  filledCount = 0,
  totalFields = 0,
  tags = []
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const hasContent = filledCount > 0
  const completionRate = totalFields > 0 ? Math.round((filledCount / totalFields) * 100) : 0

  return (
    <div className="collapsible-section">
      <div 
        className={`collapsible-header ${isExpanded ? 'expanded' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="header-left">
          <h3 className="section-title">{title}</h3>
          {hasContent && (
            <div className="section-summary">
              <span className="filled-status">已填写：{filledCount}/{totalFields}项</span>
              {summary && <span className="content-summary">{summary}</span>}
              {tags.length > 0 && (
                <span className="tags-summary">包含：{tags.join(' / ')}</span>
              )}
            </div>
          )}
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
