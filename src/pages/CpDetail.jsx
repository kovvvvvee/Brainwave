import { Link, useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCpById, deleteCp, updateCp } from '../supabase/cpService'
import { getAusByCpId } from '../supabase/auService'
import { getUncategorizedInspirationsByCpId, deleteInspiration } from '../supabase/inspirationService'
import { getTagsForInspiration } from '../supabase/tagService'
import './CpDetail.css'

function CpDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cp, setCp] = useState(null)
  const [aus, setAus] = useState([])
  const [uncategorizedInspirations, setUncategorizedInspirations] = useState([])
  const [inspirationTags, setInspirationTags] = useState({})
  const [loading, setLoading] = useState(true)
  const [isEditingMemory, setIsEditingMemory] = useState(false)
  const [memoryData, setMemoryData] = useState({
    relationshipMemory: '',
    speechStyleMemory: '',
    writingStyleMemory: ''
  })
  const [isSavingMemory, setIsSavingMemory] = useState(false)

  useEffect(() => {
    fetchCp()
    fetchAus()
    fetchUncategorizedInspirations()
  }, [id])

  const fetchCp = async () => {
    try {
      const data = await getCpById(id)
      setCp(data)
      setMemoryData({
        relationshipMemory: data.relationship_memory || '',
        speechStyleMemory: data.speech_style_memory || '',
        writingStyleMemory: data.writing_style_memory || ''
      })
    } catch (error) {
      console.error('获取CP详情失败:', error)
    }
  }

  const fetchAus = async () => {
    try {
      const data = await getAusByCpId(id)
      setAus(data)
    } catch (error) {
      console.error('获取AU列表失败:', error)
    }
  }

  const fetchUncategorizedInspirations = async () => {
    try {
      const data = await getUncategorizedInspirationsByCpId(id)
      setUncategorizedInspirations(data)
      
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
      fetchUncategorizedInspirations()
    } catch (error) {
      console.error('删除灵感失败:', error)
      alert('删除灵感失败，请重试')
    }
  }

  const handleDeleteCp = async () => {
    if (!confirm('确认删除吗？删除CP将同时删除其所有AU和相关灵感。')) return

    try {
      await deleteCp(id)
      navigate('/cp-list')
    } catch (error) {
      console.error('删除CP失败:', error)
      alert('删除CP失败，请重试')
    }
  }

  const handleEditMemory = () => {
    setIsEditingMemory(true)
  }

  const handleCancelMemoryEdit = () => {
    setIsEditingMemory(false)
    setMemoryData({
      relationshipMemory: cp.relationship_memory || '',
      speechStyleMemory: cp.speech_style_memory || '',
      writingStyleMemory: cp.writing_style_memory || ''
    })
  }

  const handleSaveMemory = async () => {
    setIsSavingMemory(true)
    try {
      await updateCp(id, {
        ...cp,
        relationshipMemory: memoryData.relationshipMemory,
        speechStyleMemory: memoryData.speechStyleMemory,
        writingStyleMemory: memoryData.writingStyleMemory
      })
      await fetchCp()
      setIsEditingMemory(false)
      alert('创作记忆已更新')
    } catch (error) {
      console.error('更新创作记忆失败:', error)
      alert('更新创作记忆失败，请重试')
    } finally {
      setIsSavingMemory(false)
    }
  }

  if (loading) {
    return (
      <div className="cp-detail">
        <div className="loading-state">
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  if (!cp) {
    return (
      <div className="cp-detail">
        <div className="empty-state">
          <p>未找到该CP</p>
          <Link to="/cp-list" className="btn btn-primary">返回CP列表</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cp-detail">
      <header className="page-header">
        <Link to="/cp-list" className="back-link">← 返回CP列表</Link>
        <h1>CP详情</h1>
      </header>

      <main className="cp-detail-main">
        <section className="cp-info-section">
          <div className="section-header">
            <h2 className="section-title">CP信息</h2>
            <div className="section-actions">
              <Link to={`/cp/${id}/edit`} className="btn btn-secondary btn-small">
                完善档案
              </Link>
              <button className="btn btn-danger btn-small" onClick={handleDeleteCp}>
                删除
              </button>
            </div>
          </div>

          <div className="cp-info-card">
            <h3 className="cp-name">{cp.name}</h3>
            <p className="cp-description">{cp.description || '暂无描述'}</p>
            
            {cp.characters && (
              <div className="cp-field">
                <span className="field-label">关联角色：</span>
                <span className="field-value">{cp.characters}</span>
              </div>
            )}
            
            {cp.keywords && (
              <div className="cp-field">
                <span className="field-label">关键词：</span>
                <span className="field-value">{cp.keywords}</span>
              </div>
            )}
            
            {cp.emotional_tone && (
              <div className="cp-field">
                <span className="field-label">情感基调：</span>
                <span className="field-value">{cp.emotional_tone}</span>
              </div>
            )}
            
            {cp.relationship_core && (
              <div className="cp-field">
                <span className="field-label">关系核心：</span>
                <span className="field-value">{cp.relationship_core}</span>
              </div>
            )}
            
            {cp.interaction_style && (
              <div className="cp-field">
                <span className="field-label">互动模式：</span>
                <span className="field-value">{cp.interaction_style}</span>
              </div>
            )}
            
            {cp.ooc_rules && (
              <div className="cp-field">
                <span className="field-label">OOC规则：</span>
                <span className="field-value">{cp.ooc_rules}</span>
              </div>
            )}
            
            {cp.writing_style && (
              <div className="cp-field">
                <span className="field-label">文风偏好：</span>
                <span className="field-value">{cp.writing_style}</span>
              </div>
            )}
          </div>
        </section>

        <section className="memory-section">
          <div className="section-header">
            <h2 className="section-title">创作记忆</h2>
            {!isEditingMemory ? (
              <button className="btn btn-secondary btn-small" onClick={handleEditMemory}>
                编辑记忆
              </button>
            ) : (
              <div className="memory-edit-actions">
                <button className="btn btn-primary btn-small" onClick={handleSaveMemory} disabled={isSavingMemory}>
                  {isSavingMemory ? '保存中...' : '保存'}
                </button>
                <button className="btn btn-secondary btn-small" onClick={handleCancelMemoryEdit} disabled={isSavingMemory}>
                  取消
                </button>
              </div>
            )}
          </div>

          <div className="memory-card">
            {isEditingMemory ? (
              <div className="memory-edit-form">
                <div className="memory-field">
                  <label className="memory-label">关系气质记忆</label>
                  <textarea
                    className="memory-textarea"
                    value={memoryData.relationshipMemory}
                    onChange={(e) => setMemoryData({...memoryData, relationshipMemory: e.target.value})}
                    placeholder="记录CP关系的气质特点，如：压抑、克制、长期拉扯、不擅长表达等..."
                    rows={4}
                    disabled={isSavingMemory}
                  />
                </div>
                <div className="memory-field">
                  <label className="memory-label">说话方式记忆</label>
                  <textarea
                    className="memory-textarea"
                    value={memoryData.speechStyleMemory}
                    onChange={(e) => setMemoryData({...memoryData, speechStyleMemory: e.target.value})}
                    placeholder="记录角色说话习惯，如：话少、冷淡、情绪化、喜欢反问等..."
                    rows={4}
                    disabled={isSavingMemory}
                  />
                </div>
                <div className="memory-field">
                  <label className="memory-label">文风记忆</label>
                  <textarea
                    className="memory-textarea"
                    value={memoryData.writingStyleMemory}
                    onChange={(e) => setMemoryData({...memoryData, writingStyleMemory: e.target.value})}
                    placeholder="记录该CP常见文风，如：留白感强、意识流、情绪压抑等..."
                    rows={4}
                    disabled={isSavingMemory}
                  />
                </div>
              </div>
            ) : (
              <div className="memory-display">
                {memoryData.relationshipMemory && (
                  <div className="memory-item">
                    <span className="memory-item-label">关系气质</span>
                    <p className="memory-item-content">{memoryData.relationshipMemory}</p>
                  </div>
                )}
                {memoryData.speechStyleMemory && (
                  <div className="memory-item">
                    <span className="memory-item-label">说话方式</span>
                    <p className="memory-item-content">{memoryData.speechStyleMemory}</p>
                  </div>
                )}
                {memoryData.writingStyleMemory && (
                  <div className="memory-item">
                    <span className="memory-item-label">文风</span>
                    <p className="memory-item-content">{memoryData.writingStyleMemory}</p>
                  </div>
                )}
                {!memoryData.relationshipMemory && !memoryData.speechStyleMemory && !memoryData.writingStyleMemory && (
                  <p className="memory-empty">暂无创作记忆，点击"编辑记忆"开始记录</p>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="au-list-section">
          <div className="section-header">
            <h2 className="section-title">AU列表</h2>
            <Link to={`/cp/${id}/create-au`} className="btn btn-primary btn-small">创建AU</Link>
          </div>
          {aus.length === 0 ? (
            <div className="au-list-placeholder">
              <p>暂无AU，点击上方按钮创建</p>
            </div>
          ) : (
            <div className="au-grid">
              {aus.map(au => (
                <div key={au.id} className="au-card">
                  <h3 className="au-name">{au.name}</h3>
                  <p className="au-description">{au.description || '暂无描述'}</p>
                  <div className="au-actions">
                    <Link to={`/au/${au.id}`} className="btn btn-small">查看详情</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="inspiration-list-section">
          <h2 className="section-title">普通灵感</h2>
          <div className="inspiration-list">
            {uncategorizedInspirations.length === 0 ? (
              <div className="inspiration-empty">
                <p>暂无普通灵感</p>
              </div>
            ) : (
              uncategorizedInspirations.map((inspiration) => (
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
                  {inspiration.is_favorite && <span className="favorite-indicator">★</span>}
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

export default CpDetail
