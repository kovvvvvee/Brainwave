import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCps } from '../supabase/cpService'
import './CpList.css'

function CpList() {
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

  return (
    <div className="cp-list">
      <header className="page-header">
        <Link to="/" className="back-link">← 返回首页</Link>
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
          <div className="cp-grid">
            {cps.map(cp => (
              <div key={cp.id} className="cp-card">
                <h3 className="cp-name">{cp.name}</h3>
                <p className="cp-description">{cp.description}</p>
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
