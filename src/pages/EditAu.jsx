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
    worldNotes: '',
    relationshipState: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchAu()
  }, [id])

  const fetchAu = async () => {
    try {
      const data = await getAuById(id)
      setFormData({
        name: data.name || '',
        description: data.description || '',
        worldNotes: data.world_notes || '',
        relationshipState: data.relationship_state || '',
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
        worldNotes: formData.worldNotes,
        relationshipState: formData.relationshipState,
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
