import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getCps } from '../supabase/cpService'
import ArchiveDecoration from '../components/ArchiveDecoration'
import ArchiveResidue from '../components/ArchiveResidue'
import './Archive.css'

function Archive() {
  const [cps, setCps] = useState([])
  const [loading, setLoading] = useState(true)
  const [layoutKey, setLayoutKey] = useState(0)
  const location = useLocation()
  const cpListRef = useRef(null)

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
            const cards = document.querySelectorAll('.cp-item')
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
  }, [cps, loading, layoutKey])

  // Force remount when returning to archive page
  useEffect(() => {
    if (location.pathname === '/cp-list' || location.pathname === '/archive') {
      setLayoutKey(prev => prev + 1)
    }
  }, [location.pathname])

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

  if (loading) {
    return (
      <div className="archive">
        <div className="loading-state">
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="archive" key={layoutKey}>
      <ArchiveDecoration />
      
      {/* Background illustration - rabbit-eared girl at right edge */}
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
      
      {/* Background illustration - partial at bottom left */}
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
      
      <header className="archive-header">
        <h1>CP档案</h1>
      </header>

      <main className="archive-main">
        <div className="archive-actions">
          <Link to="/create-cp" className="btn btn-primary">
            + 创建新CP
          </Link>
        </div>

        <div className="cp-list" key={`cp-list-${layoutKey}`} ref={cpListRef}>
          {cps.length === 0 ? (
            <div className="archive-empty">
              <p>暂无CP档案</p>
              <Link to="/create-cp" className="btn btn-secondary">
                创建第一个CP
              </Link>
            </div>
          ) : (
            cps.map((cp) => (
              <div key={cp.id} className="cp-item">
                <div className="cp-main">
                  <h3 className="cp-name">{cp.name}</h3>
                  {cp.core_one_liner && (
                    <p className="cp-subtitle">{cp.core_one_liner}</p>
                  )}
                  <p className="cp-date">
                  </p>
                </div>
                <div className="cp-actions">
                  <Link to={`/cp/${cp.id}`} className="btn btn-primary btn-small">
                    进入档案
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default Archive
