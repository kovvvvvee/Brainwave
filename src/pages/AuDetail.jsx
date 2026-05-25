import { Link, useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getAuById, updateAu, deleteAu } from '../supabase/auService'
import { getInspirationsByAuId, deleteInspiration } from '../supabase/inspirationService'
import { getTagsForInspiration } from '../supabase/tagService'
import ReadingMode from '../components/ReadingMode'
import CollapsibleSection from '../components/CollapsibleSection'
import CreativeTextarea from '../components/CreativeTextarea'
import DetailCard from '../components/DetailCard'
import FloatingActionBar from '../components/FloatingActionBar'
import ArchiveSymbol from '../components/ArchiveSymbol'
import './AuDetail.css'

function AuDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [au, setAu] = useState(null)
  const [inspirations, setInspirations] = useState([])
  const [inspirationTags, setInspirationTags] = useState({})
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // New AI-friendly AU structure
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    core_atmosphere: '',
    social_rules: '',
    life_rules: '',
    body_rules: '',
    desire_mechanism: '',
    relationship_pressure: '',
    emotional_consequences: '',
    physical_consequences: '',
    au_amplification: '',
    interaction_logic: '',
    intimacy_logic: '',
    emotional_logic: '',
    power_system: '',
    taboo_rules: '',
    instability_factors: '',
    relationship_surface_layer: '',
    relationship_actual_state: '',
    relationship_conflict: '',
    relationship_triggers: '',
    ooc_rules: '',
    world_notes: '',
    relationship_state: '',
  })

  useEffect(() => {
    fetchAu()
    fetchInspirations()
    window.scrollTo(0, 0)
  }, [id])

  const fetchAu = async () => {
    try {
      const data = await getAuById(id)
      console.log('FETCHED AU DATA:', data)
      setAu(data)
      setFormData({
        name: data.name || '',
        description: data.description || '',
        core_atmosphere: data.core_atmosphere || '',
        social_rules: data.social_rules || '',
        life_rules: data.life_rules || '',
        body_rules: data.body_rules || '',
        desire_mechanism: data.desire_mechanism || '',
        relationship_pressure: data.relationship_pressure || '',
        emotional_consequences: data.emotional_consequences || '',
        physical_consequences: data.physical_consequences || '',
        au_amplification: data.au_amplification || '',
        interaction_logic: data.interaction_logic || '',
        intimacy_logic: data.intimacy_logic || '',
        emotional_logic: data.emotional_logic || '',
        power_system: data.power_system || '',
        taboo_rules: data.taboo_rules || '',
        instability_factors: data.instability_factors || '',
        relationship_surface_layer: data.relationship_surface_layer || '',
        relationship_actual_state: data.relationship_actual_state || '',
        relationship_conflict: data.relationship_conflict || '',
        relationship_triggers: data.relationship_triggers || '',
        ooc_rules: data.ooc_rules || '',
        world_notes: data.world_notes || '',
        relationship_state: data.relationship_state || '',
      })
    } catch (error) {
      console.error('获取AU详情失败:', error)
    }
  }

  const fetchInspirations = async () => {
    try {
      const data = await getInspirationsByAuId(id)
      setInspirations(data)
      
      // Fetch tags for each inspiration
      const tagsMap = {}
      for (const inspiration of data) {
        const tags = await getTagsForInspiration(inspiration.id)
        tagsMap[inspiration.id] = tags
      }
      setInspirationTags(tagsMap)
    } catch (error) {
      console.error('获取灵感列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteInspiration = async (inspirationId) => {
    if (!confirm('确定要删除这条灵感吗？')) return

    try {
      await deleteInspiration(inspirationId)
      fetchInspirations()
    } catch (error) {
      console.error('删除灵感失败:', error)
      alert('删除灵感失败，请重试')
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    fetchAu()
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('AU名称不能为空')
      return
    }

    setIsSubmitting(true)
    try {
      console.log('SAVING AU FORM DATA:', formData)
      await updateAu(id, formData)
      await fetchAu()
      setIsEditing(false)
      alert('AU更新成功')
    } catch (error) {
      console.error('更新AU失败:', error)
      alert('更新AU失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleWorldRulesChange = (ruleType, value) => {
    setFormData(prev => ({
      ...prev,
      [ruleType]: value
    }))
  }

  const handleDeleteAu = async () => {
    if (!confirm('确认删除吗？删除AU将同时删除其所有灵感。')) return

    try {
      await deleteAu(id)
      navigate(`/cp/${au.cp_id}`)
    } catch (error) {
      console.error('删除AU失败:', error)
      alert('删除AU失败，请重试')
    }
  }

  if (loading) {
    return (
      <div className="au-detail">
        <div className="loading-state">
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  if (!au) {
    return (
      <div className="au-detail">
        <div className="empty-state">
          <p>未找到该AU</p>
          <Link to="/cp-list" className="btn btn-primary">返回CP列表</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="au-detail">
      <button 
        className="back-to-cp-button"
        onClick={() => navigate(`/cp/${au.cp_id}`)}
      >
        ← 返回 CP档案
      </button>
      
      <header className="page-header">
        <h1>{au.name}</h1>
        <div className="header-actions">
          {!isEditing && (
            <button className="btn btn-primary" onClick={handleEdit}>
              编辑设定
            </button>
          )}
          <button className="btn btn-danger-low" onClick={handleDeleteAu}>
            删除
          </button>
        </div>
      </header>

      <main className="au-detail-main">
        <section className="au-content-section">
          {isEditing ? (
            <form className="au-edit-form" onSubmit={handleSaveEdit}>
              {/* AU核心气味 */}
              <CollapsibleSection
                title="AU核心气味"
                defaultExpanded={false}
              >
                <ArchiveSymbol symbol="☾" position="top-right" size="small" variant="key" />
                <div className="field-group">
                  <label className="field-label">介绍这个世界给人的整体感觉</label>
                  <CreativeTextarea
                    value={formData.core_atmosphere}
                    onChange={(value) => handleInputChange('core_atmosphere', value)}
                    placeholder="例如：潮湿、混乱、长期失眠感 / 高压、克制、所有人都在压情绪 / 明亮日常下的隐秘沉迷 / 末日里的黏腻依赖 / 冷静制度下的危险亲密"
                  />
                </div>
              </CollapsibleSection>

              {/* 世界规则 */}
              <CollapsibleSection
                title="世界规则"
                defaultExpanded={false}
              >
                <div className="section-separator">┈┈┈┈</div>
                {/* 社会规则 */}
                <div className="field-group">
                  <label className="field-label">
                    社会规则
                    <span className="field-description">影响关系合法性和社会压力的规则</span>
                  </label>
                  <CreativeTextarea
                    value={formData.social_rules}
                    onChange={(value) => handleWorldRulesChange('social_rules', value)}
                    placeholder="哨兵向导需要精神结合才能稳定 / ABO存在信息素压制，弱势方无法反抗 / 仿生人无法合法拥有情感模块 / 公司禁止办公室恋爱，违者降职 / 魔法需要通过身体接触才能稳定"
                  />
                </div>

                {/* 生活规则 */}
                <div className="field-group">
                  <label className="field-label">
                    生活规则
                    <span className="field-description">影响日常相处和情绪状态的规则</span>
                  </label>
                  <CreativeTextarea
                    value={formData.life_rules}
                    onChange={(value) => handleWorldRulesChange('life_rules', value)}
                    placeholder="夜班制导致长期睡眠紊乱，情绪控制力下降 / 长期任务会影响精神状态，需要定期强制休息 / 高层监控私人通讯，无法真正私密 / 这个世界默认亲密关系短暂，没有人期待长久"
                  />
                </div>

                {/* 身体规则 - 最高优先级 */}
                <div className="field-group">
                  <label className="field-label">
                    身体规则（高优先级）
                    <span className="field-description">直接影响欲望、控制和失控的生理机制（最重要）</span>
                  </label>
                  <CreativeTextarea
                    value={formData.body_rules}
                    onChange={(value) => handleWorldRulesChange('body_rules', value)}
                    placeholder="精神污染会放大欲望，越污染越渴望接触 / 发情期会影响控制能力，理智下降 / 过载会导致情绪失衡，需要物理降温 / 共感会同步快感/疼痛，无法屏蔽对方感受 / 精神链接会残留情绪，长期接触会互相渗透 / 长期压抑会诱发失控，爆发时更危险"
                  />
                </div>
              </CollapsibleSection>

              {/* 关系和欲望机制 */}
              <CollapsibleSection
                title="关系和欲望机制"
                defaultExpanded={false}
              >
                <div className="section-separator">┈┈┈┈</div>
                <div className="field-group">
                  <label className="field-label">欲望机制</label>
                  <CreativeTextarea
                    value={formData.desire_mechanism}
                    onChange={(value) => handleInputChange('desire_mechanism', value)}
                    placeholder="描述这个AU如何放大或改变角色的欲望结构..."
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">关系压力</label>
                  <CreativeTextarea
                    value={formData.relationship_pressure}
                    onChange={(value) => handleInputChange('relationship_pressure', value)}
                    placeholder="描述这个AU如何施加关系压力..."
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">情绪后果</label>
                  <CreativeTextarea
                    value={formData.emotional_consequences}
                    onChange={(value) => handleInputChange('emotional_consequences', value)}
                    placeholder="描述情绪失控的后果..."
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">肉体后果</label>
                  <CreativeTextarea
                    value={formData.physical_consequences}
                    onChange={(value) => handleInputChange('physical_consequences', value)}
                    placeholder="描述身体失控的后果..."
                  />
                </div>
              </CollapsibleSection>

              {/* AI扩写增强 */}
              <CollapsibleSection
                title="AI扩写增强"
                defaultExpanded={false}
              >
                <div className="section-separator">┈┈┈┈</div>
                <div className="field-group">
                  <label className="field-label">AU放大机制</label>
                  <CreativeTextarea
                    value={formData.au_amplification}
                    onChange={(value) => handleInputChange('au_amplification', value)}
                    placeholder="这个AU会放大角色的什么特质..."
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">互动逻辑</label>
                  <CreativeTextarea
                    value={formData.interaction_logic}
                    onChange={(value) => handleInputChange('interaction_logic', value)}
                    placeholder="描述角色互动的特殊逻辑..."
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">亲密逻辑</label>
                  <CreativeTextarea
                    value={formData.intimacy_logic}
                    onChange={(value) => handleInputChange('intimacy_logic', value)}
                    placeholder="描述亲密关系的特殊逻辑..."
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">情绪逻辑</label>
                  <CreativeTextarea
                    value={formData.emotional_logic}
                    onChange={(value) => handleInputChange('emotional_logic', value)}
                    placeholder="描述情绪变化的特殊逻辑..."
                  />
                </div>
              </CollapsibleSection>

              {/* 高级设定 */}
              <CollapsibleSection
                title="高级设定"
                defaultExpanded={false}
              >
                <div className="field-group">
                  <label className="field-label">权力系统</label>
                  <CreativeTextarea
                    value={formData.power_system}
                    onChange={(value) => handleInputChange('power_system', value)}
                    placeholder="描述AU中的权力结构..."
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">禁忌规则</label>
                  <CreativeTextarea
                    value={formData.taboo_rules}
                    onChange={(value) => handleInputChange('taboo_rules', value)}
                    placeholder="描述AU中的禁忌..."
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">不稳定因素</label>
                  <CreativeTextarea
                    value={formData.instability_factors}
                    onChange={(value) => handleInputChange('instability_factors', value)}
                    placeholder="描述导致关系不稳定的因素..."
                  />
                </div>
              </CollapsibleSection>

              {/* 关系状态 */}
              <CollapsibleSection
                title="关系状态"
                defaultExpanded={false}
              >
                <div className="field-group">
                  <label className="field-label">关系表象</label>
                  <CreativeTextarea
                    value={formData.relationship_surface_layer}
                    onChange={(value) => handleInputChange('relationship_surface_layer', value)}
                    placeholder="例如：普通同事 / 搭档 / 室友 / 临时合作关系"
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">关系实际状态</label>
                  <CreativeTextarea
                    value={formData.relationship_actual_state}
                    onChange={(value) => handleInputChange('relationship_actual_state', value)}
                    placeholder="例如：长期互相依赖 / 已经形成身体习惯 / 不承认关系 / 情欲渗透日常"
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">关系矛盾</label>
                  <CreativeTextarea
                    value={formData.relationship_conflict}
                    onChange={(value) => handleInputChange('relationship_conflict', value)}
                    placeholder="例如：明明离不开却拒绝确认关系 / 一方需要亲密，一方害怕失控 / 越危险越沉迷"
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">关系触发器</label>
                  <CreativeTextarea
                    value={formData.relationship_triggers}
                    onChange={(value) => handleInputChange('relationship_triggers', value)}
                    placeholder="例如：酒精 / 长时间熬夜 / 精神过载 / 长期共处 / 任务后遗症 / 权力不对等"
                  />
                </div>
              </CollapsibleSection>

              {/* 高级设定 */}
              <CollapsibleSection
                title="高级设定"
                defaultExpanded={false}
              >
                <div className="field-group">
                  <label className="field-label">
                    禁止OOC规则
                    <span className="field-description">不要使用绝对句式如"绝不会"、"不会爱上"之类。</span>
                  </label>
                  <CreativeTextarea
                    value={formData.ooc_rules}
                    onChange={(value) => handleInputChange('ooc_rules', value)}
                    placeholder="例如：更倾向于…… / 很少主动…… / 即使亲密也…… / 很难直接表达……"
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">世界观备注</label>
                  <CreativeTextarea
                    value={formData.world_notes}
                    onChange={(value) => handleInputChange('world_notes', value)}
                    placeholder="世界观补充说明..."
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">关系状态备注</label>
                  <CreativeTextarea
                    value={formData.relationship_state}
                    onChange={(value) => handleInputChange('relationship_state', value)}
                    placeholder="关系状态补充说明..."
                  />
                </div>
              </CollapsibleSection>
            </form>
          ) : (
            <div className="au-display">
              {/* AU核心气味 */}
              <CollapsibleSection
                title="AU核心气味"
                defaultExpanded={false}
              >
                <div className="field-group au-core-field">
                  <span className="au-core-symbol">☾</span>
                  <label className="field-label">介绍这个世界给人的整体感觉</label>
                  <div className="field-display">
                    {au.core_atmosphere ? (
                      <ReadingMode
                        content={au.core_atmosphere}
                        defaultExpanded={false}
                        showPreview={false}
                      />
                    ) : (
                      <span className="empty-placeholder">未填写</span>
                    )}
                  </div>
                </div>
              </CollapsibleSection>

              {/* 世界规则 */}
              <CollapsibleSection
                title="世界规则"
                defaultExpanded={false}
              >
                <div className="section-separator">┈┈┈┈</div>
                <div className="field-group">
                  <label className="field-label">社会规则</label>
                  <div className="field-display">
                    {au.social_rules ? (
                      <ReadingMode content={au.social_rules} defaultExpanded={false} showPreview={true} />
                    ) : (
                      <span className="empty-placeholder">未填写</span>
                    )}
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">生活规则</label>
                  <div className="field-display">
                    {au.life_rules ? (
                      <ReadingMode content={au.life_rules} defaultExpanded={false} showPreview={true} />
                    ) : (
                      <span className="empty-placeholder">未填写</span>
                    )}
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">身体规则（高优先级）</label>
                  <div className="field-display">
                    {au.body_rules ? (
                      <ReadingMode content={au.body_rules} defaultExpanded={false} showPreview={true} />
                    ) : (
                      <span className="empty-placeholder">未填写</span>
                    )}
                  </div>
                </div>
              </CollapsibleSection>

              {/* 其他所有section的display模式 */}
              <CollapsibleSection title="关系和欲望机制" defaultExpanded={false}>
                <div className="field-group">
                  <label className="field-label">欲望机制</label>
                  <div className="field-display">
                    {au.desire_mechanism ? <ReadingMode content={au.desire_mechanism} defaultExpanded={false} showPreview={true} /> : <span className="empty-placeholder">未填写</span>}
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">关系压力</label>
                  <div className="field-display">
                    {au.relationship_pressure ? <ReadingMode content={au.relationship_pressure} defaultExpanded={false} showPreview={true} /> : <span className="empty-placeholder">未填写</span>}
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">情绪后果</label>
                  <div className="field-display">
                    {au.emotional_consequences ? <ReadingMode content={au.emotional_consequences} defaultExpanded={false} showPreview={true} /> : <span className="empty-placeholder">未填写</span>}
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">肉体后果</label>
                  <div className="field-display">
                    {au.physical_consequences ? <ReadingMode content={au.physical_consequences} defaultExpanded={false} showPreview={true} /> : <span className="empty-placeholder">未填写</span>}
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="AI扩写增强" defaultExpanded={false}>
                <div className="field-group">
                  <label className="field-label">AU放大机制</label>
                  <div className="field-display">
                    {au.au_amplification ? <ReadingMode content={au.au_amplification} defaultExpanded={false} showPreview={true} /> : <span className="empty-placeholder">未填写</span>}
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">互动逻辑</label>
                  <div className="field-display">
                    {au.interaction_logic ? <ReadingMode content={au.interaction_logic} defaultExpanded={false} showPreview={true} /> : <span className="empty-placeholder">未填写</span>}
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">亲密逻辑</label>
                  <div className="field-display">
                    {au.intimacy_logic ? <ReadingMode content={au.intimacy_logic} defaultExpanded={false} showPreview={true} /> : <span className="empty-placeholder">未填写</span>}
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">情绪逻辑</label>
                  <div className="field-display">
                    {au.emotional_logic ? <ReadingMode content={au.emotional_logic} defaultExpanded={false} showPreview={true} /> : <span className="empty-placeholder">未填写</span>}
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="高级设定" defaultExpanded={false}>
                <div className="field-group">
                  <label className="field-label">权力系统</label>
                  <div className="field-display">
                    {au.power_system ? <ReadingMode content={au.power_system} defaultExpanded={false} showPreview={true} /> : <span className="empty-placeholder">未填写</span>}
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">禁忌规则</label>
                  <div className="field-display">
                    {au.taboo_rules ? <ReadingMode content={au.taboo_rules} defaultExpanded={false} showPreview={true} /> : <span className="empty-placeholder">未填写</span>}
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">不稳定因素</label>
                  <div className="field-display">
                    {au.instability_factors ? <ReadingMode content={au.instability_factors} defaultExpanded={false} showPreview={true} /> : <span className="empty-placeholder">未填写</span>}
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="关系状态" defaultExpanded={false}>
                <div className="field-group">
                  <label className="field-label">关系表象</label>
                  <div className="field-display">
                    {au.relationship_surface_layer ? <ReadingMode content={au.relationship_surface_layer} defaultExpanded={false} showPreview={true} /> : <span className="empty-placeholder">未填写</span>}
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">关系实际状态</label>
                  <div className="field-display">
                    {au.relationship_actual_state ? <ReadingMode content={au.relationship_actual_state} defaultExpanded={false} showPreview={true} /> : <span className="empty-placeholder">未填写</span>}
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">关系矛盾</label>
                  <div className="field-display">
                    {au.relationship_conflict ? <ReadingMode content={au.relationship_conflict} defaultExpanded={false} showPreview={true} /> : <span className="empty-placeholder">未填写</span>}
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">关系触发器</label>
                  <div className="field-display">
                    {au.relationship_triggers ? <ReadingMode content={au.relationship_triggers} defaultExpanded={false} showPreview={true} /> : <span className="empty-placeholder">未填写</span>}
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="高级设定" defaultExpanded={false}>
                <div className="field-group">
                  <label className="field-label">禁止OOC规则</label>
                  <div className="field-display">
                    {au.ooc_rules ? <ReadingMode content={au.ooc_rules} defaultExpanded={false} showPreview={true} /> : <span className="empty-placeholder">未填写</span>}
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">世界观备注</label>
                  <div className="field-display">
                    {au.world_notes ? <ReadingMode content={au.world_notes} defaultExpanded={false} showPreview={true} /> : <span className="empty-placeholder">未填写</span>}
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">关系状态备注</label>
                  <div className="field-display">
                    {au.relationship_state ? <ReadingMode content={au.relationship_state} defaultExpanded={false} showPreview={true} /> : <span className="empty-placeholder">未填写</span>}
                  </div>
                </div>
              </CollapsibleSection>
            </div>
          )}
        </section>

        {isEditing && (
          <FloatingActionBar 
            onCancel={handleCancelEdit}
            onSave={handleSaveEdit}
            saving={isSubmitting}
            saveText="保存AU"
          />
        )}

        <section className="inspiration-list-section">
          <h2 className="section-title">已归档灵感</h2>
          
          <div className="inspiration-list">
            {inspirations.length === 0 ? (
              <div className="inspiration-empty">
                <p>暂无灵感</p>
                <Link to="/" className="link">去首页添加灵感</Link>
              </div>
            ) : (
              inspirations.map((inspiration) => (
                <div key={inspiration.id} className={`inspiration-item ${inspiration.is_pinned ? 'inspiration-pinned' : ''}`}>
                  {inspiration.is_pinned && <span className="pin-indicator">📌</span>}
                  <Link to={`/inspiration/${inspiration.id}`} className="inspiration-content">
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
                  <div className="inspiration-footer">
                    <p className="inspiration-time">
                      {new Date(inspiration.created_at).toLocaleString('zh-CN')}
                    </p>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => handleDeleteInspiration(inspiration.id)}
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default AuDetail
