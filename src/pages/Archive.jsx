import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCps } from '../supabase/cpService'
import './Archive.css'

function Archive() {
  const [cps, setCps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCps()
  }, [])

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
    <div className="archive">
      <header className="archive-header">
        <h1>CP档案</h1>
      </header>

      <main className="archive-main">
        <div className="archive-actions">
          <Link to="/create-cp" className="btn btn-primary">
            + 创建新CP
          </Link>
        </div>

        <div className="cp-list">
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
                    更新于 {new Date(cp.updated_at).toLocaleDateString('zh-CN')}
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
