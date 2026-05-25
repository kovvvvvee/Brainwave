import React from 'react'
import './ArchiveSymbol.css'

const ArchiveSymbol = ({ 
  symbol = '✦', 
  position = 'top-right',
  size = 'small',
  variant = 'normal'
}) => {
  const getPositionClass = () => {
    switch (position) {
      case 'top-left': return 'archive-symbol-tl'
      case 'top-right': return 'archive-symbol-tr'
      case 'bottom-left': return 'archive-symbol-bl'
      case 'bottom-right': return 'archive-symbol-br'
      case 'top-center': return 'archive-symbol-tc'
      case 'bottom-center': return 'archive-symbol-bc'
      default: return 'archive-symbol-tr'
    }
  }

  const getSizeClass = () => {
    switch (size) {
      case 'tiny': return 'archive-symbol-tiny'
      case 'small': return 'archive-symbol-small'
      case 'medium': return 'archive-symbol-medium'
      default: return 'archive-symbol-small'
    }
  }

  const getVariantClass = () => {
    switch (variant) {
      case 'key': return 'archive-symbol-key'
      case 'faint': return 'archive-symbol-faint'
      default: return 'archive-symbol-normal'
    }
  }

  return (
    <span className={`archive-symbol ${getPositionClass()} ${getSizeClass()} ${getVariantClass()}`}>
      {symbol}
    </span>
  )
}

export default ArchiveSymbol
