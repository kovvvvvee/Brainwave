import { Link, useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getInspirationById, updateInspiration, deleteInspiration, toggleFavorite, togglePin } from '../supabase/inspirationService'
import { getCpById } from '../supabase/cpService'
import { getAuById } from '../supabase/auService'
import { getExpansionsByInspirationId, createExpansion, updateExpansion } from '../supabase/expansionService'
import { expandInspiration } from '../supabase/aiService'
import './InspirationDetail.css'

function InspirationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [inspiration, setInspiration] = useState(null)
  const [cp, setCp] = useState(null)
  const [au, setAu] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showExpansionModal, setShowExpansionModal] = useState(false)
  const [expansionStyle, setExpansionStyle] = useState('克制')
  const [expansionLength, setExpansionLength] = useState('短扩写')
  const [expansionPov, setExpansionPov] = useState('第三人称')
  const [isExpanding, setIsExpanding] = useState(false)
  const [expansions, setExpansions] = useState([])
  const [editingExpansionId, setEditingExpansionId] = useState(null)
  const [editingExpansionContent, setEditingExpansionContent] = useState('')
  const [isSavingExpansion, setIsSavingExpansion] = useState(false)

  useEffect(() => {
    fetchInspiration()
    fetchExpansions()
  }, [id])

  const fetchInspiration = async () => {
    try {
      const data = await getInspirationById(id)
      setInspiration(data)
      setEditContent(data.content)

      // Fetch CP info
      if (data.cp_id) {
        try {
          const cpData = await getCpById(data.cp_id)
          setCp(cpData)
        } catch (cpError) {
          console.error('获取CP信息失败:', cpError)
        }
      }

      // Fetch AU info if exists
      if (data.au_id) {
        try {
          const auData = await getAuById(data.au_id)
          setAu(auData)
        } catch (auError) {
          console.error('获取AU信息失败:', auError)
        }
      }
    } catch (error) {
      console.error('获取灵感详情失败:', error.message || error)
      setInspiration(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchExpansions = async () => {
    try {
      const data = await getExpansionsByInspirationId(id)
      setExpansions(data)
    } catch (error) {
      console.error('获取扩写历史失败:', error)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditContent(inspiration.content)
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editContent.trim()) {
      alert('灵感内容不能为空')
      return
    }

    setIsSubmitting(true)
    try {
      await updateInspiration(id, {
        cp_id: inspiration.cp_id,
        au_id: inspiration.au_id,
        content: editContent
      })
      await fetchInspiration()
      setIsEditing(false)
      alert('灵感更新成功')
    } catch (error) {
      console.error('更新灵感失败:', error)
      alert('更新灵感失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('确定要删除这条灵感吗？')) return

    try {
      await deleteInspiration(id)
      // Navigate back to CP or AU detail page
      if (au) {
        navigate(`/au/${au.id}`)
      } else if (cp) {
        navigate(`/cp/${cp.id}`)
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error('删除灵感失败:', error)
      alert('删除灵感失败，请重试')
    }
  }

  const handleToggleFavorite = async () => {
    try {
      const updated = await toggleFavorite(inspiration.id)
      setInspiration({ ...inspiration, is_favorite: updated.is_favorite })
    } catch (error) {
      console.error('切换星标失败:', error)
      alert('切换星标失败，请重试')
    }
  }

  const handleTogglePin = async () => {
    try {
      const updated = await togglePin(inspiration.id)
      setInspiration({ ...inspiration, is_pinned: updated.is_pinned, pinned_at: updated.pinned_at })
    } catch (error) {
      console.error('切换置顶失败:', error)
      alert('切换置顶失败，请重试')
    }
  }

  const handleExpansion = async (e) => {
    e.preventDefault()
    setIsExpanding(true)
    try {
      const expandedContent = await expandInspiration(
        inspiration.content,
        cp,
        au,
        { style: expansionStyle, length: expansionLength, pov: expansionPov }
      )
      
      const newExpansion = await createExpansion({
        inspirationId: id,
        content: expandedContent,
        style: expansionStyle,
        length: expansionLength,
        pov: expansionPov
      })
      
      await fetchExpansions()
      setShowExpansionModal(false)
      alert('AI扩写成功！')
    } catch (error) {
      console.error('AI扩写失败:', error)
      alert('AI扩写失败，请重试')
    } finally {
      setIsExpanding(false)
    }
  }

  const handleCopyExpansion = (content) => {
    navigator.clipboard.writeText(content)
    alert('已复制到剪贴板')
  }

  const handleEditExpansion = (expansion) => {
    setEditingExpansionId(expansion.id)
    setEditingExpansionContent(expansion.content)
  }

  const handleSaveExpansionEdit = async (expansionId) => {
    if (!editingExpansionContent.trim()) {
      alert('扩写内容不能为空')
      return
    }

    setIsSavingExpansion(true)
    try {
      await updateExpansion(expansionId, editingExpansionContent)
      await fetchExpansions()
      setEditingExpansionId(null)
      setEditingExpansionContent('')
      alert('扩写内容已更新')
    } catch (error) {
      console.error('更新扩写失败:', error)
      alert('更新扩写失败，请重试')
    } finally {
      setIsSavingExpansion(false)
    }
  }

  const handleCancelExpansionEdit = () => {
    setEditingExpansionId(null)
    setEditingExpansionContent('')
  }

  const formatVersionNumber = (index, total) => {
    const versionNum = total - index
    return `版本 ${String(versionNum).padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="inspiration-detail">
        <div className="loading-state">
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  if (!inspiration) {
    return (
      <div className="inspiration-detail">
        <div className="empty-state">
          <p>未找到该灵感</p>
          <Link to="/" className="btn btn-primary">返回首页</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="inspiration-detail">
      <header className="page-header">
        {/* 弱化显示归属信息 */}
        {(cp || au) && (
          <div className="breadcrumb">
            {cp && <Link to={`/cp/${cp.id}`} className="breadcrumb-link">{cp.name}</Link>}
            {cp && au && <span className="breadcrumb-separator"> → </span>}
            {au && <Link to={`/au/${au.id}`} className="breadcrumb-link">{au.name}</Link>}
          </div>
        )}
        <div className="header-actions">
          {!isEditing && (
            <>
              <button 
                className={`btn btn-icon ${inspiration.is_favorite ? 'btn-favorite-active' : 'btn-favorite'}`} 
                onClick={handleToggleFavorite}
                title={inspiration.is_favorite ? '取消星标' : '添加星标'}
              >
                ★
              </button>
              <button 
                className={`btn btn-icon ${inspiration.is_pinned ? 'btn-pin-active' : 'btn-pin'}`} 
                onClick={handleTogglePin}
                title={inspiration.is_pinned ? '取消置顶' : '置顶'}
              >
                📌
              </button>
              <button className="btn btn-expansion btn-small" onClick={() => setShowExpansionModal(true)}>
                AI扩写
              </button>
              <button className="btn btn-secondary btn-small" onClick={handleEdit}>
                编辑
              </button>
              <button className="btn btn-delete btn-small" onClick={handleDelete}>
                删除
              </button>
            </>
          )}
        </div>
      </header>

      <main className="inspiration-detail-main">
        <section className="inspiration-content-section">
          {isEditing ? (
            <form className="edit-form" onSubmit={handleSaveEdit}>
              <textarea
                className="inspiration-textarea"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={12}
                disabled={isSubmitting}
              />
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
            <div className="inspiration-content-display">
              <p className="inspiration-text">{inspiration.content}</p>
              <p className="inspiration-time">
                创建于 {new Date(inspiration.created_at).toLocaleString('zh-CN')}
              </p>
            </div>
          )}
        </section>

        {/* AI扩写功能 */}
        <section className="expansion-section">
          <h2 className="section-title">扩写草稿</h2>
          {expansions.length === 0 ? (
            <div className="feature-placeholder">
              <p>暂无草稿，点击上方"AI扩写"开始创作</p>
            </div>
          ) : (
            <div className="draft-list">
              {expansions.map((expansion, index) => (
                <div key={expansion.id} className="draft-item">
                  <div className="draft-header">
                    <span className="draft-version">{formatVersionNumber(index, expansions.length)}</span>
                    <span className="draft-time">
                      {new Date(expansion.created_at).toLocaleString('zh-CN')}
                    </span>
                    <div className="draft-actions">
                      {editingExpansionId === expansion.id ? (
                        <>
                          <button 
                            className="draft-action-btn draft-save-btn"
                            onClick={() => handleSaveExpansionEdit(expansion.id)}
                            title="保存"
                            disabled={isSavingExpansion}
                          >
                            {isSavingExpansion ? '保存中...' : '✓'}
                          </button>
                          <button 
                            className="draft-action-btn draft-cancel-btn"
                            onClick={handleCancelExpansionEdit}
                            title="取消"
                            disabled={isSavingExpansion}
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            className="draft-action-btn"
                            onClick={() => handleCopyExpansion(expansion.content)}
                            title="复制"
                          >
                            📋
                          </button>
                          <button 
                            className="draft-action-btn"
                            onClick={() => handleEditExpansion(expansion)}
                            title="编辑"
                          >
                            ✏️
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="draft-params">
                    <span className="draft-param">{expansion.style}</span>
                    <span className="draft-param">·</span>
                    <span className="draft-param">{expansion.length}</span>
                    <span className="draft-param">·</span>
                    <span className="draft-param">{expansion.pov}</span>
                  </div>
                  <div className="draft-content">
                    {editingExpansionId === expansion.id ? (
                      <textarea
                        className="expansion-edit-textarea"
                        value={editingExpansionContent}
                        onChange={(e) => setEditingExpansionContent(e.target.value)}
                        disabled={isSavingExpansion}
                        rows={12}
                      />
                    ) : (
                      <p>{expansion.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* AI扩写模态框 */}
        {showExpansionModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>AI扩写</h2>
                <button className="modal-close" onClick={() => setShowExpansionModal(false)}>
                  ×
                </button>
              </div>
              <form className="expansion-form" onSubmit={handleExpansion}>
                <div className="form-group">
                  <label>文风</label>
                  <select
                    value={expansionStyle}
                    onChange={(e) => setExpansionStyle(e.target.value)}
                    disabled={isExpanding}
                  >
                    <option value="克制">克制</option>
                    <option value="清冷">清冷</option>
                    <option value="暧昧">暧昧</option>
                    <option value="疯感">疯感</option>
                    <option value="温柔">温柔</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>扩写长度</label>
                  <select
                    value={expansionLength}
                    onChange={(e) => setExpansionLength(e.target.value)}
                    disabled={isExpanding}
                  >
                    <option value="灵感延伸">灵感延伸（300-800字）</option>
                    <option value="短扩写">短扩写（1000-3000字）</option>
                    <option value="中篇扩写">中篇扩写（5000-8000字）</option>
                    <option value="长篇扩写">长篇扩写（10000+字）</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>叙事视角</label>
                  <select
                    value={expansionPov}
                    onChange={(e) => setExpansionPov(e.target.value)}
                    disabled={isExpanding}
                  >
                    <option value="第一人称">第一人称</option>
                    <option value="第二人称">第二人称</option>
                    <option value="第三人称">第三人称</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={isExpanding}>
                    {isExpanding ? '扩写中...' : '开始扩写'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowExpansionModal(false)}
                    disabled={isExpanding}
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default InspirationDetail
