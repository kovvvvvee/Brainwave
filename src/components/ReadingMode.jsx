import { useState, useRef, useEffect } from 'react'
import './ReadingMode.css'

function ReadingMode({ 
  content, 
  defaultExpanded = false,
  showPreview = true
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [needsTruncation, setNeedsTruncation] = useState(false)
  const containerRef = useRef(null)

  if (!content) {
    return <div className="reading-mode empty">无内容</div>
  }

  // Check if content needs truncation (more than 2 lines)
  useEffect(() => {
    if (containerRef.current) {
      const lineHeight = parseFloat(getComputedStyle(containerRef.current).lineHeight) || 24
      const twoLineHeight = lineHeight * 2
      setNeedsTruncation(containerRef.current.scrollHeight > twoLineHeight)
    }
  }, [content])

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="reading-mode" ref={containerRef}>
      <div className={`reading-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <p className="reading-text">
          {content}
        </p>
      </div>
      
      {showPreview && needsTruncation && (
        <button 
          className="reading-toggle"
          onClick={handleToggle}
        >
          {isExpanded ? '收起' : '展开'}
        </button>
      )}
    </div>
  )
}

export default ReadingMode
