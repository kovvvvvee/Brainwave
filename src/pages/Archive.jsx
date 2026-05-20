import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCps } from '../supabase/cpService'
import { getAusByCpId } from '../supabase/auService'
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
        <h1>档案</h1>
        <p className="subtitle">CP与AU世界档案</p>
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
                <div className="cp-header">
                  <div className="cp-info">
                    <h3 className="cp-name">{cp.name}</h3>
                    {cp.description && (
                      <p className="cp-description">{cp.description}</p>
                    )}
                  </div>
                  <div className="cp-actions">
                    <Link to={`/cp/${cp.id}`} className="btn btn-secondary btn-small">
                      查看详情
                    </Link>
                    <Link to={`/cp/${cp.id}/edit`} className="btn btn-secondary btn-small">
                      编辑
                    </Link>
                  </div>
                </div>

                <AuList cpId={cp.id} />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

function AuList({ cpId }) {
  const [aus, setAus] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAus()
  }, [cpId])

  const fetchAus = async () => {
    try {
      const data = await getAusByCpId(cpId)
      setAus(data)
    } catch (error) {
      console.error('获取AU列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="au-list-loading">加载AU列表...</div>
  }

  if (aus.length === 0) {
    return <div className="au-list-empty">暂无AU</div>
  }

  return (
    <div className="au-list">
      <h4 className="au-list-title">AU列表</h4>
      {aus.map((au) => (
        <div key={au.id} className="au-item">
          <div className="au-info">
            <h5 className="au-name">{au.name}</h5>
            {au.description && (
              <p className="au-description">{au.description}</p>
            )}
          </div>
          <div className="au-actions">
            <Link to={`/au/${au.id}`} className="btn btn-secondary btn-small">
              查看
            </Link>
            <Link to={`/au/${au.id}/edit`} className="btn btn-secondary btn-small">
              编辑
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Archive
