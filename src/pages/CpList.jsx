import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { getCps } from '../supabase/cpService'
import ArchiveDecoration from '../components/ArchiveDecoration'
import ArchiveResidue from '../components/ArchiveResidue'
import './CpList.css'

function CpList() {
  const location = useLocation();
  const [cps, setCps] = useState([])
  const [loading, setLoading] = useState(true)
  const cpGridRef = useRef(null)

  useEffect(() => {
    fetchCps()
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
              <div key={cp.id} className="cp-item">
                <div className="cp-main">
                  <h3 className="cp-name">{cp.name}</h3>
                  {cp.core_one_liner && (
                    <p className="cp-subtitle">{cp.core_one_liner}</p>
                  )}
                </div>
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
