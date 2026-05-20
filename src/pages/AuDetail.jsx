import { Link, useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getAuById, updateAu, deleteAu } from '../supabase/auService'
import { getInspirationsByAuId, deleteInspiration } from '../supabase/inspirationService'
import { getTagsForInspiration } from '../supabase/tagService'
import './AuDetail.css'

function AuDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [au, setAu] = useState(null)
  const [inspirations, setInspirations] = useState([])
  const [inspirationTags, setInspirationTags] = useState({})
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchAu()
    fetchInspirations()
  }, [id])

  const fetchAu = async () => {
    try {
      const data = await getAuById(id)
      setAu(data)
    } catch (error) {
      console.error('获取AU详情失败:', error)
    }
  }

  const fetchInspirations = async () => {
    try {
      const data = await getInspirationsByAuId(id)
      setInspirations(data)
      
      // Fetch tags for each inspiration
      const tagsMap = {}
      for (const inspiration of data) {
        const tags = await getTagsForInspiration(inspiration.id)
        tagsMap[inspiration.id] = tags
      }
      setInspirationTags(tagsMap)
    } catch (error) {
      console.error('获取灵感列表失败:', error)
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

  const handleEdit = () => {
    setEditName(au.name)
    setEditDescription(au.description || '')
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditName('')
    setEditDescription('')
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editName.trim()) {
      alert('AU名称不能为空')
      return
    }

    setIsSubmitting(true)
    try {
      await updateAu(id, { name: editName, description: editDescription })
      await fetchAu()
      setIsEditing(false)
      alert('AU更新成功')
    } catch (error) {
      console.error('更新AU失败:', error)
      alert('更新AU失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAu = async () => {
    if (!confirm('确认删除吗？删除AU将同时删除其所有灵感。')) return

    try {
      await deleteAu(id)
      navigate(`/cp/${au.cp_id}`)
    } catch (error) {
      console.error('删除AU失败:', error)
      alert('删除AU失败，请重试')
    }
  }


  if (loading) {
    return (
      <div className="au-detail">
        <div className="loading-state">
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  if (!au) {
    return (
      <div className="au-detail">
        <div className="empty-state">
          <p>未找到该AU</p>
          <Link to="/cp-list" className="btn btn-primary">返回CP列表</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="au-detail">
      <header className="page-header">
        <h1>AU详情</h1>
      </header>

      <main className="au-detail-main">
        <section className="au-info-section">
          <div className="section-header">
            <h2 className="section-title">AU信息</h2>
            <div className="section-actions">
              {!isEditing ? (
                <>
                  <button className="btn btn-secondary btn-small" onClick={handleEdit}>
                    完善设定
                  </button>
                  <button className="btn btn-danger btn-small" onClick={handleDeleteAu}>
                    删除
                  </button>
                </>
              ) : null}
            </div>
          </div>

          {isEditing ? (
            <form className="edit-form" onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label className="form-label">AU名称</label>
                <input
                  type="text"
                  className="form-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label className="form-label">AU描述</label>
                <textarea
                  className="form-input form-textarea"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? '保存中...' : '保存'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCancelEdit} disabled={isSubmitting}>
                  取消
                </button>
              </div>
            </form>
          ) : (
            <div className="au-info-card">
              <h3 className="au-name">{au.name}</h3>
              <p className="au-description">{au.description || '暂无描述'}</p>
              
              {au.world_notes && (
                <div className="au-field">
                  <span className="field-label">世界观档案：</span>
                  <span className="field-value">{au.world_notes}</span>
                </div>
              )}
              
              {au.relationship_state && (
                <div className="au-field">
                  <span className="field-label">世界里的他们：</span>
                  <span className="field-value">{au.relationship_state}</span>
                </div>
              )}
            </div>
          )}
        </section>


        <section className="inspiration-list-section">
          <h2 className="section-title">已归档灵感</h2>
          
          <div className="inspiration-list">
            {inspirations.length === 0 ? (
              <div className="inspiration-empty">
                <p>暂无灵感</p>
                <Link to="/" className="link">去首页添加灵感</Link>
              </div>
            ) : (
              inspirations.map((inspiration) => (
                <div key={inspiration.id} className={`inspiration-item ${inspiration.is_pinned ? 'inspiration-pinned' : ''}`}>
                  {inspiration.is_pinned && <span className="pin-indicator">📌</span>}
                  <Link to={`/inspiration/${inspiration.id}`} className="inspiration-content">
                    {inspiration.content}
                  </Link>
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
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => handleDeleteInspiration(inspiration.id)}
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default AuDetail
