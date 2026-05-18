import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getAllUncategorizedInspirations, deleteInspiration, toggleFavorite, togglePin } from '../supabase/inspirationService'
import { getTagsForInspiration } from '../supabase/tagService'
import './UncategorizedInspirations.css'

function UncategorizedInspirations() {
  const [inspirations, setInspirations] = useState([])
  const [inspirationTags, setInspirationTags] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInspirations()
  }, [])

  const fetchInspirations = async () => {
    try {
      const data = await getAllUncategorizedInspirations()
      setInspirations(data)
      
      // Fetch tags for each inspiration
      const tagsMap = {}
      for (const inspiration of data) {
        const tags = await getTagsForInspiration(inspiration.id)
        tagsMap[inspiration.id] = tags
      }
      setInspirationTags(tagsMap)
    } catch (error) {
      console.error('获取未分类灵感失败:', error)
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

  const handleToggleFavorite = async (inspirationId) => {
    try {
      await toggleFavorite(inspirationId)
      fetchInspirations()
    } catch (error) {
      console.error('切换星标失败:', error)
      alert('切换星标失败，请重试')
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
      <header className="page-header">
        <Link to="/" className="back-link">← 返回首页</Link>
        <h1>未分类灵感</h1>
        <p className="page-description">创作暂存区 · 灵感收纳箱</p>
      </header>

      <main className="inspirations-main">
        <div className="inspiration-list">
          {inspirations.length === 0 ? (
            <div className="inspiration-empty">
              <p>暂无未分类灵感</p>
              <p className="empty-hint">在首页记录灵感时，如果不选择CP和AU，灵感会自动归入这里</p>
              <Link to="/" className="btn btn-primary">去记录灵感</Link>
            </div>
          ) : (
            inspirations.map((inspiration) => (
              <div key={inspiration.id} className={`inspiration-item ${inspiration.is_pinned ? 'inspiration-pinned' : ''}`}>
                <div className="inspiration-header">
                  {inspiration.is_pinned && <span className="pin-indicator">📌</span>}
                  <Link to={`/inspiration/${inspiration.id}`} className="inspiration-content">
                    {inspiration.content}
                  </Link>
                </div>
                {inspirationTags[inspiration.id] && inspirationTags[inspiration.id].length > 0 && (
                  <div className="inspiration-tags">
                    {inspirationTags[inspiration.id].map(tag => (
                      <span key={tag.id} className="tag-badge">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
                <div className="inspiration-footer">
                  <p className="inspiration-time">
                    {new Date(inspiration.created_at).toLocaleString('zh-CN')}
                  </p>
                  <div className="inspiration-actions">
                    <button
                      className="inspiration-action-btn"
                      onClick={() => handleTogglePin(inspiration.id)}
                      title={inspiration.is_pinned ? '取消置顶' : '置顶'}
                    >
                      {inspiration.is_pinned ? '📌' : '📍'}
                    </button>
                    <button
                      className="inspiration-action-btn"
                      onClick={() => handleToggleFavorite(inspiration.id)}
                      title={inspiration.is_favorite ? '取消星标' : '星标'}
                    >
                      {inspiration.is_favorite ? '★' : '☆'}
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
