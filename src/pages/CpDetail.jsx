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

  useEffect(() => {
    fetchCp()
    fetchAus()
    fetchUncategorizedInspirations()
  }, [id])

  const fetchCp = async () => {
    try {
      const data = await getCpById(id)
      setCp(data)
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
            {cp.relationship_summary && (
              <p className="cp-description">{cp.relationship_summary}</p>
            )}
            
            {cp.characters && (
              <div className="cp-field">
                <span className="field-label">关联角色：</span>
                <span className="field-value">{cp.characters}</span>
              </div>
            )}
            
            {cp.creative_notes && (
              <div className="cp-field">
                <span className="field-label">创作备注：</span>
                <span className="field-value">{cp.creative_notes}</span>
              </div>
            )}
            
            {cp.source_material && (
              <div className="cp-field">
                <span className="field-label">原作内容：</span>
                <span className="field-value">{cp.source_material}</span>
              </div>
            )}
            
            {cp.ooc_rules && (
              <div className="cp-field">
                <span className="field-label">OOC规则：</span>
                <span className="field-value">{cp.ooc_rules}</span>
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
