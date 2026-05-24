import { Link, useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { createAu } from '../supabase/auService'
import CollapsibleSection from '../components/CollapsibleSection'
import CreativeTextarea from '../components/CreativeTextarea'
import './CreateAu.css'

function CreateAu() {
  const { cpId } = useParams()
  const navigate = useNavigate()
  
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
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('AU名称不能为空')
      return
    }
    
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
        <p className="page-subtitle">定义这个世界的关系运行规则</p>
      </header>

      <main className="create-au-main">
        <form onSubmit={handleSubmit} className="au-form">
          {/* AU名称 - 必填 */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">AU名称 *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              placeholder="输入AU名称"
              className="form-input"
            />
          </div>

          {/* AU描述 - 可选 */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">AU描述</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="对这个AU的简要描述..."
              rows={3}
              className="form-textarea"
            />
          </div>

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

          <div className="form-actions">
            <Link to={`/cp/${cpId}`} className="btn btn-secondary">取消</Link>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? '创建中...' : '创建AU'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default CreateAu
