import { Link, useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCpById, deleteCp, updateCp } from '../supabase/cpService'
import { getAusByCpId } from '../supabase/auService'
import { getUncategorizedInspirationsByCpId, deleteInspiration } from '../supabase/inspirationService'
import { getTagsForInspiration } from '../supabase/tagService'
import CollapsibleSection from '../components/CollapsibleSection'
import CreativeTextarea from '../components/CreativeTextarea'
import DetailCard from '../components/DetailCard'
import InteractionDetailsCard from '../components/InteractionDetailsCard'
import ReadingMode from '../components/ReadingMode'
import './CpDetail.css'

function CpDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cp, setCp] = useState(null)
  const [aus, setAus] = useState([])
  const [uncategorizedInspirations, setUncategorizedInspirations] = useState([])
  const [inspirationTags, setInspirationTags] = useState({})
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    core_one_liner: '',
    relationship_dynamics: {
      emotional_inertia: '',
      interaction_inertia: '',
      desire_inertia: ''
    },
    character_profiles: {
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
    sexual_dynamics: {
      desire_structure: '',
      behavioral_inertia: '',
      basic_positioning: ''
    },
    relationship_atmosphere: '',
    interaction_details: [],
    source_material: '',
    ooc_rules: '',
    power_dynamics: '',
    relationship_boundaries: ''
  })

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchCp()
    fetchAus()
    fetchUncategorizedInspirations()
  }, [id])

  const fetchCp = async () => {
    try {
      const data = await getCpById(id)
      setCp(data)
      
      // Initialize form data with existing values
      setFormData({
        core_one_liner: data.core_one_liner || '',
        relationship_dynamics: data.relationship_dynamics || {
          emotional_inertia: '',
          interaction_inertia: '',
          desire_inertia: ''
        },
        character_profiles: data.character_profiles || {
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
        sexual_dynamics: data.sexual_dynamics || {
          desire_structure: '',
          behavioral_inertia: '',
          basic_positioning: ''
        },
        relationship_atmosphere: data.relationship_atmosphere || '',
        interaction_details: data.interaction_details || [],
        source_material: data.source_material || '',
        ooc_rules: data.ooc_rules || '',
        power_dynamics: data.power_dynamics || '',
        relationship_boundaries: data.relationship_boundaries || ''
      })
    } catch (error) {
      console.error('获取CP详情失败:', error)
    }
  }

  const fetchAus = async () => {
    try {
      const data = await getAusByCpId(id)
      setAus(data)
    } catch (error) {
      console.error('获取AU列表失败:', error)
    }
  }

  const fetchUncategorizedInspirations = async () => {
    try {
      const data = await getUncategorizedInspirationsByCpId(id)
      setUncategorizedInspirations(data)
      
      // Fetch tags for each inspiration
      const tagsMap = {}
      for (const inspiration of data) {
        const tags = await getTagsForInspiration(inspiration.id)
        tagsMap[inspiration.id] = tags
      }
      setInspirationTags(tagsMap)
    } catch (error) {
      console.error('获取未分类灵感失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteInspiration = async (inspirationId) => {
    if (!confirm('确定要删除这条灵感吗？')) return

    try {
      await deleteInspiration(inspirationId)
      fetchUncategorizedInspirations()
    } catch (error) {
      console.error('删除灵感失败:', error)
      alert('删除灵感失败，请重试')
    }
  }

  const handleDeleteCp = async () => {
    if (!confirm('确认删除吗？删除CP将同时删除其所有AU和相关灵感。')) return

    try {
      await deleteCp(id)
      navigate('/cp-list')
    } catch (error) {
      console.error('删除CP失败:', error)
      alert('删除CP失败，请重试')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateCp(id, formData)
      await fetchCp()
      setIsEditing(false)
    } catch (error) {
      console.error('保存失败:', error)
      alert('保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = async () => {
    setIsEditing(false)
    await fetchCp()
  }

  const handleInputChange = (field, value) => {
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

  if (loading) {
    return (
      <div className="cp-detail">
        <div className="loading-state">
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  if (!cp) {
    return (
      <div className="cp-detail">
        <div className="empty-state">
          <p>未找到该CP</p>
          <Link to="/cp-list" className="btn btn-primary">返回CP列表</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cp-detail">
      <header className="page-header">
        <h1>{cp?.name || 'CP详情'}</h1>
        <div className="header-actions">
          {!isEditing ? (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              编辑档案
            </button>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={handleCancel} disabled={saving}>
                取消
              </button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? '保存中...' : '保存'}
              </button>
            </>
          )}
          <button className="btn btn-danger-low" onClick={handleDeleteCp}>
            删除
          </button>
        </div>
      </header>

      <main className="cp-detail-main">
        {/* 基础设定 */}
        <section className="cp-section">
          <div className="section-header">
            <h2 className="section-title">基础设定</h2>
          </div>

          <div className="section-content">
            {/* 1. CP核心一句话 - 默认展开 */}
            <CollapsibleSection
              title="CP核心一句话"
              defaultExpanded={true}
              summary={cp?.core_one_liner ? cp.core_one_liner.substring(0, 50) + '...' : null}
              filledCount={cp?.core_one_liner ? 1 : 0}
              totalFields={1}
            >
              <div className="field-group">
                <label className="field-label">
                  这是关系核心引擎。不是简介。而是"他们为什么互相上瘾"。
                </label>
                {isEditing ? (
                  <CreativeTextarea
                    value={formData.core_one_liner}
                    onChange={(value) => handleInputChange('core_one_liner', value)}
                    placeholder="例如：越克制越失控 / 一个不断试探，一个不断纵容 / 用控制感维持关系，却总被欲望破坏"
                  />
                ) : (
                  <div className="field-display">{cp?.core_one_liner || <span className="empty-placeholder">未填写</span>}</div>
                )}
              </div>
            </CollapsibleSection>

            {/* 2. 关系动态 - 默认展开 */}
            <CollapsibleSection
              title="关系动态"
              defaultExpanded={true}
              summary="不要写剧情。写长期重复出现的关系惯性。"
              filledCount={Object.values(cp?.relationship_dynamics || {}).filter(Boolean).length}
              totalFields={3}
              tags={['情绪惯性', '相处惯性', '欲望惯性']}
            >
              <div className="field-group">
                <label className="field-label">不要写剧情。写长期重复出现的关系惯性。</label>
                <div className="nested-fields">
                  <DetailCard
                    label="【情绪惯性】"
                    value={formData.relationship_dynamics.emotional_inertia}
                    onChange={(value) => handleNestedChange('relationship_dynamics', 'emotional_inertia', value)}
                    placeholder="例如：越冷淡越想靠近 / 一方沉默时另一方会变烦人"
                    isEditing={isEditing}
                  />
                  <DetailCard
                    label="【相处惯性】"
                    value={formData.relationship_dynamics.interaction_inertia}
                    onChange={(value) => handleNestedChange('relationship_dynamics', 'interaction_inertia', value)}
                    placeholder="例如：吵架后反而更黏 / 喜欢用调侃代替示弱"
                    isEditing={isEditing}
                  />
                  <DetailCard
                    label="【欲望惯性】"
                    value={formData.relationship_dynamics.desire_inertia}
                    onChange={(value) => handleNestedChange('relationship_dynamics', 'desire_inertia', value)}
                    placeholder="例如：越压抑越容易失控 / 喜欢观察对方反应"
                    isEditing={isEditing}
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* 3. 角色单独档案 - 默认折叠 */}
            <CollapsibleSection
              title="角色单独档案"
              defaultExpanded={false}
              summary="只写会影响互动的部分。不要写百科。"
              filledCount={Object.values(cp?.character_profiles?.character_a || {}).filter(Boolean).length + Object.values(cp?.character_profiles?.character_b || {}).filter(Boolean).length}
              totalFields={6}
              tags={['外显状态', '真实状态', '语言习惯']}
            >
              <div className="field-group">
                <label className="field-label">只写会影响互动的部分。不要写百科。</label>
                <div className="character-profiles">
                  <div className="character-profile">
                    <h4 className="character-name">角色 A</h4>
                    <div className="nested-fields">
                      <DetailCard
                        label="【外显状态】"
                        value={formData.character_profiles.character_a.explicit_state}
                        onChange={(value) => handleCharacterProfileChange('character_a', 'explicit_state', value)}
                        placeholder="例如：嘴硬 / 控制欲强"
                        isEditing={isEditing}
                      />
                      <DetailCard
                        label="【真实状态】"
                        value={formData.character_profiles.character_a.true_state}
                        onChange={(value) => handleCharacterProfileChange('character_a', 'true_state', value)}
                        placeholder="例如：实际很容易上瘾 / 会偷偷观察对方反应"
                        isEditing={isEditing}
                      />
                      <DetailCard
                        label="【语言习惯】"
                        value={formData.character_profiles.character_a.language_habits}
                        onChange={(value) => handleCharacterProfileChange('character_a', 'language_habits', value)}
                        placeholder="例如：情绪越重越简短 / 很少说完整情话"
                        isEditing={isEditing}
                      />
                    </div>
                  </div>
                  <div className="character-profile">
                    <h4 className="character-name">角色 B</h4>
                    <div className="nested-fields">
                      <DetailCard
                        label="【外显状态】"
                        value={formData.character_profiles.character_b.explicit_state}
                        onChange={(value) => handleCharacterProfileChange('character_b', 'explicit_state', value)}
                        placeholder="例如：嘴硬 / 控制欲强"
                        isEditing={isEditing}
                      />
                      <DetailCard
                        label="【真实状态】"
                        value={formData.character_profiles.character_b.true_state}
                        onChange={(value) => handleCharacterProfileChange('character_b', 'true_state', value)}
                        placeholder="例如：实际很容易上瘾 / 会偷偷观察对方反应"
                        isEditing={isEditing}
                      />
                      <DetailCard
                        label="【语言习惯】"
                        value={formData.character_profiles.character_b.language_habits}
                        onChange={(value) => handleCharacterProfileChange('character_b', 'language_habits', value)}
                        placeholder="例如：情绪越重越简短 / 很少说完整情话"
                        isEditing={isEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* 4. 性关系动态 - 默认折叠 */}
            <CollapsibleSection
              title="性关系动态"
              defaultExpanded={false}
              summary="重点是欲望结构和行为惯性。不是简单写谁1谁0。"
              filledCount={Object.values(cp?.sexual_dynamics || {}).filter(Boolean).length}
              totalFields={3}
              tags={['欲望结构', '行为惯性', '基础定位']}
            >
              <div className="field-group">
                <label className="field-label">重点是欲望结构和行为惯性。不是简单写谁1谁0。</label>
                <div className="nested-fields">
                  <DetailCard
                    label="【欲望结构】"
                    value={formData.sexual_dynamics.desire_structure}
                    onChange={(value) => handleNestedChange('sexual_dynamics', 'desire_structure', value)}
                    placeholder="例如：越压抑越容易失控 / 喜欢观察对方忍耐"
                    isEditing={isEditing}
                  />
                  <DetailCard
                    label="【行为惯性】"
                    value={formData.sexual_dynamics.behavioral_inertia}
                    onChange={(value) => handleNestedChange('sexual_dynamics', 'behavioral_inertia', value)}
                    placeholder="例如：会故意拖长临界状态 / 越沉默越危险"
                    isEditing={isEditing}
                  />
                  <DetailCard
                    label="【基础定位】"
                    value={formData.sexual_dynamics.basic_positioning}
                    onChange={(value) => handleNestedChange('sexual_dynamics', 'basic_positioning', value)}
                    placeholder="例如：通常由A主导进入 / 但控制权经常交换"
                    isEditing={isEditing}
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* 5. 关系氛围 - 默认折叠 */}
            <CollapsibleSection
              title="关系氛围"
              defaultExpanded={false}
              summary={cp?.relationship_atmosphere ? cp.relationship_atmosphere.substring(0, 50) + '...' : null}
              filledCount={cp?.relationship_atmosphere ? 1 : 0}
              totalFields={1}
            >
              <div className="field-group">
                {isEditing ? (
                  <CreativeTextarea
                    value={formData.relationship_atmosphere}
                    onChange={(value) => handleInputChange('relationship_atmosphere', value)}
                    placeholder="例如：压抑感 / 黏腻 / 危险亲密 / 情欲渗透生活"
                  />
                ) : (
                  <div className="field-display">
                    {cp?.relationship_atmosphere ? (
                      <ReadingMode 
                        content={cp.relationship_atmosphere}
                        defaultExpanded={false}
                        showPreview={true}
                        previewLines={2}
                      />
                    ) : (
                      <span className="empty-placeholder">未填写</span>
                    )}
                  </div>
                )}
              </div>
            </CollapsibleSection>

            {/* 6. 互动细节库 - 默认折叠 */}
            <CollapsibleSection
              title="互动细节库"
              defaultExpanded={false}
              summary={cp?.interaction_details?.length > 0 ? `已添加${cp.interaction_details.length}条细节` : null}
              filledCount={cp?.interaction_details?.length || 0}
              totalFields={0}
            >
              <div className="field-group">
                <InteractionDetailsCard
                  details={formData.interaction_details}
                  onChange={(value) => handleInputChange('interaction_details', value)}
                  isEditing={isEditing}
                />
              </div>
            </CollapsibleSection>

            {/* 7. 原作信息 - 默认折叠 */}
            <CollapsibleSection
              title="原作信息"
              defaultExpanded={false}
              summary="只保留：世界观关键规则、重大经历、影响关系的重要事件"
              filledCount={cp?.source_material ? 1 : 0}
              totalFields={1}
            >
              <div className="field-group">
                <label className="field-label">只保留：世界观关键规则、重大经历、影响关系的重要事件</label>
                {isEditing ? (
                  <CreativeTextarea
                    value={formData.source_material}
                    onChange={(value) => handleInputChange('source_material', value)}
                    placeholder="描述原作中影响关系的关键信息..."
                  />
                ) : (
                  <div className="field-display">
                    {cp?.source_material ? (
                      <ReadingMode 
                        content={cp.source_material}
                        defaultExpanded={false}
                        showPreview={true}
                        previewLines={2}
                      />
                    ) : (
                      <span className="empty-placeholder">未填写</span>
                    )}
                  </div>
                )}
              </div>
            </CollapsibleSection>
          </div>
        </section>

        {/* 高级设定 - 默认折叠 */}
        <section className="cp-section advanced-section">
          <CollapsibleSection
            title="高级设定"
            defaultExpanded={false}
            filledCount={[cp?.ooc_rules, cp?.power_dynamics, cp?.relationship_boundaries].filter(Boolean).length}
            totalFields={3}
            tags={['禁止OOC规则', '权力流动', '关系禁区']}
          >
            <div className="section-content">
              {/* 1. 禁止OOC规则 */}
              <div className="field-group">
                <label className="field-label">
                  禁止OOC规则
                  <span className="field-description">描述角色绝对不会做的事情或行为模式</span>
                </label>
                {isEditing ? (
                  <CreativeTextarea
                    value={formData.ooc_rules}
                    onChange={(value) => handleInputChange('ooc_rules', value)}
                    placeholder="例如：更倾向于... / 很少主动... / 即使失控也会... / 不会轻易..."
                  />
                ) : (
                  <div className="field-display">
                    {cp?.ooc_rules ? (
                      <ReadingMode 
                        content={cp.ooc_rules}
                        defaultExpanded={false}
                        showPreview={true}
                        previewLines={2}
                      />
                    ) : (
                      <span className="empty-placeholder">未填写</span>
                    )}
                  </div>
                )}
              </div>

              {/* 2. 权力流动 */}
              <div className="field-group">
                <label className="field-label">权力流动</label>
                {isEditing ? (
                  <CreativeTextarea
                    value={formData.power_dynamics}
                    onChange={(value) => handleInputChange('power_dynamics', value)}
                    placeholder="描述关系中权力的流动和变化..."
                  />
                ) : (
                  <div className="field-display">
                    {cp?.power_dynamics ? (
                      <ReadingMode 
                        content={cp.power_dynamics}
                        defaultExpanded={false}
                        showPreview={true}
                        previewLines={2}
                      />
                    ) : (
                      <span className="empty-placeholder">未填写</span>
                    )}
                  </div>
                )}
              </div>

              {/* 3. 关系禁区 */}
              <div className="field-group">
                <label className="field-label">关系禁区</label>
                {isEditing ? (
                  <CreativeTextarea
                    value={formData.relationship_boundaries}
                    onChange={(value) => handleInputChange('relationship_boundaries', value)}
                    placeholder="描述关系中的禁区或不可触碰的话题..."
                  />
                ) : (
                  <div className="field-display">
                    {cp?.relationship_boundaries ? (
                      <ReadingMode 
                        content={cp.relationship_boundaries}
                        defaultExpanded={false}
                        showPreview={true}
                        previewLines={2}
                      />
                    ) : (
                      <span className="empty-placeholder">未填写</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CollapsibleSection>
        </section>

        {/* AU列表 */}
        <section className="au-list-section">
          <div className="section-header-inline">
            <h2 className="section-title">AU列表</h2>
            <Link to={`/cp/${id}/create-au`} className="btn btn-secondary btn-small">创建AU</Link>
          </div>
          {aus.length === 0 ? (
            <div className="au-list-placeholder">
              <p>暂无AU，点击上方按钮创建</p>
            </div>
          ) : (
            <div className="au-list-inline">
              {aus.map(au => (
                <div key={au.id} className="au-item-light">
                  <span className="au-name-inline">{au.name}</span>
                  <Link to={`/au/${au.id}`} className="btn btn-secondary btn-small">查看详情</Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="inspiration-list-section">
          <h2 className="section-title">普通灵感</h2>
          <div className="inspiration-list">
            {uncategorizedInspirations.length === 0 ? (
              <div className="inspiration-empty">
                <p>暂无普通灵感</p>
              </div>
            ) : (
              uncategorizedInspirations.map((inspiration) => (
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
                      className="btn btn-danger-low btn-small"
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

export default CpDetail
