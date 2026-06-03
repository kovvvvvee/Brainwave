import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCp } from '../supabase/cpService'
import CollapsibleSection from '../components/CollapsibleSection'
import CreativeTextarea from '../components/CreativeTextarea'
import DetailCard from '../components/DetailCard'
import InteractionDetailsCard from '../components/InteractionDetailsCard'
import ArchiveSymbol from '../components/ArchiveSymbol'
import ArchiveResidue from '../components/ArchiveResidue'
import './CreateCp.css'

function CreateCp() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const [formData, setFormData] = useState({
    name: '',
    core_dynamic: '',
    relationship_dynamic: {
      emotional_inertia: '',
      interaction_inertia: '',
      desire_inertia: ''
    },
    character_profiles: {
      character_a_name: '',
      character_b_name: '',
      character_a: {
        explicit_state: '',
        true_state: '',
        language_habits: ''
      },
      character_b: {
        explicit_state: '',
        true_state: '',
        language_habits: ''
      }
    },
    sexual_dynamic: {
      desire_structure: '',
      behavioral_inertia: '',
      basic_positioning: ''
    },
    relationship_atmosphere: '',
    interaction_details: [],
    source_material: '',
    ooc_rules: '',
    power_flow: '',
    relationship_boundaries: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedChange = (section, subsection, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: value
      }
    }))
  }

  const handleCharacterProfileChange = (character, field, value) => {
    setFormData(prev => ({
      ...prev,
      character_profiles: {
        ...prev.character_profiles,
        [character]: {
          ...prev.character_profiles[character],
          [field]: value
        }
      }
    }))
  }

  const handleCharacterNameChange = (character, value) => {
    setFormData(prev => ({
      ...prev,
      character_profiles: {
        ...prev.character_profiles,
        [character]: value
      }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log('SUBMIT - formData.character_profiles:', formData.character_profiles)
      console.log('SUBMIT - formData.character_profiles.character_a_name:', formData.character_profiles.character_a_name)
      console.log('SUBMIT - formData.character_profiles.character_b_name:', formData.character_profiles.character_b_name)
      
      // Prepare payload with JSON stringified nested fields
      const savePayload = {
        name: formData.name,
        core_dynamic: formData.core_dynamic || null,
        relationship_dynamic: JSON.stringify(formData.relationship_dynamic),
        character_profiles: JSON.stringify(formData.character_profiles),
        sexual_dynamic: JSON.stringify(formData.sexual_dynamic),
        relationship_atmosphere: formData.relationship_atmosphere || null,
        interaction_details: JSON.stringify(formData.interaction_details),
        source_material: formData.source_material || null,
        ooc_rules: formData.ooc_rules || null,
        power_flow: formData.power_flow || null,
        relationship_boundaries: formData.relationship_boundaries || null
      }

      console.log('SUBMIT - savePayload.character_profiles:', savePayload.character_profiles)

      await createCp(savePayload)
      alert('CP创建成功')
      navigate('/archive')
      // Force layout recalculation after navigation
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event('resize'))
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'))
        }, 100)
      })
    } catch (error) {
      console.error('创建CP失败:', error)
      alert('创建CP失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="create-cp">
      {/* Background illustration - character silhouette at edge */}
      <ArchiveResidue 
        imageSrc="/assets/rabbit-girl-ascii.png"
        position="right-main"
        opacity={0.15}
        size="full-height"
        crop="top-right-corner"
        grayscale={100}
        contrast={90}
        brightness={100}
        saturate={20}
      />
      
      <header className="page-header">
        <ArchiveSymbol symbol="✦" position="top-right" size="small" variant="key" />
        <h1>建立新的关系档案</h1>
      </header>

      <main className="create-cp-main">
        <form onSubmit={handleSubmit} className="cp-form">
          {/* CP名称 */}
          <div className="field-group">
            <label className="field-label">CP名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              placeholder="例如：A × B"
              className="creative-input"
            />
          </div>

          {/* CP核心一句话 - 默认展开 */}
          <CollapsibleSection
            title="CP核心一句话"
            defaultExpanded={true}
            summary="这是关系核心引擎。不是简介。而是'他们为什么互相上瘾'。"
            filledCount={formData.core_one_liner ? 1 : 0}
            totalFields={1}
          >
            <div className="field-group">
              <label className="field-label">这是关系核心引擎。不是简介。而是"他们为什么互相上瘾"。</label>
              <CreativeTextarea
                value={formData.core_one_liner}
                onChange={(value) => handleChange('core_one_liner', value)}
                placeholder="例如：越克制越失控 / 一个不断试探，一个不断纵容 / 用控制感维持关系，却总被欲望破坏"
              />
            </div>
          </CollapsibleSection>

          {/* 关系动态 - 默认展开 */}
          <CollapsibleSection
            title="关系动态"
            defaultExpanded={true}
            summary="不要写剧情。写长期重复出现的关系惯性。"
            filledCount={Object.values(formData.relationship_dynamic).filter(Boolean).length}
            totalFields={3}
            tags={['情绪惯性', '相处惯性', '欲望惯性']}
          >
            <div className="field-group">
              <label className="field-label">不要写剧情。写长期重复出现的关系惯性。</label>
              <div className="nested-fields">
                <DetailCard
                  label="【情绪惯性】"
                  value={formData.relationship_dynamic.emotional_inertia}
                  onChange={(value) => handleNestedChange('relationship_dynamic', 'emotional_inertia', value)}
                  placeholder="例如：越冷淡越想靠近 / 一方沉默时另一方会变烦人"
                  isEditing={true}
                />
                <DetailCard
                  label="【相处惯性】"
                  value={formData.relationship_dynamic.interaction_inertia}
                  onChange={(value) => handleNestedChange('relationship_dynamic', 'interaction_inertia', value)}
                  placeholder="例如：吵架后反而更黏 / 喜欢用调侃代替示弱"
                  isEditing={true}
                />
                <DetailCard
                  label="【欲望惯性】"
                  value={formData.relationship_dynamic.desire_inertia}
                  onChange={(value) => handleNestedChange('relationship_dynamic', 'desire_inertia', value)}
                  placeholder="例如：越压抑越容易失控 / 喜欢观察对方反应"
                  isEditing={true}
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* 角色单独档案 - 默认折叠 */}
          <CollapsibleSection
            title="角色单独档案"
            defaultExpanded={false}
            summary="只写会影响互动的部分。不要写百科。"
            filledCount={Object.values(formData.character_profiles.character_a).filter(Boolean).length + Object.values(formData.character_profiles.character_b).filter(Boolean).length}
            totalFields={6}
            tags={['外显状态', '真实状态', '语言习惯']}
          >
            <div className="field-group">
              <label className="field-label">只写会影响互动的部分。不要写百科。</label>
              <div className="character-profiles">
                <div className="character-profile">
                  <input
                    type="text"
                    value={formData.character_profiles.character_a_name}
                    onChange={(e) => handleCharacterNameChange('character_a_name', e.target.value)}
                    placeholder="角色A名称"
                    className="character-name-input"
                  />
                  <div className="nested-fields">
                    <DetailCard
                      label="【外显状态】"
                      value={formData.character_profiles.character_a.explicit_state}
                      onChange={(value) => handleCharacterProfileChange('character_a', 'explicit_state', value)}
                      placeholder="例如：嘴硬 / 控制欲强"
                      isEditing={true}
                    />
                    <DetailCard
                      label="【真实状态】"
                      value={formData.character_profiles.character_a.true_state}
                      onChange={(value) => handleCharacterProfileChange('character_a', 'true_state', value)}
                      placeholder="例如：实际很容易上瘾 / 会偷偷观察对方反应"
                      isEditing={true}
                    />
                    <DetailCard
                      label="【语言习惯】"
                      value={formData.character_profiles.character_a.language_habits}
                      onChange={(value) => handleCharacterProfileChange('character_a', 'language_habits', value)}
                      placeholder="例如：情绪越重越简短 / 很少说完整情话"
                      isEditing={true}
                    />
                  </div>
                </div>
                <div className="character-profile">
                  <input
                    type="text"
                    value={formData.character_profiles.character_b_name}
                    onChange={(e) => handleCharacterNameChange('character_b_name', e.target.value)}
                    placeholder="角色B名称"
                    className="character-name-input"
                  />
                  <div className="nested-fields">
                    <DetailCard
                      label="【外显状态】"
                      value={formData.character_profiles.character_b.explicit_state}
                      onChange={(value) => handleCharacterProfileChange('character_b', 'explicit_state', value)}
                      placeholder="例如：嘴硬 / 控制欲强"
                      isEditing={true}
                    />
                    <DetailCard
                      label="【真实状态】"
                      value={formData.character_profiles.character_b.true_state}
                      onChange={(value) => handleCharacterProfileChange('character_b', 'true_state', value)}
                      placeholder="例如：实际很容易上瘾 / 会偷偷观察对方反应"
                      isEditing={true}
                    />
                    <DetailCard
                      label="【语言习惯】"
                      value={formData.character_profiles.character_b.language_habits}
                      onChange={(value) => handleCharacterProfileChange('character_b', 'language_habits', value)}
                      placeholder="例如：情绪越重越简短 / 很少说完整情话"
                      isEditing={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* 性关系动态 - 默认折叠 */}
          <CollapsibleSection
            title="性关系动态"
            defaultExpanded={false}
            summary="重点是欲望结构和行为惯性。不是简单写谁1谁0。"
            filledCount={Object.values(formData.sexual_dynamic).filter(Boolean).length}
            totalFields={3}
            tags={['欲望结构', '行为惯性', '基础定位']}
          >
            <div className="field-group">
              <label className="field-label">重点是欲望结构和行为惯性。不是简单写谁1谁0。</label>
              <div className="nested-fields">
                <DetailCard
                  label="【欲望结构】"
                  value={formData.sexual_dynamic.desire_structure}
                  onChange={(value) => handleNestedChange('sexual_dynamic', 'desire_structure', value)}
                  placeholder="例如：越压抑越容易失控 / 喜欢观察对方忍耐"
                  isEditing={true}
                />
                <DetailCard
                  label="【行为惯性】"
                  value={formData.sexual_dynamic.behavioral_inertia}
                  onChange={(value) => handleNestedChange('sexual_dynamic', 'behavioral_inertia', value)}
                  placeholder="例如：会故意拖长临界状态 / 越沉默越危险"
                  isEditing={true}
                />
                <DetailCard
                  label="【基础定位】"
                  value={formData.sexual_dynamic.basic_positioning}
                  onChange={(value) => handleNestedChange('sexual_dynamic', 'basic_positioning', value)}
                  placeholder="例如：通常由A主导进入 / 但控制权经常交换"
                  isEditing={true}
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* 关系氛围 - 默认折叠 */}
          <CollapsibleSection
            title="关系氛围"
            defaultExpanded={false}
            summary={formData.relationship_atmosphere ? formData.relationship_atmosphere.substring(0, 50) + '...' : null}
            filledCount={formData.relationship_atmosphere ? 1 : 0}
            totalFields={1}
          >
            <div className="field-group">
              <CreativeTextarea
                value={formData.relationship_atmosphere}
                onChange={(value) => handleChange('relationship_atmosphere', value)}
                placeholder="例如：压抑感 / 黏腻 / 危险亲密 / 情欲渗透生活"
              />
            </div>
          </CollapsibleSection>

          {/* 互动细节库 - 默认折叠 */}
          <CollapsibleSection
            title="互动细节库"
            defaultExpanded={false}
            summary={formData.interaction_details?.length > 0 ? `已添加${formData.interaction_details.length}条细节` : null}
            filledCount={formData.interaction_details?.length || 0}
            totalFields={0}
          >
            <div className="field-group">
              <InteractionDetailsCard
                details={formData.interaction_details}
                onChange={(value) => handleChange('interaction_details', value)}
                isEditing={true}
              />
            </div>
          </CollapsibleSection>

          {/* 原作信息 - 默认折叠 */}
          <CollapsibleSection
            title="原作信息"
            defaultExpanded={false}
            summary="只保留：世界观关键规则、重大经历、影响关系的重要事件"
            filledCount={formData.source_material ? 1 : 0}
            totalFields={1}
          >
            <div className="field-group">
              <label className="field-label">只保留：世界观关键规则、重大经历、影响关系的重要事件</label>
              <CreativeTextarea
                value={formData.source_material}
                onChange={(value) => handleChange('source_material', value)}
                placeholder="描述原作中影响关系的关键信息..."
              />
            </div>
          </CollapsibleSection>

          {/* 高级设定 - 默认折叠 */}
          <CollapsibleSection
            title="高级设定"
            defaultExpanded={false}
            filledCount={[formData.ooc_rules, formData.power_flow, formData.relationship_boundaries].filter(Boolean).length}
            totalFields={3}
            tags={['OOC规则', '权力流动', '关系边界']}
          >
            <div className="field-group">
              <label className="field-label">OOC规则</label>
              <CreativeTextarea
                value={formData.ooc_rules}
                onChange={(value) => handleChange('ooc_rules', value)}
                placeholder="例如：更倾向于... / 很少主动... / 即使失控也会... / 不会轻易..."
              />
            </div>

            <div className="field-group">
              <label className="field-label">权力流动</label>
              <CreativeTextarea
                value={formData.power_flow}
                onChange={(value) => handleChange('power_flow', value)}
                placeholder="描述关系中权力的流动和变化..."
              />
            </div>

            <div className="field-group">
              <label className="field-label">关系边界</label>
              <CreativeTextarea
                value={formData.relationship_boundaries}
                onChange={(value) => handleChange('relationship_boundaries', value)}
                placeholder="描述关系中的禁区或不可触碰的话题..."
              />
            </div>
          </CollapsibleSection>

          <div className="form-actions">
            <button type="submit" className="archive-action-btn" disabled={isSubmitting}>
              {isSubmitting ? '保存中...' : '保存档案'}
            </button>
            <Link to="/archive" className="archive-cancel-btn">取消</Link>
          </div>
        </form>
      </main>
    </div>
  )
}

export default CreateCp
