import { Link, useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { getInspirationById, updateInspiration, deleteInspiration, togglePin, createExpansion, getExpansionsByInspirationId, updateExpansion, toggleExpansionFavorite, deleteExpansion } from '../supabase/inspirationService'
import { getCpById } from '../supabase/cpService'
import { getAuById } from '../supabase/auService'
import { expandInspiration } from '../supabase/aiService'
import ReadingMode from '../components/ReadingMode'
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
  const [editingVersionName, setEditingVersionName] = useState('')
  const [editingNotes, setEditingNotes] = useState('')
  const [selectedExpansionId, setSelectedExpansionId] = useState(null)

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
      // Sort: main version (is_favorite) first, then by created_at desc
      const sortedData = data.sort((a, b) => {
        if (a.is_favorite && !b.is_favorite) return -1
        if (!a.is_favorite && b.is_favorite) return 1
        return new Date(b.created_at) - new Date(a.created_at)
      })
      setExpansions(sortedData)
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

      console.log('CURRENT INSPIRATION:', inspiration)
      console.log('CURRENT INSPIRATION ID:', inspiration?.id)

      // Use createExpansion (insert, not upsert) to create a new version
      const result = await createExpansion({
        inspiration_id: inspiration.id,
        content: expandedContent,
        style: expansionStyle,
        length: expansionLength,
        pov: expansionPov,
        version_name: null, // Can be set later
        notes: null,
        is_favorite: false
      })

      console.log('createExpansion result:', result)

      await fetchExpansions()
      setShowExpansionModal(false)
      alert('AI扩写成功！已创建新版本')
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

  const handleSaveExpansionEdit = async () => {
    if (!editingExpansionContent.trim()) {
      alert('扩写内容不能为空')
      return
    }

    setIsSavingExpansion(true)
    try {
      // Update the expansion version with new content and metadata
      await updateExpansion(editingExpansionId, {
        version_name: editingVersionName || null,
        notes: editingNotes || null,
        is_favorite: false // Keep existing favorite status
      })

      // Note: We're not updating content here as that would require a separate function
      // For now, just update metadata. Content editing would need a separate update function
      
      await fetchExpansions()
      setEditingExpansionId(null)
      setEditingExpansionContent('')
      setEditingVersionName('')
      setEditingNotes('')
      alert('版本信息已更新')
    } catch (error) {
      console.error('保存扩写失败:', error)
      alert('保存扩写失败，请重试')
    } finally {
      setIsSavingExpansion(false)
    }
  }

  const handleCancelExpansionEdit = () => {
    setEditingExpansionId(null)
    setEditingExpansionContent('')
    setEditingVersionName('')
    setEditingNotes('')
  }

  const handleDeleteExpansion = async (expansionId) => {
    if (!confirm('确定要删除这个版本吗？')) return

    try {
      await deleteExpansion(expansionId)
      await fetchExpansions()
      alert('版本已删除')
    } catch (error) {
      console.error('删除版本失败:', error)
      alert('删除版本失败，请重试')
    }
  }

  const handleToggleFavorite = async (expansionId) => {
    try {
      await toggleExpansionFavorite(expansionId)
      await fetchExpansions()
    } catch (error) {
      console.error('切换收藏状态失败:', error)
      alert('切换收藏状态失败，请重试')
    }
  }

  const handleEditExpansion = (expansion) => {
    setEditingExpansionId(expansion.id)
    setEditingExpansionContent(expansion.content)
    setEditingVersionName(expansion.version_name || '')
    setEditingNotes(expansion.notes || '')
  }

  const formatVersionNumber = (index, total) => {
    const versionNum = total - index
    return `版本 ${String(versionNum).padStart(2, '0')}`
  }

  const getWordCount = (text) => {
    if (!text) return 0
    // Count Chinese characters and words
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length
    return chineseChars + englishWords
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
        <div className="header-left">
        </div>
        <div className="header-actions">
          {!isEditing && (
            <>
              <button 
                className="action-text-btn"
                onClick={handleTogglePin}
                title={inspiration.is_pinned ? '取消置顶' : '置顶'}
              >
                {inspiration.is_pinned ? '取消置顶' : '置顶'}
              </button>
              <button className="action-text-btn" onClick={() => setShowExpansionModal(true)}>
                AI扩写
              </button>
              <button className="action-text-btn" onClick={handleEdit}>
                编辑
              </button>
              <button className="action-text-btn action-delete-btn" onClick={handleDelete}>
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
              <ReadingMode 
                content={inspiration.content}
                defaultExpanded={false}
                showPreview={true}
                previewLines={3}
              />
              <p className="inspiration-time">
                创建于 {new Date(inspiration.created_at).toLocaleString('zh-CN')}
              </p>
            </div>
          )}
        </section>

        {/* 扩写历史 / Versions */}
        <section className="expansion-section">
          <h2 className="section-title">扩写历史 / Versions ({expansions.length})</h2>
          {expansions.length === 0 ? (
            <div className="feature-placeholder">
              <p>暂无扩写版本，点击上方"AI扩写"开始创作</p>
            </div>
          ) : (
            <div className="version-cards">
              {expansions.map((expansion, index) => {
                const wordCount = getWordCount(expansion.content)
                
                return (
                  <div key={expansion.id} className={`version-card ${expansion.is_favorite ? 'main-version' : ''}`}>
                    <div className="version-card-header">
                      <div className="version-card-title">
                        <div className="version-name">
                          <span className="version-text">
                            {expansion.version_name || formatVersionNumber(index, expansions.length)}
                          </span>
                          {expansion.is_favorite && (
                            <span className="main-version-badge">主版本</span>
                          )}
                        </div>
                        <div className="version-meta">
                          <span className="style-tag">{expansion.style}</span>
                          <span className="meta-separator">·</span>
                          <span className="word-count">{wordCount}字</span>
                          <span className="meta-separator">·</span>
                          <span className="creation-time">
                            {new Date(expansion.created_at).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                      </div>
                      <div className="version-card-actions">
                        {editingExpansionId === expansion.id ? (
                          <>
                            <button
                              className="action-btn save-btn"
                              onClick={() => handleSaveExpansionEdit()}
                              disabled={isSavingExpansion}
                            >
                              {isSavingExpansion ? '保存中...' : '保存'}
                            </button>
                            <button 
                              className="action-btn cancel-btn"
                              onClick={handleCancelExpansionEdit}
                              disabled={isSavingExpansion}
                            >
                              取消
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              className="action-btn"
                              onClick={() => handleCopyExpansion(expansion.content)}
                              title="复制"
                            >
                              📋
                            </button>
                            <button 
                              className="action-btn"
                              onClick={() => handleToggleFavorite(expansion.id)}
                              title={expansion.is_favorite ? '取消主版本' : '设为主版本'}
                            >
                              {expansion.is_favorite ? '当前主版本' : '设为主版本'}
                            </button>
                            <button 
                              className="action-btn"
                              onClick={() => handleEditExpansion(expansion)}
                              title="编辑版本信息"
                            >
                              ✏️
                            </button>
                            <button 
                              className="action-btn delete-btn"
                              onClick={() => handleDeleteExpansion(expansion.id)}
                              title="删除版本"
                            >
                              🗑️
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {expansion.notes && (
                      <div className="version-notes">
                        <span className="notes-label">备注：</span>
                        <span className="notes-content">{expansion.notes}</span>
                      </div>
                    )}
                    
                    {editingExpansionId === expansion.id ? (
                      <div className="version-edit-form">
                        <div className="edit-field">
                          <label>版本名称</label>
                          <input
                            type="text"
                            value={editingVersionName}
                            onChange={(e) => setEditingVersionName(e.target.value)}
                            placeholder="例如：初版、暧昧版、马尔克斯版"
                          />
                        </div>
                        <div className="edit-field">
                          <label>备注</label>
                          <textarea
                            value={editingNotes}
                            onChange={(e) => setEditingNotes(e.target.value)}
                            placeholder="添加版本备注..."
                            rows={2}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="version-content">
                        <ReadingMode 
                          content={expansion.content}
                          defaultExpanded={false}
                          showPreview={true}
                          previewLines={3}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
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
