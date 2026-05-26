import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getAllInspirations, deleteInspiration, togglePin } from '../supabase/inspirationService'
import { getCpById } from '../supabase/cpService'
import { getAuById } from '../supabase/auService'
import ArchiveResidue from '../components/ArchiveResidue'
import './UncategorizedInspirations.css'

function UncategorizedInspirations() {
  const [inspirations, setInspirations] = useState([])
  const [cpNames, setCpNames] = useState({})
  const [auNames, setAuNames] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInspirations()
  }, [])

  const fetchInspirations = async () => {
    try {
      const data = await getAllInspirations()
      setInspirations(data)
      
      // Fetch CP names for inspirations that have cp_id
      const cpMap = {}
      const auMap = {}
      for (const inspiration of data) {
        if (inspiration.cp_id && !cpMap[inspiration.cp_id]) {
          try {
            const cp = await getCpById(inspiration.cp_id)
            cpMap[inspiration.cp_id] = cp.name
          } catch (error) {
            console.error('获取CP名称失败:', error)
          }
        }
        if (inspiration.au_id && !auMap[inspiration.au_id]) {
          try {
            const au = await getAuById(inspiration.au_id)
            auMap[inspiration.au_id] = au.name
          } catch (error) {
            console.error('获取AU名称失败:', error)
          }
        }
      }
      setCpNames(cpMap)
      setAuNames(auMap)
    } catch (error) {
      console.error('获取灵感失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteInspiration = async (inspirationId) => {
    if (!confirm('确定要删除这条灵感吗？')) return

    try {
      await deleteInspiration(inspirationId)
      fetchInspirations()
    } catch (error) {
      console.error('删除灵感失败:', error)
      alert('删除灵感失败，请重试')
    }
  }


  const handleTogglePin = async (inspirationId) => {
    try {
      await togglePin(inspirationId)
      fetchInspirations()
    } catch (error) {
      console.error('切换置顶失败:', error)
      alert('切换置顶失败，请重试')
    }
  }

  if (loading) {
    return (
      <div className="uncategorized-inspirations">
        <div className="loading-state">
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="uncategorized-inspirations">
      {/* Background illustration - character silhouette at edge */}
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
      
      <h1 className="page-title">灵感</h1>

      <main className="inspirations-main">
        <div className="inspiration-list">
          {inspirations.length === 0 ? (
            <div className="inspiration-empty">
              <p>这里会保存暂时还没有归属的灵感。</p>
            </div>
          ) : (
            inspirations.map((inspiration) => (
              <div key={inspiration.id} className={`inspiration-item ${inspiration.is_pinned ? 'inspiration-pinned' : ''}`}>
                <div className="inspiration-meta">
                  {inspiration.is_pinned && <span className="pin-indicator">📌</span>}
                  <span className="meta-text">
                    {inspiration.cp_id ? `来自：${cpNames[inspiration.cp_id] || '未知CP'}` : '未归档'}
                  </span>
                  {inspiration.au_id && (
                    <span className="au-tag">{auNames[inspiration.au_id] || '未知AU'}</span>
                  )}
                </div>
                <Link to={`/inspiration/${inspiration.id}`} className="inspiration-content">
                  {inspiration.content}
                </Link>
                <div className="inspiration-footer">
                  <span className="inspiration-time">
                    {new Date(inspiration.created_at).toLocaleString('zh-CN')}
                  </span>
                  <div className="inspiration-actions">
                    <button
                      className="inspiration-action-btn"
                      onClick={() => handleTogglePin(inspiration.id)}
                      title={inspiration.is_pinned ? '取消置顶' : '置顶'}
                    >
                      {inspiration.is_pinned ? '📌' : '📍'}
                    </button>
                    <button
                      className="inspiration-action-btn delete-btn"
                      onClick={() => handleDeleteInspiration(inspiration.id)}
                      title="删除"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default UncategorizedInspirations
