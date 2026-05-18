import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCps } from '../supabase/cpService'
import { getAusByCpId } from '../supabase/auService'
import { createInspiration, getInspirationsByCpId } from '../supabase/inspirationService'
import './Home.css'

function Home() {
  const [content, setContent] = useState('')
  const [selectedCp, setSelectedCp] = useState('')
  const [selectedAu, setSelectedAu] = useState('')
  const [cps, setCps] = useState([])
  const [aus, setAus] = useState([])
  const [recentInspirations, setRecentInspirations] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [favoriteInspirations, setFavoriteInspirations] = useState([])

  useEffect(() => {
    fetchCps()
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

  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    const results = []
    const lowerQuery = query.toLowerCase()

    // Search CPs
    const matchedCps = cps.filter(cp => 
      cp.name.toLowerCase().includes(lowerQuery)
    )
    matchedCps.forEach(cp => {
      results.push({
        type: 'cp',
        id: cp.id,
        name: cp.name,
        description: cp.description
      })
    })

    // Search AUs
    const allAus = []
    for (const cp of cps) {
      const cpAus = await getAusByCpId(cp.id)
      allAus.push(...cpAus)
    }
    const matchedAus = allAus.filter(au => 
      au.name.toLowerCase().includes(lowerQuery)
    )
    matchedAus.forEach(au => {
      results.push({
        type: 'au',
        id: au.id,
        name: au.name,
        description: au.description,
        cpId: au.cp_id
      })
    })

    // Search Inspirations
    for (const cp of cps) {
      try {
        const inspirations = await getInspirationsByCpId(cp.id)
        const matchedInspirations = inspirations.filter(insp => 
          insp.content.toLowerCase().includes(lowerQuery)
        )
        matchedInspirations.forEach(insp => {
          results.push({
            type: 'inspiration',
            id: insp.id,
            content: insp.content,
            cpId: cp.id,
            cpName: cp.name
          })
        })
      } catch (error) {
        console.error('搜索灵感失败:', error)
      }
    }

    setSearchResults(results)
    setShowSearchResults(true)
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
        <p className="subtitle">私人创作空间 · 记录灵感 · AI扩写</p>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="搜索灵感、CP、AU..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {showSearchResults && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((result, index) => (
                <div key={`${result.type}-${result.id}-${index}`} className="search-result-item">
                  {result.type === 'cp' && (
                    <Link to={`/cp/${result.id}`} className="search-result-link">
                      <span className="result-type">CP</span>
                      <span className="result-name">{result.name}</span>
                    </Link>
                  )}
                  {result.type === 'au' && (
                    <Link to={`/au/${result.id}`} className="search-result-link">
                      <span className="result-type">AU</span>
                      <span className="result-name">{result.name}</span>
                    </Link>
                  )}
                  {result.type === 'inspiration' && (
                    <Link to={`/inspiration/${result.id}`} className="search-result-link">
                      <span className="result-type">灵感</span>
                      <span className="result-content">{result.content.substring(0, 50)}...</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
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

        <section className="favorite-inspirations-section">
          <h2 className="section-title">星标灵感</h2>
          <div className="favorite-inspirations-list">
            {favoriteInspirations.length === 0 ? (
              <div className="favorite-inspirations-placeholder">
                <p>暂无星标灵感</p>
              </div>
            ) : (
              favoriteInspirations.map((inspiration) => (
                <div key={inspiration.id} className="favorite-inspiration-item">
                  <Link to={`/inspiration/${inspiration.id}`} className="favorite-inspiration-content">
                    {inspiration.content.substring(0, 100)}{inspiration.content.length > 100 ? '...' : ''}
                  </Link>
                  <span className="favorite-star">★</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="recent-inspirations-section">
          <h2 className="section-title">最近灵感</h2>
          <div className="recent-inspirations-placeholder">
            <p>暂无最近灵感</p>
          </div>
        </section>

        <section className="uncategorized-inspirations-section">
          <h2 className="section-title">未分类灵感</h2>
          <div className="uncategorized-inspirations-placeholder">
            <Link to="/uncategorized" className="btn btn-secondary btn-small">
              📦 打开收纳箱
            </Link>
          </div>
        </section>

        <div className="action-links">
          <Link to="/cp-list" className="link">
            查看CP列表
          </Link>
          <Link to="/create-cp" className="link">
            创建新CP
          </Link>
          <Link to="/uncategorized" className="link">
            未分类灵感
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Home
