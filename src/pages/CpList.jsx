import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { getCps } from '../supabase/cpService'
import ArchiveDecoration from '../components/ArchiveDecoration'
import ArchiveResidue from '../components/ArchiveResidue'
import './CpList.css'

function CpList() {
  const [cps, setCps] = useState([])
  const [loading, setLoading] = useState(true)
  const cpGridRef = useRef(null)

  useEffect(() => {
    fetchCps()
  }, [])

  useEffect(() => {
    // Force layout recalculation after DOM is fully painted
    const recalculateLayout = () => {
      // Wait for all components to finish rendering
      requestAnimationFrame(() => {
        // First pass: let browser paint
        requestAnimationFrame(() => {
          // Force reflow by reading layout
          document.body.offsetHeight

          // Second pass: after paint is complete
          setTimeout(() => {
            // Force reflow again
            document.body.offsetHeight

            // Trigger resize event for any listeners
            window.dispatchEvent(new Event('resize'))

            // Force re-measure all card heights
            const cards = document.querySelectorAll('.cp-card')
            cards.forEach(card => {
              card.style.height = 'auto'
              const height = card.offsetHeight
              card.style.height = height + 'px'
            })

            // Force re-measure archive decoration symbols
            const residues = document.querySelectorAll('.archive-residue')
            residues.forEach(residue => {
              residue.style.opacity = '0'
              setTimeout(() => {
                residue.style.opacity = residue.dataset.opacity || '0.1'
              }, 10)
            })

            // Final layout pass
            setTimeout(() => {
              document.body.offsetHeight
              window.dispatchEvent(new Event('resize'))
            }, 50)
          }, 150)
        })
      })
    }

    if (!loading && cps.length > 0) {
      recalculateLayout()
    }
  }, [cps, loading])

  const fetchCps = async () => {
    try {
      const data = await getCps()
      setCps(data)
    } catch (error) {
      console.error('获取CP列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cp-list">
      <ArchiveDecoration />
      
      {/* Background illustration - rabbit-eared girl at left edge */}
      <ArchiveResidue 
        imageSrc="/assets/rabbit-girl-ascii.png"
        position="right-main"
        opacity={0.15}
        size="full-height"
        crop="top-right-corner"
        grayscale={100}
        contrast={90}
        brightness={100}
        saturate={20}
      />
      
      {/* Background illustration - partial at bottom right */}
      <ArchiveResidue 
        imageSrc="/assets/rabbit-girl-ascii.png"
        position="right-main"
        opacity={0.15}
        size="full-height"
        crop="top-right-corner"
        grayscale={100}
        contrast={90}
        brightness={100}
        saturate={20}
      />
      
      <header className="page-header">
        <h1>CP列表</h1>
        <Link to="/create-cp" className="btn btn-primary">创建新CP</Link>
      </header>

      <main className="cp-list-main">
        <div className="search-bar">
          <input type="text" placeholder="搜索CP..." className="search-input" />
        </div>

        {loading ? (
          <div className="loading-state">
            <p>加载中...</p>
          </div>
        ) : (
          <div className="cp-grid" ref={cpGridRef}>
            {cps.map(cp => (
              <div key={cp.id} className="cp-card">
                <h3 className="cp-name">{cp.name}</h3>
                {cp.core_one_liner && (
                  <p className="cp-subtitle">{cp.core_one_liner}</p>
                )}
                <div className="cp-actions">
                  <Link to={`/cp/${cp.id}`} className="btn btn-small">查看详情</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && cps.length === 0 && (
          <div className="empty-state">
            <p>暂无CP，点击上方按钮创建</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default CpList
