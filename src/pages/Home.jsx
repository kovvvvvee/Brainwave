import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCps } from '../supabase/cpService'
import { getAusByCpId } from '../supabase/auService'
import { createInspiration, getRecentInspirations } from '../supabase/inspirationService'
import { getTagsForInspiration } from '../supabase/tagService'
import './Home.css'

function Home() {
  const [content, setContent] = useState('')
  const [selectedCp, setSelectedCp] = useState('')
  const [selectedAu, setSelectedAu] = useState('')
  const [cps, setCps] = useState([])
  const [aus, setAus] = useState([])
  const [recentInspirations, setRecentInspirations] = useState([])
  const [inspirationTags, setInspirationTags] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showCount, setShowCount] = useState(2)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    fetchCps()
    fetchRecentInspirations()
  }, [])

  useEffect(() => {
    if (selectedCp) {
      fetchAus(selectedCp)
    } else {
      setAus([])
      setSelectedAu('')
    }
  }, [selectedCp])

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

  const fetchAus = async (cpId) => {
    try {
      const data = await getAusByCpId(cpId)
      setAus(data)
    } catch (error) {
      console.error('获取AU列表失败:', error)
    }
  }

  const fetchRecentInspirations = async () => {
    try {
      const data = await getRecentInspirations()
      setRecentInspirations(data)

      // Fetch tags for each inspiration
      const tagsMap = {}
      for (const inspiration of data) {
        const tags = await getTagsForInspiration(inspiration.id)
        tagsMap[inspiration.id] = tags
      }
      setInspirationTags(tagsMap)
    } catch (error) {
      console.error('获取最近灵感失败:', error)
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) {
      alert('请填写灵感内容')
      return
    }

    setIsSubmitting(true)
    try {
      // Convert empty strings to null for database
      const cpIdToSave = selectedCp ? selectedCp : null
      const auIdToSave = selectedAu ? selectedAu : null

      // Log for debugging
      console.log('保存灵感 - cp_id:', cpIdToSave)
      console.log('保存灵感 - au_id:', auIdToSave)
      console.log('保存灵感 - content:', content)

      const payload = {
        cp_id: cpIdToSave,
        au_id: auIdToSave,
        content: content
      }
      console.log('保存灵感 - insert payload:', payload)

      // Save inspiration (CP/AU selection is optional)
      await createInspiration(payload)

      setContent('')
      setSelectedCp('')
      setSelectedAu('')
      setAus([])

      alert('灵感保存成功！')
    } catch (error) {
      console.error('保存灵感失败:', error)
      alert('保存灵感失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="home">
      <header className="home-header">
        <h1>Brainwave</h1>
        <p className="subtitle">私人创作空间</p>
      </header>

      <main className="home-main">
        <section className="inspiration-input-section">
          <form className="inspiration-form" onSubmit={handleSubmit}>
            <div className="selector-group">
              <select
                className="selector"
                value={selectedCp}
                onChange={(e) => setSelectedCp(e.target.value)}
                disabled={loading}
              >
                <option value="">选择CP（可选）</option>
                {cps.map((cp) => (
                  <option key={cp.id} value={cp.id}>
                    {cp.name}
                  </option>
                ))}
              </select>

              <select
                className="selector"
                value={selectedAu}
                onChange={(e) => setSelectedAu(e.target.value)}
                disabled={!selectedCp || aus.length === 0}
              >
                <option value="">选择AU（可选）</option>
                {aus.map((au) => (
                  <option key={au.id} value={au.id}>
                    {au.name}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              className="inspiration-input"
              placeholder="记录你的灵感..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
            />

            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={isSubmitting || !content.trim()}
            >
              {isSubmitting ? '保存中...' : '保存灵感'}
            </button>
          </form>
        </section>

        <section className="continue-writing-section">
          <h2 className="section-title">继续写</h2>
          <div className="continue-writing-list">
            {recentInspirations.length === 0 ? (
              <div className="continue-writing-placeholder">
                <p>开始记录你的第一条灵感</p>
              </div>
            ) : (
              <>
                {recentInspirations.slice(0, showCount).map((inspiration) => (
                  <div key={inspiration.id} className={`continue-writing-item ${inspiration.is_pinned ? 'item-pinned' : ''}`}>
                    {inspiration.is_pinned && <span className="pin-indicator">📌</span>}
                    <Link to={`/inspiration/${inspiration.id}`} className="continue-writing-content">
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
                    <div className="continue-writing-footer">
                      <p className="continue-writing-time">
                        {new Date(inspiration.created_at).toLocaleString('zh-CN')}
                      </p>
                    </div>
                  </div>
                ))}
                {recentInspirations.length > 2 && (
                  <button 
                    className="expand-more-btn"
                    onClick={() => {
                      if (isExpanded) {
                        setShowCount(2)
                        setIsExpanded(false)
                      } else {
                        setShowCount(recentInspirations.length)
                        setIsExpanded(true)
                      }
                    }}
                  >
                    {isExpanded ? '收起' : '展开更多'}
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home
