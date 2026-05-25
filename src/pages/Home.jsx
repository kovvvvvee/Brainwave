import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCps } from '../supabase/cpService'
import { getAusByCpId } from '../supabase/auService'
import { createInspiration, getRecentInspirations, getAllInspirations } from '../supabase/inspirationService'
import { getTagsForInspiration } from '../supabase/tagService'
import ArchiveSymbol from '../components/ArchiveSymbol'
import './Home.css'

function Home() {
  console.log('Home component render')
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
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState({ cps: [], aus: [], inspirations: [] })
  const [allInspirations, setAllInspirations] = useState([])

  useEffect(() => {
    fetchCps()
    fetchRecentInspirations()
    fetchAllInspirations()
  }, [])

  useEffect(() => {
    if (selectedCp) {
      fetchAus(selectedCp)
    } else {
      setAus([])
      setSelectedAu('')
    }
  }, [selectedCp])

  useEffect(() => {
    console.log('recentInspirations changed:', recentInspirations)
  }, [recentInspirations])

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

  const fetchAllInspirations = async () => {
    try {
      const data = await getAllInspirations()
      setAllInspirations(data)
    } catch (error) {
      console.error('获取所有灵感失败:', error)
    }
  }

  // Fuzzy search function
  const fuzzySearch = (text, query) => {
    if (!query) return true
    const lowerText = text.toLowerCase()
    const lowerQuery = query.toLowerCase()
    return lowerText.includes(lowerQuery)
  }

  // Handle search input
  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)

    if (!query.trim()) {
      setSearchResults({ cps: [], aus: [], inspirations: [] })
      return
    }

    // Search CPs
    const filteredCps = cps.filter(cp =>
      fuzzySearch(cp.name, query) ||
      fuzzySearch(cp.description || '', query)
    )

    // Search AUs
    const filteredAus = aus.filter(au =>
      fuzzySearch(au.name, query) ||
      fuzzySearch(au.description || '', query)
    )

    // Search Inspirations
    const filteredInspirations = allInspirations.filter(inspiration =>
      fuzzySearch(inspiration.content, query)
    )

    setSearchResults({
      cps: filteredCps,
      aus: filteredAus,
      inspirations: filteredInspirations
    })
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
      const newInspiration = await createInspiration(payload)
      console.log('created inspiration:', newInspiration)
      console.log('newInspiration type:', typeof newInspiration)
      console.log('newInspiration keys:', newInspiration ? Object.keys(newInspiration) : 'null')

      // Update state immediately to show new inspiration at top
      setRecentInspirations(prev => {
        const updated = [newInspiration, ...prev]
        console.log('Updated recentInspirations:', updated)
        console.log('Updated recentInspirations length:', updated.length)
        return updated
      })
      setAllInspirations(prev => {
        const updated = [newInspiration, ...prev]
        console.log('Updated allInspirations:', updated)
        console.log('Updated allInspirations length:', updated.length)
        return updated
      })

      // Clear form
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
      <div className="content-wrapper">
        <header className="archive-header">
          <ArchiveSymbol symbol="✦" position="top-right" size="small" variant="key" />
          <div className="archive-title">
            <h1>Brainwave Archive</h1>
            <p className="archive-subtitle">私人关系记录系统</p>
          </div>
        </header>

        <main className="archive-main">
          <section className="archive-search">
            <input
              type="text"
              className="archive-search-input"
              placeholder="搜索档案…"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <div className="archive-search-results">
                {searchResults.cps.length === 0 &&
                 searchResults.aus.length === 0 &&
                 searchResults.inspirations.length === 0 ? (
                  <div className="search-empty">
                    未找到相关档案
                  </div>
                ) : (
                  <>
                    {searchResults.cps.length > 0 && (
                      <div className="archive-search-category">
                        <div className="archive-label">CP档案</div>
                        <div className="archive-search-list">
                          {searchResults.cps.map(cp => (
                            <Link key={cp.id} to={`/cp/${cp.id}`} className="archive-search-item">
                              <div className="archive-item-name">{cp.name}</div>
                              {cp.description && (
                                <div className="archive-item-desc">{cp.description}</div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    {searchResults.aus.length > 0 && (
                      <div className="archive-search-category">
                        <div className="archive-label">AU档案</div>
                        <div className="archive-search-list">
                          {searchResults.aus.map(au => (
                            <Link key={au.id} to={`/au/${au.id}`} className="archive-search-item">
                              <div className="archive-item-name">{au.name}</div>
                              {au.description && (
                                <div className="archive-item-desc">{au.description}</div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    {searchResults.inspirations.length > 0 && (
                      <div className="archive-search-category">
                        <div className="archive-label">灵感记录</div>
                        <div className="archive-search-list">
                          {searchResults.inspirations.map(inspiration => (
                            <Link key={inspiration.id} to={`/inspiration/${inspiration.id}`} className="archive-search-item">
                              <div className="archive-item-content">
                                {inspiration.content.split('\n').slice(0, 2).join('\n')}
                                {inspiration.content.split('\n').length > 2 && '…'}
                              </div>
                              <div className="archive-item-meta">
                                <span className="metadata">
                                  {new Date(inspiration.created_at).toLocaleString('zh-CN')}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </section>

          <section className="archive-input">
            <form className="memo-form" onSubmit={handleSubmit}>
              <div className="memo-selectors">
                <select
                  className="memo-selector"
                  value={selectedCp}
                  onChange={(e) => setSelectedCp(e.target.value)}
                  disabled={loading}
                >
                  <option value="">CP档案（可选）</option>
                  {cps.map((cp) => (
                    <option key={cp.id} value={cp.id}>
                      {cp.name}
                    </option>
                  ))}
                </select>

                <select
                  className="memo-selector"
                  value={selectedAu}
                  onChange={(e) => setSelectedAu(e.target.value)}
                  disabled={!selectedCp || aus.length === 0}
                >
                  <option value="">AU档案（可选）</option>
                  {aus.map((au) => (
                    <option key={au.id} value={au.id}>
                      {au.name}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                className="memo-input"
                placeholder="记录灵感碎片…"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
              />

              <button
                type="submit"
                className="memo-submit-btn"
                disabled={isSubmitting || !content.trim()}
              >
                {isSubmitting ? '保存中…' : '保存记录'}
              </button>
            </form>
          </section>

          <section className="archive-stream">
            <div className="archive-section-header">
              <ArchiveSymbol symbol="☾" position="top-right" size="tiny" variant="faint" />
              <div className="archive-label">Recent Emotional Records</div>
            </div>
            <div className="archive-records">
              {(() => {
                console.log('当前 render 列表:', recentInspirations.slice(0, showCount))
                console.log('recentInspirations length:', recentInspirations.length)
                console.log('showCount:', showCount)
                return null
              })()}
              {recentInspirations.length === 0 ? (
                <div className="archive-empty">
                  <p>暂无记录</p>
                </div>
              ) : (
                <>
                  {recentInspirations.slice(0, showCount).map((inspiration, index) => (
                    <div key={inspiration.id} className={`archive-record ${inspiration.is_pinned ? 'record-pinned' : ''}`}>
                      {inspiration.is_pinned && <span className="pin-mark">◆</span>}
                      <div className="record-meta">
                        <span className="metadata">
                          {new Date(inspiration.created_at).toLocaleString('zh-CN')}
                        </span>
                        {(index + 1) % 3 === 0 && (
                          <span className="archive-inline-symbol">✦</span>
                        )}
                        {inspirationTags[inspiration.id] && inspirationTags[inspiration.id].length > 0 && (
                          <div className="record-tags">
                            {inspirationTags[inspiration.id].map(tag => (
                              <span key={tag.id} className="record-tag">
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <Link to={`/inspiration/${inspiration.id}`} className="record-content">
                        {inspiration.content.split('\n').slice(0, 2).join('\n')}
                        {inspiration.content.split('\n').length > 2 && '…'}
                      </Link>
                      {(index + 1) % 3 === 0 && (
                        <div className="archive-edge-symbol">SCAN_04</div>
                      )}
                    </div>
                  ))}
                  {recentInspirations.length > 2 && (
                    <button 
                      className="archive-expand-btn"
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
    </div>
  )
}

export default Home
