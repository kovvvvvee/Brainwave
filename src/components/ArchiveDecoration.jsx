import React from 'react'
import './ArchiveDecoration.css'

const ArchiveDecoration = () => {
  const residueSymbols = [  '⋆', 'LIGHT', '¯꒳¯', '(｡ì _ í｡)', 'ᗜ ֊ ᗜ', '( ⩌⤚⩌)', 'KOVE']
  
  const generateResidue = () => {
    const items = [];
    const totalCount = 10;       // 总元素数量（可调整）
    const minDistance = 12; // 两个元素之间的最小距离（百分比单位），数值越大要求越分散
  
    for (let i = 0; i < totalCount; i++) {
      const randomSymbol = residueSymbols[Math.floor(Math.random() * residueSymbols.length)];
      
      let top, left;
      let attempts = 0;
      let overlapping = true;
    
      while (overlapping && attempts < 200) {
        top = Math.random() * 100;
        left = Math.random() * 100;
        overlapping = false;
      
        // 检查是否与已有元素靠得太近
        for (let j = 0; j < items.length; j++) {
          const dx = Math.abs(items[j].left - left);
          const dy = Math.abs(items[j].top - top);
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < minDistance) {
            overlapping = true;
            break;
          }
        }
        attempts++;
     }
    
     items.push({
       id: i,
       symbol: randomSymbol,
       top: top,
       left: left,
       rotation: Math.random() * 10,
       opacity: 0.25 + Math.random() * 0.5,
       fontSize: 10 + Math.random() * 5
     });  
   }
  
   return items;
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
