import { Link, useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCpById, updateCp } from '../supabase/cpService'
import './CreateCp.css'

function EditCp() {
  const { id } = useParams()
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
  const [loading, setLoading] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    fetchCp()
  }, [id])

  const fetchCp = async () => {
    try {
      const data = await getCpById(id)
      setFormData({
        name: data.name || '',
        relationshipSummary: data.relationship_summary || '',
        characters: data.characters || '',
        creativeNotes: data.creative_notes || '',
        sourceMaterial: data.source_material || '',
        oocRules: data.ooc_rules || '',
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
        relationshipSummary: formData.relationshipSummary,
        characters: formData.characters,
        creativeNotes: formData.creativeNotes,
        sourceMaterial: formData.sourceMaterial,
        oocRules: formData.oocRules,
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
            <Link to={`/cp/${id}`} className="btn btn-secondary">取消</Link>
          </div>
        </form>
      </main>
    </div>
  )
}

export default EditCp
