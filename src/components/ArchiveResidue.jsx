import React from 'react'
import './ArchiveResidue.css'

const ArchiveResidue = ({ 
  imageSrc, 
  position = 'bottom-right',
  opacity = 0.15,
  blur = 0,
  size = 'medium',
  crop = 'partial',
  grayscale = 100,
  contrast = 90,
  brightness = 100,
  saturate = 20,
  blendMode = 'multiply'
}) => {
  const getPositionStyles = () => {
    const positions = {
      'top-left': { top: '-15%', left: '-20%' },
      'top-right': { top: '-15%', right: '-20%' },
      'bottom-left': { bottom: '-15%', left: '-20%' },
      'bottom-right': { bottom: '-15%', right: '-20%' },
      'hero-edge-left': { top: '0', left: '-25%' },
      'hero-edge-right': { top: '0', right: '-25%' },
      'page-bottom': { bottom: '-25%', left: '50%', transform: 'translateX(-50%)' },
      'corner-tl': { top: '-10%', left: '-15%' },
      'corner-tr': { top: '-10%', right: '-15%' },
      'corner-bl': { bottom: '-10%', left: '-15%' },
      'corner-br': { bottom: '-10%', right: '-15%' },
      'right-edge': { top: '5%', right: '-30%' },
      'left-edge': { top: '5%', left: '-30%' },
      'ear-only': { top: '-30%', right: '-40%' },
      'leg-partial': { bottom: '-30%', left: '-40%' },
      'hair-fragment': { top: '10%', left: '-35%' },
      'right-main': { top: '0', right: '5%', height: '75vh' },
    }
    return positions[position] || positions['bottom-right']
  }

  const getSizeStyles = () => {
    const sizes = {
      'small': { width: '250px', height: '250px' },
      'medium': { width: '400px', height: '400px' },
      'large': { width: '600px', height: '600px' },
      'xlarge': { width: '800px', height: '800px' },
      'full-height': { width: 'auto', height: '75vh' },
    }
    return sizes[size] || sizes['medium']
  }

  const getCropStyles = () => {
    const crops = {
      'partial': { objectFit: 'cover', objectPosition: 'center' },
      'top-half': { objectFit: 'cover', objectPosition: 'top' },
      'bottom-half': { objectFit: 'cover', objectPosition: 'bottom' },
      'left-half': { objectFit: 'cover', objectPosition: 'left' },
      'right-half': { objectFit: 'cover', objectPosition: 'right' },
      'corner': { objectFit: 'cover', objectPosition: 'top right' },
      'top-left-corner': { objectFit: 'cover', objectPosition: 'top left' },
      'bottom-right-corner': { objectFit: 'cover', objectPosition: 'bottom right' },
    }
    return crops[crop] || crops['partial']
  }

  const getImageFilters = () => {
    return `grayscale(${grayscale}%) contrast(${contrast}%) brightness(${brightness}%) saturate(${saturate}%)`
  }

  return (
    <div 
      className="archive-residue-container"
      style={{
        ...getPositionStyles(),
        ...getSizeStyles(),
        opacity,
      }}
    >
      <img 
        src={imageSrc} 
        alt="" 
        className="archive-residue-image"
        style={{
          ...getCropStyles(),
          filter: getImageFilters(),
          mixBlendMode: blendMode,
        }}
      />
      <div className="archive-residue-grain"></div>
    </div>
  )
}

export default ArchiveResidue
