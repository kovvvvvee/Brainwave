import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCp } from '../supabase/cpService'
import './CreateCp.css'

function CreateCp() {
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createCp(formData)
      alert('CP创建成功')
      navigate('/cp-list')
    } catch (error) {
      console.error('创建CP失败:', error)
      alert('创建CP失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="create-cp">
      <header className="page-header">
        <Link to="/cp-list" className="back-link">← 返回CP列表</Link>
        <h1>创建新CP</h1>
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
              {isSubmitting ? '创建中...' : '创建CP'}
            </button>
            <Link to="/cp-list" className="btn btn-secondary">取消</Link>
          </div>
        </form>
      </main>
    </div>
  )
}

export default CreateCp
