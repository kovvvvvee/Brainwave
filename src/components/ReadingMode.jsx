import { useState, useRef } from 'react'
import './ReadingMode.css'

function ReadingMode({ 
  content, 
  defaultExpanded = false,
  showPreview = true,
  previewLines = 3,
  maxHeight = null,
  shortThreshold = 120, // characters
  longThreshold = 500 // characters
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const containerRef = useRef(null)
  const scrollPositionRef = useRef(0)

  if (!content) {
    return <div className="reading-mode empty">无内容</div>
  }

  const contentLength = content.length
  const isShort = contentLength <= shortThreshold
  const isLong = contentLength >= longThreshold

  // Short content: display fully without any UI elements
  if (isShort) {
    return (
      <div className="reading-mode short">
        <p className="reading-text reading-text-simple">{content}</p>
      </div>
    )
  }

  // Medium/Long content: show preview with expand toggle
  const lines = content.split('\n')
  const previewContent = lines.slice(0, previewLines).join('\n')
  const hasMoreContent = lines.length > previewLines || contentLength > shortThreshold

  const handleToggle = () => {
    const wasExpanded = isExpanded
    setIsExpanded(!isExpanded)
    
    // After collapsing, scroll to card top
    setTimeout(() => {
      if (wasExpanded && containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 0)
  }

  return (
    <div className={`reading-mode ${isLong ? 'long' : 'medium'}`} ref={containerRef}>
      <div 
        className={`reading-content ${isExpanded ? 'expanded' : 'collapsed'}`}
        style={maxHeight && !isExpanded ? { maxHeight: `${maxHeight}px`, overflow: 'hidden' } : {}}
      >
        <p className={`reading-text ${isLong ? 'reading-text-full' : 'reading-text-medium'}`}>
          {isExpanded || !showPreview ? content : previewContent}
          {!isExpanded && showPreview && hasMoreContent && '...'}
        </p>
      </div>
      
      {showPreview && hasMoreContent && (
        <button 
          className={`reading-toggle ${isLong ? 'toggle-full' : 'toggle-simple'}`}
          onClick={handleToggle}
        >
          {isExpanded ? '收起' : '显示更多'}
        </button>
      )}
    </div>
  )
}

export default ReadingMode
