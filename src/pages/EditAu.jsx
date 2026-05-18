import { Link, useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getAuById, updateAu } from '../supabase/auService'
import './CreateAu.css'

function EditAu() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    worldSetting: '',
    eraBackground: '',
    occupationSetting: '',
    atmosphere: '',
    behaviorPattern: '',
    writingStyle: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAu()
  }, [id])

  const fetchAu = async () => {
    try {
      const data = await getAuById(id)
      setFormData({
        name: data.name || '',
        description: data.description || '',
        worldSetting: data.world_setting || '',
        eraBackground: data.era_background || '',
        occupationSetting: data.occupation_setting || '',
        atmosphere: data.atmosphere || '',
        behaviorPattern: data.behavior_pattern || '',
        writingStyle: data.writing_style || '',
      })
    } catch (error) {
      console.error('获取AU详情失败:', error)
      alert('获取AU详情失败')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('AU名称不能为空')
      return
    }

    setIsSubmitting(true)
    try {
      await updateAu(id, {
        name: formData.name,
        description: formData.description,
        worldSetting: formData.worldSetting,
        eraBackground: formData.eraBackground,
        occupationSetting: formData.occupationSetting,
        atmosphere: formData.atmosphere,
        behaviorPattern: formData.behaviorPattern,
        writingStyle: formData.writingStyle,
      })
      alert('设定更新成功')
      navigate(`/au/${id}`)
    } catch (error) {
      console.error('更新AU失败:', error)
      alert('更新AU失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="create-au">
        <div className="create-au-main">
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="create-au">
      <header className="page-header">
        <Link to={`/au/${id}`} className="back-link">← 返回AU详情</Link>
        <h1>完善设定</h1>
      </header>

      <main className="create-au-main">
        <form onSubmit={handleSubmit} className="au-form">
          <div className="form-group">
            <label htmlFor="name">AU名称 *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="输入AU名称"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">AU描述</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="描述AU的世界观设定"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="worldSetting">世界观</label>
            <textarea
              id="worldSetting"
              name="worldSetting"
              value={formData.worldSetting}
              onChange={handleChange}
              placeholder="描述AU的世界观设定"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="eraBackground">时代背景</label>
            <textarea
              id="eraBackground"
              name="eraBackground"
              value={formData.eraBackground}
              onChange={handleChange}
              placeholder="描述AU的时代背景"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="occupationSetting">职业设定</label>
            <textarea
              id="occupationSetting"
              name="occupationSetting"
              value={formData.occupationSetting}
              onChange={handleChange}
              placeholder="描述角色的职业设定"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="atmosphere">氛围</label>
            <textarea
              id="atmosphere"
              name="atmosphere"
              value={formData.atmosphere}
              onChange={handleChange}
              placeholder="描述AU的整体氛围"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="behaviorPattern">行为模式</label>
            <textarea
              id="behaviorPattern"
              name="behaviorPattern"
              value={formData.behaviorPattern}
              onChange={handleChange}
              placeholder="描述角色在该AU中的行为模式"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="writingStyle">文风偏好</label>
            <textarea
              id="writingStyle"
              name="writingStyle"
              value={formData.writingStyle}
              onChange={handleChange}
              placeholder="描述该AU期望的文风特点"
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? '保存中...' : '保存'}
            </button>
            <Link to={`/au/${id}`} className="btn btn-secondary">取消</Link>
          </div>
        </form>
      </main>
    </div>
  )
}

export default EditAu
