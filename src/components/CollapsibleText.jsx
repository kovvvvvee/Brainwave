import { useState } from 'react'
import './CollapsibleText.css'

function CollapsibleText({ 
  content, 
  threshold = 150,
  defaultExpanded = false,
  embedded = false
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  if (!content) {
    return null
  }

  const needsTruncation = content.length > threshold
  const displayContent = isExpanded ? content : content.slice(0, threshold) + (needsTruncation ? '...' : '')

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className={`collapsible-text ${embedded ? 'embedded' : ''}`}>
      <div className={`collapsible-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        {displayContent}
      </div>
      
      {needsTruncation && (
        <button 
          className="collapsible-toggle"
          onClick={handleToggle}
        >
          {isExpanded ? '收起' : '展开'}
        </button>
      )}
    </div>
  )
}

export default CollapsibleText
