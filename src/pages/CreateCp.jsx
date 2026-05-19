import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCp } from '../supabase/cpService'
import './CreateCp.css'

function CreateCp() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    relationshipSummary: '',
    characters: '',
    creativeNotes: '',
    sourceMaterial: '',
    oocRules: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

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
            <label htmlFor="relationshipSummary">他们之间，最像什么？</label>
            <textarea
              id="relationshipSummary"
              name="relationshipSummary"
              value={formData.relationshipSummary}
              onChange={handleChange}
              placeholder="他们像两把互相磨损的刀。&#10;谁都没有回头，但谁都在等。"
              rows={3}
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
            <label htmlFor="creativeNotes">创作备注</label>
            <textarea
              id="creativeNotes"
              name="creativeNotes"
              value={formData.creativeNotes}
              onChange={handleChange}
              placeholder="记录相处习惯、情绪状态、关系细节、对话习惯、潜台词、关系氛围、小动作等"
              rows={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="sourceMaterial">原作内容</label>
            <textarea
              id="sourceMaterial"
              name="sourceMaterial"
              value={formData.sourceMaterial}
              onChange={handleChange}
              placeholder="记录原作世界观、原作剧情、原作人物关系、原作设定、原作性格基调等"
              rows={6}
            />
          </div>

          <div className="advanced-section">
            <button
              type="button"
              className="advanced-toggle"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? '▼ 高级设定' : '▶ 高级设定'}
            </button>
            {showAdvanced && (
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
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? '保存中...' : '保存这段关系'}
            </button>
            <Link to="/cp-list" className="btn btn-secondary">取消</Link>
          </div>
        </form>
      </main>
    </div>
  )
}

export default CreateCp
