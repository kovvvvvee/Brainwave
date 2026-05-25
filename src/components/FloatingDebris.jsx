import React from 'react'
import './FloatingDebris.css'

const FloatingDebris = () => {
  const debrisItems = [
    { symbol: '☾', type: 'moon' },
    { symbol: '◈', type: 'diamond' },
    { symbol: '╳', type: 'cross' },
    { symbol: '◯', type: 'circle' },
    { symbol: '▧', type: 'partial' },
    { symbol: '◇', type: 'rhombus' },
    { symbol: '⌘', type: 'command' },
    { symbol: '⎔', type: 'square' }
  ]

  const generateDebris = () => {
    return debrisItems.map((item, index) => ({
      id: index,
      ...item,
      top: 5 + Math.random() * 90,
      left: 5 + Math.random() * 90,
      rotation: Math.random() * 360,
      opacity: 0.08 + Math.random() * 0.04,
      fontSize: 7 + Math.random() * 8,
      offsetX: (Math.random() - 0.5) * 20,
      offsetY: (Math.random() - 0.5) * 20
    }))
  }

  const debris = generateDebris()

  return (
    <div className="floating-debris-layer">
      {debris.map(item => (
        <div
          key={item.id}
          className={`debris-item debris-${item.type}`}
          style={{
            top: `${item.top}%`,
            left: `${item.left}%`,
            transform: `rotate(${item.rotation}deg) translate(${item.offsetX}px, ${item.offsetY}px)`,
            opacity: item.opacity,
            fontSize: `${item.fontSize}px`
          }}
        >
          {item.symbol}
        </div>
      ))}
    </div>
  )
}

export default FloatingDebris
