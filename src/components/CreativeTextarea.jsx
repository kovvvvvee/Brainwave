import { useEffect, useRef } from 'react'
import './CreativeTextarea.css'

function CreativeTextarea({ 
  value, 
  onChange, 
  placeholder, 
  disabled = false,
  minRows = 3,
  className = ''
}) {
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [value])

  const handleChange = (e) => {
    onChange(e.target.value)
  }

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`creative-textarea ${className}`}
      rows={minRows}
    />
  )
}

export default CreativeTextarea
