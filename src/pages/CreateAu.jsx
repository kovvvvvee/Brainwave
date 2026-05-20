import { Link, useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { createAu } from '../supabase/auService'
import './CreateAu.css'

function CreateAu() {
  const { cpId } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    worldNotes: '',
    relationshipState: '',
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
      await createAu({ ...formData, cp_id: cpId })
      alert('AU创建成功')
      navigate(`/cp/${cpId}`)
    } catch (error) {
      console.error('创建AU失败:', error)
      alert('创建AU失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="create-au">
      <header className="page-header">
        <h1>创建新AU</h1>
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
              placeholder="自然记录这个世界：世界背景、时间状态、人物位置、关系环境、故事气质、社会规则..."
              rows={8}
            />
          </div>

          <div className="form-group">
            <label htmlFor="worldNotes">世界观档案</label>
            <textarea
              id="worldNotes"
              name="worldNotes"
              value={formData.worldNotes}
              onChange={handleChange}
              placeholder="记录这个世界的核心设定、时代背景、职业设定等..."
              rows={5}
            />
          </div>

          <div className="form-group">
            <label htmlFor="relationshipState">世界里的他们</label>
            <textarea
              id="relationshipState"
              name="relationshipState"
              value={formData.relationshipState}
              onChange={handleChange}
              placeholder="描述他们在这个世界里的关系状态：谁更靠近谁、谁先失控、谁在逃避、谁更像陌生人、谁在维持关系..."
              rows={5}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? '创建中...' : '创建AU'}
            </button>
            <Link to={`/cp/${cpId}`} className="btn btn-secondary">取消</Link>
          </div>
        </form>
      </main>
    </div>
  )
}

export default CreateAu
