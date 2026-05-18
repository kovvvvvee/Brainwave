import { Link, useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCpById, updateCp } from '../supabase/cpService'
import './CreateCp.css'

function EditCp() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    characters: '',
    keywords: '',
    emotionalTone: '',
    relationshipCore: '',
    interactionStyle: '',
    oocRules: '',
    writingStyle: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCp()
  }, [id])

  const fetchCp = async () => {
    try {
      const data = await getCpById(id)
      setFormData({
        name: data.name || '',
        description: data.description || '',
        characters: data.characters || '',
        keywords: data.keywords || '',
        emotionalTone: data.emotional_tone || '',
        relationshipCore: data.relationship_core || '',
        interactionStyle: data.interaction_style || '',
        oocRules: data.ooc_rules || '',
        writingStyle: data.writing_style || '',
      })
    } catch (error) {
      console.error('获取CP详情失败:', error)
      alert('获取CP详情失败')
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
      alert('CP名称不能为空')
      return
    }

    setIsSubmitting(true)
    try {
      await updateCp(id, {
        name: formData.name,
        description: formData.description,
        characters: formData.characters,
        keywords: formData.keywords,
        emotional_tone: formData.emotionalTone,
        relationship_core: formData.relationshipCore,
        interaction_style: formData.interactionStyle,
        ooc_rules: formData.oocRules,
        writing_style: formData.writingStyle,
      })
      alert('档案更新成功')
      navigate(`/cp/${id}`)
    } catch (error) {
      console.error('更新CP失败:', error)
      alert('更新CP失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="create-cp">
        <div className="create-cp-main">
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="create-cp">
      <header className="page-header">
        <Link to={`/cp/${id}`} className="back-link">← 返回CP详情</Link>
        <h1>完善档案</h1>
      </header>

      <main className="create-cp-main">
        <form onSubmit={handleSubmit} className="cp-form">
          <div className="form-group">
            <label htmlFor="name">CP名称 *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="输入CP名称"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">CP关系描述</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="描述CP之间的关系"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="characters">关联角色</label>
            <input
              type="text"
              id="characters"
              name="characters"
              value={formData.characters}
              onChange={handleChange}
              placeholder="输入角色名称，用逗号分隔"
            />
          </div>

          <div className="form-group">
            <label htmlFor="keywords">关键词</label>
            <input
              type="text"
              id="keywords"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              placeholder="输入关键词，用逗号分隔"
            />
          </div>

          <div className="form-group">
            <label htmlFor="emotionalTone">情感基调</label>
            <input
              type="text"
              id="emotionalTone"
              name="emotionalTone"
              value={formData.emotionalTone}
              onChange={handleChange}
              placeholder="例如：甜蜜、虐心、拉扯"
            />
          </div>

          <div className="form-group">
            <label htmlFor="relationshipCore">关系核心</label>
            <textarea
              id="relationshipCore"
              name="relationshipCore"
              value={formData.relationshipCore}
              onChange={handleChange}
              placeholder="描述CP关系的核心驱动力"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="interactionStyle">互动模式</label>
            <textarea
              id="interactionStyle"
              name="interactionStyle"
              value={formData.interactionStyle}
              onChange={handleChange}
              placeholder="描述角色之间的互动方式"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="oocRules">OOC规则</label>
            <textarea
              id="oocRules"
              name="oocRules"
              value={formData.oocRules}
              onChange={handleChange}
              placeholder="描述角色OOC的界定规则"
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
              placeholder="描述期望的文风特点"
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? '保存中...' : '保存'}
            </button>
            <Link to={`/cp/${id}`} className="btn btn-secondary">取消</Link>
          </div>
        </form>
      </main>
    </div>
  )
}

export default EditCp
