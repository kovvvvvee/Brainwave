import React from 'react'
import './ArchiveDecoration.css'

const ArchiveDecoration = () => {
  const residueSymbols = ['✦', '☾', '⋆', '╱╱', 'ARCHIVE', 'SCAN_04', 'FILE_XX', '001-A', '05/24', 'BRAINWAVE', 'PRINT COPY']
  
  const generateResidue = () => {
    return residueSymbols.map((symbol, index) => ({
      id: index,
      symbol,
      top: Math.random() * 100,
      left: Math.random() * 100,
      rotation: Math.random() * 360,
      opacity: 0.08 + Math.random() * 0.04,
      fontSize: 9 + Math.random() * 6
    }))
  }

  const residues = generateResidue()

  return (
    <div className="archive-decoration-layer">
      {/* Background residue symbols */}
      {residues.map(residue => (
        <div
          key={residue.id}
          className="archive-residue"
          data-opacity={residue.opacity}
          style={{
            top: `${residue.top}%`,
            left: `${residue.left}%`,
            transform: `rotate(${residue.rotation}deg)`,
            opacity: residue.opacity,
            fontSize: `${residue.fontSize}px`
          }}
        >
          {residue.symbol}
        </div>
      ))}

      {/* Corner crop marks */}
      <div className="crop-mark crop-mark-tl">┈</div>
      <div className="crop-mark crop-mark-tr">┈</div>
      <div className="crop-mark crop-mark-bl">┈</div>
      <div className="crop-mark crop-mark-br">┈</div>

      {/* Scanner noise overlay */}
      <div className="scanner-noise"></div>
      
      {/* Paper grain overlay */}
      <div className="paper-grain"></div>
    </div>
  )
}

export default ArchiveDecoration
