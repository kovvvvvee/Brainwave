import { Link, useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getAuById, updateAu, deleteAu } from '../supabase/auService'
import { getInspirationsByAuId, deleteInspiration } from '../supabase/inspirationService'
import { getTagsForInspiration } from '../supabase/tagService'
import ReadingMode from '../components/ReadingMode'
import CollapsibleSection from '../components/CollapsibleSection'
import CreativeTextarea from '../components/CreativeTextarea'
import DetailCard from '../components/DetailCard'
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
    world_rules: { social_rules: '', life_rules: '', body_rules: '' },
    relationship_surface_layer: '',
    relationship_actual_state: '',
    relationship_conflict: '',
    au_amplification: '',
    relationship_triggers: '',
    daily_details: '',
    ooc_rules: '',
    // Legacy fields for backward compatibility
    worldNotes: '',
    relationshipState: '',
  })

  useEffect(() => {
    fetchAu()
    fetchInspirations()
    window.scrollTo(0, 0)
  }, [id])

  const fetchAu = async () => {
    try {
      const data = await getAuById(id)
      setAu(data)
      setFormData({
        name: data.name || '',
        description: data.description || '',
        core_atmosphere: data.core_atmosphere || '',
        world_rules: data.world_rules || { social_rules: '', life_rules: '', body_rules: '' },
        relationship_surface_layer: data.relationship_surface_layer || '',
        relationship_actual_state: data.relationship_actual_state || '',
        relationship_conflict: data.relationship_conflict || '',
        au_amplification: data.au_amplification || '',
        relationship_triggers: data.relationship_triggers || '',
        daily_details: data.daily_details || '',
        ooc_rules: data.ooc_rules || '',
        worldNotes: data.world_notes || '',
        relationshipState: data.relationship_state || '',
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
      world_rules: {
        ...prev.world_rules,
        [ruleType]: value
      }
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
      <header className="page-header">
        <h1>{au.name}</h1>
        <div className="header-actions">
          {!isEditing ? (
            <>
              <button className="btn btn-primary" onClick={handleEdit}>
                编辑设定
              </button>
              <button className="btn btn-danger-low" onClick={handleDeleteAu}>
                删除
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={handleCancelEdit} disabled={isSubmitting}>
                取消
              </button>
              <button className="btn btn-primary" onClick={handleSaveEdit} disabled={isSubmitting}>
                {isSubmitting ? '保存中...' : '保存'}
              </button>
            </>
          )}
        </div>
      </header>

      <main className="au-detail-main">
        <section className="au-content-section">
          {isEditing ? (
            <form className="au-edit-form" onSubmit={handleSaveEdit}>
              {/* AU核心气味 - 最高优先级，默认展开 */}
              <CollapsibleSection
                title="AU核心气味"
                defaultExpanded={true}
                summary={formData.core_atmosphere ? formData.core_atmosphere.substring(0, 50) + '...' : null}
                filledCount={formData.core_atmosphere ? 1 : 0}
                totalFields={1}
              >
                <div className="field-group">
                  <label className="field-label">
                    这个世界给人的整体感觉
                    <span className="field-description">不是介绍世界，而是这个世界给人的整体感觉。它决定AI写出来有没有"AU味"。</span>
                  </label>
                  <CreativeTextarea
                    value={formData.core_atmosphere}
                    onChange={(value) => handleInputChange('core_atmosphere', value)}
                    placeholder="例如：潮湿、混乱、长期失眠感 / 高压、克制、所有人都在压情绪 / 明亮日常下的隐秘沉迷 / 末日里的黏腻依赖 / 冷静制度下的危险亲密"
                  />
                </div>
              </CollapsibleSection>

              {/* 世界规则 - 关系运行的核心机制，默认收起 */}
              <CollapsibleSection
                title="世界规则"
                defaultExpanded={false}
                filledCount={
                  (formData.world_rules?.social_rules ? 1 : 0) +
                  (formData.world_rules?.life_rules ? 1 : 0) +
                  (formData.world_rules?.body_rules ? 1 : 0)
                }
                totalFields={3}
              >
                <div className="section-description">
                  这些规则会直接影响人物互动。AI扩写时会读取这些机制来决定人物如何反应。
                </div>
                {/* 社会规则 */}
                <CollapsibleSection
                  title="社会规则"
                  defaultExpanded={false}
                  summary={formData.world_rules?.social_rules ? formData.world_rules.social_rules.substring(0, 50) + '...' : null}
                  filledCount={formData.world_rules?.social_rules ? 1 : 0}
                  totalFields={1}
                >
                  <div className="field-group">
                    <label className="field-label">
                      社会规则
                      <span className="field-description">影响关系合法性和社会压力的规则</span>
                    </label>
                    <CreativeTextarea
                      value={formData.world_rules?.social_rules || ''}
                      onChange={(value) => handleWorldRulesChange('social_rules', value)}
                      placeholder="哨兵向导需要精神结合才能稳定 / ABO存在信息素压制，弱势方无法反抗 / 仿生人无法合法拥有情感模块 / 公司禁止办公室恋爱，违者降职 / 魔法需要通过身体接触才能稳定"
                    />
                  </div>
                </CollapsibleSection>

                {/* 生活规则 */}
                <CollapsibleSection
                  title="生活规则"
                  defaultExpanded={false}
                  summary={formData.world_rules?.life_rules ? formData.world_rules.life_rules.substring(0, 50) + '...' : null}
                  filledCount={formData.world_rules?.life_rules ? 1 : 0}
                  totalFields={1}
                >
                  <div className="field-group">
                    <label className="field-label">
                      生活规则
                      <span className="field-description">影响日常相处和情绪状态的规则</span>
                    </label>
                    <CreativeTextarea
                      value={formData.world_rules?.life_rules || ''}
                      onChange={(value) => handleWorldRulesChange('life_rules', value)}
                      placeholder="夜班制导致长期睡眠紊乱，情绪控制力下降 / 长期任务会影响精神状态，需要定期强制休息 / 高层监控私人通讯，无法真正私密 / 这个世界默认亲密关系短暂，没有人期待长久"
                    />
                  </div>
                </CollapsibleSection>

                {/* 身体规则 - 最高优先级 */}
                <CollapsibleSection
                  title="身体规则（高优先级）"
                  defaultExpanded={false}
                  summary={formData.world_rules?.body_rules ? formData.world_rules.body_rules.substring(0, 50) + '...' : null}
                  filledCount={formData.world_rules?.body_rules ? 1 : 0}
                  totalFields={1}
                >
                  <div className="field-group">
                    <label className="field-label">
                      身体规则
                      <span className="field-description">直接影响欲望、控制和失控的生理机制（最重要）</span>
                    </label>
                    <CreativeTextarea
                      value={formData.world_rules?.body_rules || ''}
                      onChange={(value) => handleWorldRulesChange('body_rules', value)}
                      placeholder="精神污染会放大欲望，越污染越渴望接触 / 发情期会影响控制能力，理智下降 / 过载会导致情绪失衡，需要物理降温 / 共感会同步快感/疼痛，无法屏蔽对方感受 / 精神链接会残留情绪，长期接触会互相渗透 / 长期压抑会诱发失控，爆发时更危险"
                    />
                  </div>
                </CollapsibleSection>
              </CollapsibleSection>

              {/* 他们在这个世界里的状态 - 3部分，默认收起 */}
              <CollapsibleSection
                title="他们在这个世界里的状态"
                defaultExpanded={false}
                filledCount={
                  (formData.relationship_surface_layer ? 1 : 0) +
                  (formData.relationship_actual_state ? 1 : 0) +
                  (formData.relationship_conflict ? 1 : 0)
                }
                totalFields={3}
              >
                {/* 关系表层 */}
                <div className="field-group">
                  <label className="field-label">关系表层</label>
                  <CreativeTextarea
                    value={formData.relationship_surface_layer}
                    onChange={(value) => handleInputChange('relationship_surface_layer', value)}
                    placeholder="例如：普通同事 / 搭档 / 室友 / 临时合作关系"
                  />
                </div>

                {/* 关系实际状态 */}
                <div className="field-group">
                  <label className="field-label">关系实际状态</label>
                  <CreativeTextarea
                    value={formData.relationship_actual_state}
                    onChange={(value) => handleInputChange('relationship_actual_state', value)}
                    placeholder="例如：长期互相依赖 / 已经形成身体习惯 / 不承认关系 / 情欲渗透日常"
                  />
                </div>

                {/* 关系矛盾 */}
                <div className="field-group">
                  <label className="field-label">关系矛盾</label>
                  <CreativeTextarea
                    value={formData.relationship_conflict}
                    onChange={(value) => handleInputChange('relationship_conflict', value)}
                    placeholder="例如：明明离不开却拒绝确认关系 / 一方需要亲密，一方害怕失控 / 越危险越沉迷"
                  />
                </div>
              </CollapsibleSection>

              {/* 这个AU会放大他们什么 - 新增重点模块 */}
              <CollapsibleSection
                title="这个AU会放大他们什么"
                defaultExpanded={false}
                summary={formData.au_amplification ? formData.au_amplification.substring(0, 50) + '...' : null}
                filledCount={formData.au_amplification ? 1 : 0}
                totalFields={1}
              >
                <div className="field-group">
                  <label className="field-label">
                    AU核心机制
                    <span className="field-description">AU不是换皮，而是放大角色某部分。</span>
                  </label>
                  <CreativeTextarea
                    value={formData.au_amplification}
                    onChange={(value) => handleInputChange('au_amplification', value)}
                    placeholder="赛博朋克AU：情绪压抑、身体依赖、欲望商品化 / 哨向AU：精神依赖、共感、控制与失控 / 同居AU：身体习惯、日常亲密、情欲渗透生活"
                  />
                </div>
              </CollapsibleSection>

              {/* 关系触发器 */}
              <CollapsibleSection
                title="关系触发器"
                defaultExpanded={false}
                summary={formData.relationship_triggers ? formData.relationship_triggers.substring(0, 50) + '...' : null}
                filledCount={formData.relationship_triggers ? 1 : 0}
                totalFields={1}
              >
                <div className="field-group">
                  <label className="field-label">
                    最容易推动剧情失控的东西
                    <span className="field-description">这些是最容易推动剧情失控的东西。</span>
                  </label>
                  <CreativeTextarea
                    value={formData.relationship_triggers}
                    onChange={(value) => handleInputChange('relationship_triggers', value)}
                    placeholder="例如：酒精 / 长时间熬夜 / 精神过载 / 长期共处 / 任务后遗症 / 权力不对等"
                  />
                </div>
              </CollapsibleSection>

              {/* 日常细节库 */}
              <CollapsibleSection
                title="日常细节库"
                defaultExpanded={false}
                summary={formData.daily_details ? formData.daily_details.substring(0, 50) + '...' : null}
                filledCount={formData.daily_details ? 1 : 0}
                totalFields={1}
              >
                <div className="field-group">
                  <label className="field-label">
                    无意义但属于人物的细节
                    <span className="field-description">允许真正"无意义但属于人物"的细节，不要自动提纯。</span>
                  </label>
                  <CreativeTextarea
                    value={formData.daily_details}
                    onChange={(value) => handleInputChange('daily_details', value)}
                    placeholder="例如：Cypher会帮Omen摘掉义体接口 / Omen睡不着时会去找Cypher / 任务结束后会检查对方有没有受伤"
                  />
                </div>
              </CollapsibleSection>

              {/* 高级设定 - 默认折叠 */}
              <CollapsibleSection
                title="高级设定"
                defaultExpanded={false}
                summary={formData.ooc_rules ? formData.ooc_rules.substring(0, 50) + '...' : null}
                filledCount={formData.ooc_rules ? 1 : 0}
                totalFields={1}
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
              </CollapsibleSection>
            </form>
          ) : (
            <div className="au-display">
              {/* AU核心气味 - 最高优先级，默认展开 */}
              <CollapsibleSection
                title="AU核心气味"
                defaultExpanded={true}
                summary={au.core_atmosphere ? au.core_atmosphere.substring(0, 50) + '...' : null}
                filledCount={au.core_atmosphere ? 1 : 0}
                totalFields={1}
              >
                <div className="field-group">
                  <label className="field-label">
                    这个世界给人的整体感觉
                    <span className="field-description">不是介绍世界，而是这个世界给人的整体感觉。它决定AI写出来有没有"AU味"。</span>
                  </label>
                  <div className="field-display">
                    {au.core_atmosphere ? (
                      <ReadingMode 
                        content={au.core_atmosphere}
                        defaultExpanded={true}
                        showPreview={false}
                      />
                    ) : (
                      <span className="empty-placeholder">未填写</span>
                    )}
                  </div>
                </div>
              </CollapsibleSection>

              {/* 世界规则 - 关系运行的核心机制，默认收起 */}
              <CollapsibleSection
                title="世界规则"
                defaultExpanded={false}
                filledCount={
                  (au.world_rules?.social_rules ? 1 : 0) +
                  (au.world_rules?.life_rules ? 1 : 0) +
                  (au.world_rules?.body_rules ? 1 : 0)
                }
                totalFields={3}
              >
                <div className="section-description">
                  这些规则会直接影响人物互动。AI扩写时会读取这些机制来决定人物如何反应。
                </div>
                {/* 社会规则 */}
                <CollapsibleSection
                  title="社会规则"
                  defaultExpanded={false}
                  summary={au.world_rules?.social_rules ? au.world_rules.social_rules.substring(0, 50) + '...' : null}
                  filledCount={au.world_rules?.social_rules ? 1 : 0}
                  totalFields={1}
                >
                  <div className="field-group">
                    <label className="field-label">
                      社会规则
                      <span className="field-description">影响关系合法性和社会压力的规则</span>
                    </label>
                    <div className="field-display">
                      {au.world_rules?.social_rules ? (
                        <ReadingMode 
                          content={au.world_rules.social_rules}
                          defaultExpanded={false}
                          showPreview={true}
                          previewLines={2}
                        />
                      ) : (
                        <span className="empty-placeholder">未填写</span>
                      )}
                    </div>
                  </div>
                </CollapsibleSection>

                {/* 生活规则 */}
                <CollapsibleSection
                  title="生活规则"
                  defaultExpanded={false}
                  summary={au.world_rules?.life_rules ? au.world_rules.life_rules.substring(0, 50) + '...' : null}
                  filledCount={au.world_rules?.life_rules ? 1 : 0}
                  totalFields={1}
                >
                  <div className="field-group">
                    <label className="field-label">
                      生活规则
                      <span className="field-description">影响日常相处和情绪状态的规则</span>
                    </label>
                    <div className="field-display">
                      {au.world_rules?.life_rules ? (
                        <ReadingMode 
                          content={au.world_rules.life_rules}
                          defaultExpanded={false}
                          showPreview={true}
                          previewLines={2}
                        />
                      ) : (
                        <span className="empty-placeholder">未填写</span>
                      )}
                    </div>
                  </div>
                </CollapsibleSection>

                {/* 身体规则 - 最高优先级 */}
                <CollapsibleSection
                  title="身体规则（高优先级）"
                  defaultExpanded={false}
                  summary={au.world_rules?.body_rules ? au.world_rules.body_rules.substring(0, 50) + '...' : null}
                  filledCount={au.world_rules?.body_rules ? 1 : 0}
                  totalFields={1}
                >
                  <div className="field-group">
                    <label className="field-label">
                      身体规则
                      <span className="field-description">直接影响欲望、控制和失控的生理机制（最重要）</span>
                    </label>
                    <div className="field-display">
                      {au.world_rules?.body_rules ? (
                        <ReadingMode 
                          content={au.world_rules.body_rules}
                          defaultExpanded={false}
                          showPreview={true}
                          previewLines={2}
                        />
                      ) : (
                        <span className="empty-placeholder">未填写</span>
                      )}
                    </div>
                  </div>
                </CollapsibleSection>
              </CollapsibleSection>

              {/* 他们在这个世界里的状态 - 3部分，默认收起 */}
              <CollapsibleSection
                title="他们在这个世界里的状态"
                defaultExpanded={false}
                filledCount={
                  (au.relationship_surface_layer ? 1 : 0) +
                  (au.relationship_actual_state ? 1 : 0) +
                  (au.relationship_conflict ? 1 : 0)
                }
                totalFields={3}
              >
                {/* 关系表层 */}
                <div className="field-group">
                  <label className="field-label">关系表层</label>
                  <div className="field-display">
                    {au.relationship_surface_layer ? (
                      <ReadingMode 
                        content={au.relationship_surface_layer}
                        defaultExpanded={false}
                        showPreview={true}
                        previewLines={2}
                      />
                    ) : (
                      <span className="empty-placeholder">未填写</span>
                    )}
                  </div>
                </div>

                {/* 关系实际状态 */}
                <div className="field-group">
                  <label className="field-label">关系实际状态</label>
                  <div className="field-display">
                    {au.relationship_actual_state ? (
                      <ReadingMode 
                        content={au.relationship_actual_state}
                        defaultExpanded={false}
                        showPreview={true}
                        previewLines={2}
                      />
                    ) : (
                      <span className="empty-placeholder">未填写</span>
                    )}
                  </div>
                </div>

                {/* 关系矛盾 */}
                <div className="field-group">
                  <label className="field-label">关系矛盾</label>
                  <div className="field-display">
                    {au.relationship_conflict ? (
                      <ReadingMode 
                        content={au.relationship_conflict}
                        defaultExpanded={false}
                        showPreview={true}
                        previewLines={2}
                      />
                    ) : (
                      <span className="empty-placeholder">未填写</span>
                    )}
                  </div>
                </div>
              </CollapsibleSection>

              {/* 这个AU会放大他们什么 - 新增重点模块 */}
              <CollapsibleSection
                title="这个AU会放大他们什么"
                defaultExpanded={false}
                summary={au.au_amplification ? au.au_amplification.substring(0, 50) + '...' : null}
                filledCount={au.au_amplification ? 1 : 0}
                totalFields={1}
              >
                <div className="field-group">
                  <label className="field-label">
                    AU核心机制
                    <span className="field-description">AU不是换皮，而是放大角色某部分。</span>
                  </label>
                  <div className="field-display">
                    {au.au_amplification ? (
                      <ReadingMode 
                        content={au.au_amplification}
                        defaultExpanded={false}
                        showPreview={true}
                        previewLines={2}
                      />
                    ) : (
                      <span className="empty-placeholder">未填写</span>
                    )}
                  </div>
                </div>
              </CollapsibleSection>

              {/* 关系触发器 */}
              <CollapsibleSection
                title="关系触发器"
                defaultExpanded={false}
                summary={au.relationship_triggers ? au.relationship_triggers.substring(0, 50) + '...' : null}
                filledCount={au.relationship_triggers ? 1 : 0}
                totalFields={1}
              >
                <div className="field-group">
                  <label className="field-label">
                    最容易推动剧情失控的东西
                    <span className="field-description">这些是最容易推动剧情失控的东西。</span>
                  </label>
                  <div className="field-display">
                    {au.relationship_triggers ? (
                      <ReadingMode 
                        content={au.relationship_triggers}
                        defaultExpanded={false}
                        showPreview={true}
                        previewLines={2}
                      />
                    ) : (
                      <span className="empty-placeholder">未填写</span>
                    )}
                  </div>
                </div>
              </CollapsibleSection>

              {/* 日常细节库 */}
              <CollapsibleSection
                title="日常细节库"
                defaultExpanded={false}
                summary={au.daily_details ? au.daily_details.substring(0, 50) + '...' : null}
                filledCount={au.daily_details ? 1 : 0}
                totalFields={1}
              >
                <div className="field-group">
                  <label className="field-label">
                    无意义但属于人物的细节
                    <span className="field-description">允许真正"无意义但属于人物"的细节，不要自动提纯。</span>
                  </label>
                  <div className="field-display">
                    {au.daily_details ? (
                      <ReadingMode 
                        content={au.daily_details}
                        defaultExpanded={false}
                        showPreview={true}
                        previewLines={2}
                      />
                    ) : (
                      <span className="empty-placeholder">未填写</span>
                    )}
                  </div>
                </div>
              </CollapsibleSection>

              {/* 高级设定 - 默认折叠 */}
              <CollapsibleSection
                title="高级设定"
                defaultExpanded={false}
                summary={au.ooc_rules ? au.ooc_rules.substring(0, 50) + '...' : null}
                filledCount={au.ooc_rules ? 1 : 0}
                totalFields={1}
              >
                <div className="field-group">
                  <label className="field-label">
                    禁止OOC规则
                    <span className="field-description">不要使用绝对句式如"绝不会"、"不会爱上"之类。</span>
                  </label>
                  <div className="field-display">
                    {au.ooc_rules ? (
                      <ReadingMode 
                        content={au.ooc_rules}
                        defaultExpanded={false}
                        showPreview={true}
                        previewLines={2}
                      />
                    ) : (
                      <span className="empty-placeholder">未填写</span>
                    )}
                  </div>
                </div>
              </CollapsibleSection>
            </div>
          )}
        </section>

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
