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
import FloatingActionBar from '../components/FloatingActionBar'
import ArchiveSymbol from '../components/ArchiveSymbol'
import ArchiveResidue from '../components/ArchiveResidue'
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

  // Helper function to check if a string value is filled
  const isStringFilled = (value) => {
    if (value == null) return false
    if (typeof value !== 'string') return false
    return value.trim().length > 0
  }

  // Helper function to check if an array is filled (has items)
  const isArrayFilled = (value) => {
    if (value == null) return false
    // Handle JSON string arrays
    const parsed = typeof value === 'string' ? (() => {
      try {
        return JSON.parse(value)
      } catch {
        return null
      }
    })() : value
    return Array.isArray(parsed) && parsed.length > 0
  }

  // Helper function to normalize interaction_details to clean array
  const normalizeInteractionDetails = (value) => {
    if (value == null) return []
    let parsed = value
    // Handle JSON string
    if (typeof value === 'string') {
      try {
        parsed = JSON.parse(value)
      } catch {
        // If not valid JSON, treat as single string
        parsed = value
      }
    }
    // Ensure it's an array
    if (!Array.isArray(parsed)) {
      return []
    }
    // Filter out empty strings
    return parsed.filter(item => typeof item === 'string' && item.trim() !== '')
  }

  // Helper function to parse JSON fields from database
  const parseJsonField = (value, defaultValue) => {
    if (value == null) return defaultValue
    if (typeof value === 'object') return value
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value)
        return parsed || defaultValue
      } catch {
        return defaultValue
      }
    }
    return defaultValue
  }

  // Helper function to count filled fields in a nested object
  const countFilledNestedFields = (obj) => {
    if (!obj || typeof obj !== 'object') return 0
    return Object.values(obj).filter(value => isStringFilled(value)).length
  }
  
  // Form state
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchCp()
    fetchAus()
    fetchUncategorizedInspirations()
  }, [id])

  // Force layout recalculation after all components are rendered
  useEffect(() => {
    if (!loading && cp) {
      const recalculateLayout = () => {
        // Wait for all components to finish rendering
        requestAnimationFrame(() => {
          // First pass: let browser paint
          requestAnimationFrame(() => {
            // Force reflow by reading layout
            document.body.offsetHeight

            // Second pass: after paint is complete
            setTimeout(() => {
              // Force reflow again
              document.body.offsetHeight

              // Trigger resize event for any listeners
              window.dispatchEvent(new Event('resize'))

              // Force re-measure all textareas
              const textareas = document.querySelectorAll('.creative-textarea')
              textareas.forEach(textarea => {
                textarea.style.height = 'auto'
                textarea.style.height = textarea.scrollHeight + 'px'
              })

              // Force re-measure all collapsible sections
              const sections = document.querySelectorAll('.collapsible-section')
              sections.forEach(section => {
                section.style.height = 'auto'
              })

              // Force re-measure archive decoration symbols
              const residues = document.querySelectorAll('.archive-residue')
              residues.forEach(residue => {
                residue.style.opacity = '0'
                setTimeout(() => {
                  residue.style.opacity = residue.dataset.opacity || '0.1'
                }, 10)
              })

              // Final layout pass
              setTimeout(() => {
                document.body.offsetHeight
                window.dispatchEvent(new Event('resize'))
              }, 50)
            }, 150)
          })
        })
      }

      recalculateLayout()
    }
  }, [loading, cp, isEditing])

  const fetchCp = async () => {
    try {
      const data = await getCpById(id)
      console.log('FETCHED CP:', data)
      console.log('FETCHED CP.character_profiles:', data?.character_profiles)
      console.log('FETCHED CP.character_profiles type:', typeof data?.character_profiles)
      setCp(data)
      console.log('fetchCp - setCp 已调用')

      // Parse character_profiles from database - MUST parse before any spread operations
      const parsedProfiles = typeof data?.character_profiles === 'string'
        ? JSON.parse(data.character_profiles)
        : data?.character_profiles || {}

      console.log('PARSED character_profiles:', parsedProfiles)
      console.log('PARSED character_profiles type:', typeof parsedProfiles)
      console.log('PARSED character_a_name:', parsedProfiles.character_a_name)
      console.log('PARSED character_b_name:', parsedProfiles.character_b_name)

      // Verify it's an object, not a string or character-indexed object
      if (parsedProfiles['0'] !== undefined) {
        console.error('ERROR: character_profiles was spread as string, got character-indexed object:', parsedProfiles)
      }

      setFormData({
        core_dynamic: data?.core_dynamic || '',
        relationship_dynamic: parseJsonField(data?.relationship_dynamic, {
          emotional_inertia: '',
          interaction_inertia: '',
          desire_inertia: ''
        }),
        character_profiles: {
          character_a_name: parsedProfiles.character_a_name || '',
          character_b_name: parsedProfiles.character_b_name || '',
          character_a: {
            explicit_state: parsedProfiles.character_a?.explicit_state || '',
            true_state: parsedProfiles.character_a?.true_state || '',
            language_habits: parsedProfiles.character_a?.language_habits || ''
          },
          character_b: {
            explicit_state: parsedProfiles.character_b?.explicit_state || '',
            true_state: parsedProfiles.character_b?.true_state || '',
            language_habits: parsedProfiles.character_b?.language_habits || ''
          }
        },
        sexual_dynamic: parseJsonField(data?.sexual_dynamic, {
          desire_structure: '',
          behavioral_inertia: '',
          basic_positioning: ''
        }),
        relationship_atmosphere: data?.relationship_atmosphere || '',
        interaction_details: normalizeInteractionDetails(data?.interaction_details),
        source_material: data?.source_material || '',
        ooc_rules: data?.ooc_rules || '',
        power_flow: data?.power_flow || '',
        relationship_boundaries: data?.relationship_boundaries || ''
      })
      console.log('fetchCp - setFormData 已调用')
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
      navigate('/archive')
    } catch (error) {
      console.error('删除CP失败:', error)
      alert('删除CP失败，请重试')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      console.log('SAVE - formData.character_profiles:', formData.character_profiles)
      console.log('SAVE - formData.character_profiles.character_a_name:', formData.character_profiles.character_a_name)
      console.log('SAVE - formData.character_profiles.character_b_name:', formData.character_profiles.character_b_name)
      
      // Explicitly reconstruct character_profiles to ensure names are included
      const reconstructedCharacterProfiles = {
        character_a_name: formData.character_profiles?.character_a_name || "",
        character_b_name: formData.character_profiles?.character_b_name || "",
        character_a: {
          explicit_state: formData.character_profiles?.character_a?.explicit_state || "",
          true_state: formData.character_profiles?.character_a?.true_state || "",
          language_habits: formData.character_profiles?.character_a?.language_habits || ""
        },
        character_b: {
          explicit_state: formData.character_profiles?.character_b?.explicit_state || "",
          true_state: formData.character_profiles?.character_b?.true_state || "",
          language_habits: formData.character_profiles?.character_b?.language_habits || ""
        }
      }
      
      console.log('RECONSTRUCTED CHARACTER PROFILES:', reconstructedCharacterProfiles)
      
      // Prepare payload with JSON stringified nested fields
      const savePayload = {
        name: formData.name,
        core_dynamic: formData.core_dynamic || null,
        relationship_dynamic: JSON.stringify(formData.relationship_dynamic),
        character_profiles: JSON.stringify(reconstructedCharacterProfiles),
        sexual_dynamic: JSON.stringify(formData.sexual_dynamic),
        relationship_atmosphere: formData.relationship_atmosphere || null,
        interaction_details: JSON.stringify(formData.interaction_details),
        source_material: formData.source_material || null,
        ooc_rules: formData.ooc_rules || null,
        power_flow: formData.power_flow || null,
        relationship_boundaries: formData.relationship_boundaries || null
      }
      
      console.log('FINAL CHARACTER PROFILES', reconstructedCharacterProfiles)
      console.log('保存 payload from formData:', formData)
      console.log('保存 payload to Supabase:', savePayload)
      
      const updatedData = await updateCp(id, savePayload)
      console.log('updateCp 返回值:', updatedData)
      
      await fetchCp()
      console.log('fetchCp 后的 cp 状态:', cp)
      
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
    setFormData(prev => {
      const newFormData = {
        ...prev,
        character_profiles: {
          ...prev.character_profiles,
          [character]: {
            ...prev.character_profiles[character],
            [field]: value
          }
        }
      }
      console.log('handleCharacterProfileChange - character:', character, 'field:', field, 'value:', value)
      console.log('handleCharacterProfileChange - new character_profiles:', newFormData.character_profiles)
      return newFormData
    })
  }

  const handleCharacterNameChange = (character, value) => {
    setFormData(prev => {
      const newFormData = {
        ...prev,
        character_profiles: {
          ...prev.character_profiles,
          [character]: value
        }
      }
      console.log('handleCharacterNameChange - character:', character, 'value:', value)
      console.log('handleCharacterNameChange - new character_profiles:', newFormData.character_profiles)
      return newFormData
    })
  }

  if (loading) {
    return (
      <div className="cp-detail">
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
        <div className="archive-loading">
          <p className="archive-loading-text">Reading Relationship File...</p>
        </div>
      </div>
    )
  }

  if (!cp) {
    return (
      <div className="cp-detail">
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
        <div className="archive-empty">
          <p>档案未找到</p>
          <Link to="/cp-list" className="archive-btn">返回档案列表</Link>
        </div>
      </div>
    )
  }

  // Parse JSON fields for display mode - MUST parse before using
  const parsedProfiles = typeof cp.character_profiles === 'string'
    ? JSON.parse(cp.character_profiles)
    : cp.character_profiles || {}

  const parsedRelationshipDynamic = typeof cp.relationship_dynamic === 'string'
    ? JSON.parse(cp.relationship_dynamic)
    : cp.relationship_dynamic || {}

  const parsedSexualDynamic = typeof cp.sexual_dynamic === 'string'
    ? JSON.parse(cp.sexual_dynamic)
    : cp.sexual_dynamic || {}

  // Extract character names for display
  const characterAName = parsedProfiles.character_a_name?.trim() || '角色A'
  const characterBName = parsedProfiles.character_b_name?.trim() || '角色B'

  console.log('RENDER - parsedProfiles:', parsedProfiles)
  console.log('RENDER - characterAName:', characterAName)
  console.log('RENDER - characterBName:', characterBName)

  return (
    <div className="cp-detail">
      {console.log('CpDetail render - cp state:', cp)}
      
      {/* Background illustration - subtle mood element */}
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
      
      <button 
        className="back-to-archive-button"
        onClick={() => navigate('/archive')}
      >
        ← 返回档案列表
      </button>
      
      <header className="page-header">
        <div className="header-main">
          <h1>{cp?.name || 'CP详情'}</h1>
          <div className="scan-timestamp">
          </div>
        </div>
        <div className="header-archive-mark"></div>
        <div className="header-actions">
          {!isEditing && (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              编辑档案
            </button>
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
            {/* 1. CP核心一句话 */}
            <CollapsibleSection
              title="CP核心一句话"
              defaultExpanded={false}
            >
              <div className="field-group">
                {isEditing ? (
                  <CreativeTextarea
                    value={formData.core_dynamic}
                    onChange={(value) => handleInputChange('core_dynamic', value)}
                    placeholder="例如：越克制越失控 / 一个不断试探，一个不断纵容 / 用控制感维持关系，却总被欲望破坏"
                  />
                ) : (
                  <div className="field-display">{cp?.core_dynamic?.trim() ? cp.core_dynamic : <span className="empty-placeholder">未填写</span>}</div>
                )}
              </div>
            </CollapsibleSection>

            {/* 2. 关系动态 */}
            <CollapsibleSection
              title="关系动态"
              defaultExpanded={false}
            >
              <div className="field-group">
                <div className="nested-fields">
                  <DetailCard
                    label="【情绪惯性】"
                    value={isEditing ? formData.relationship_dynamic?.emotional_inertia || '' : parsedRelationshipDynamic?.emotional_inertia || ''}
                    onChange={(value) => handleNestedChange('relationship_dynamic', 'emotional_inertia', value)}
                    placeholder="例如：越冷淡越想靠近 / 一方沉默时另一方会变烦人"
                    isEditing={isEditing}
                  />
                  <DetailCard
                    label="【相处惯性】"
                    value={isEditing ? formData.relationship_dynamic?.interaction_inertia || '' : parsedRelationshipDynamic?.interaction_inertia || ''}
                    onChange={(value) => handleNestedChange('relationship_dynamic', 'interaction_inertia', value)}
                    placeholder="例如：吵架后反而更黏 / 喜欢用调侃代替示弱"
                    isEditing={isEditing}
                  />
                  <DetailCard
                    label="【欲望惯性】"
                    value={isEditing ? formData.relationship_dynamic?.desire_inertia || '' : parsedRelationshipDynamic?.desire_inertia || ''}
                    onChange={(value) => handleNestedChange('relationship_dynamic', 'desire_inertia', value)}
                    placeholder="例如：越压抑越容易失控 / 喜欢观察对方反应"
                    isEditing={isEditing}
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* 3. 角色单独档案 */}
            <CollapsibleSection
              title="角色单独档案"
              defaultExpanded={false}
            >
              <div className="character-profiles">
                <div className="character-profile">
                  <div className="character-header">
                    {isEditing ? (
                      <input
                        type="text"
                        className="character-name-input"
                        value={formData.character_profiles?.character_a_name || ''}
                        onChange={(e) => handleCharacterNameChange('character_a_name', e.target.value)}
                        placeholder="角色A名称"
                      />
                    ) : (
                      <h4 className="character-name">{characterAName}</h4>
                    )}
                  </div>
                  <div className="character-content">
                    <div className="nested-fields">
                    <DetailCard
                      label="【外显状态】"
                      value={isEditing ? formData.character_profiles?.character_a?.explicit_state || '' : parsedProfiles.character_a?.explicit_state || ''}
                      onChange={(value) => handleCharacterProfileChange('character_a', 'explicit_state', value)}
                      placeholder="例如：嘴硬 / 控制欲强"
                      isEditing={isEditing}
                    />
                    <DetailCard
                      label="【真实状态】"
                      value={isEditing ? formData.character_profiles?.character_a?.true_state || '' : parsedProfiles.character_a?.true_state || ''}
                      onChange={(value) => handleCharacterProfileChange('character_a', 'true_state', value)}
                      placeholder="例如：实际很容易上瘾 / 会偷偷观察对方反应"
                      isEditing={isEditing}
                    />
                    <DetailCard
                      label="【语言习惯】"
                      value={isEditing ? formData.character_profiles?.character_a?.language_habits || '' : parsedProfiles.character_a?.language_habits || ''}
                      onChange={(value) => handleCharacterProfileChange('character_a', 'language_habits', value)}
                      placeholder="例如：情绪越重越简短 / 很少说完整情话"
                      isEditing={isEditing}
                    />
                  </div>
                  </div>
                </div>
                <div className="character-profile">
                  <div className="character-header">
                    {isEditing ? (
                      <input
                        type="text"
                        className="character-name-input"
                        value={formData.character_profiles?.character_b_name || ''}
                        onChange={(e) => handleCharacterNameChange('character_b_name', e.target.value)}
                        placeholder="角色B名称"
                      />
                    ) : (
                      <h4 className="character-name">{characterBName}</h4>
                    )}
                  </div>
                  <div className="character-content">
                    <div className="nested-fields">
                    <DetailCard
                      label="【外显状态】"
                      value={isEditing ? formData.character_profiles?.character_b?.explicit_state || '' : parsedProfiles.character_b?.explicit_state || ''}
                      onChange={(value) => handleCharacterProfileChange('character_b', 'explicit_state', value)}
                      placeholder="例如：嘴硬 / 控制欲强"
                      isEditing={isEditing}
                    />
                    <DetailCard
                      label="【真实状态】"
                      value={isEditing ? formData.character_profiles?.character_b?.true_state || '' : parsedProfiles.character_b?.true_state || ''}
                      onChange={(value) => handleCharacterProfileChange('character_b', 'true_state', value)}
                      placeholder="例如：实际很容易上瘾 / 会偷偷观察对方反应"
                      isEditing={isEditing}
                    />
                    <DetailCard
                      label="【语言习惯】"
                      value={isEditing ? formData.character_profiles?.character_b?.language_habits || '' : parsedProfiles.character_b?.language_habits || ''}
                      onChange={(value) => handleCharacterProfileChange('character_b', 'language_habits', value)}
                      placeholder="例如：情绪越重越简短 / 很少说完整情话"
                      isEditing={isEditing}
                    />
                  </div>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* 4. 性关系动态 */}
            <CollapsibleSection
              title="性关系动态"
              defaultExpanded={false}
            >
              <div className="field-group">
                <div className="nested-fields">
                  <DetailCard
                    label="【欲望结构】"
                    value={isEditing ? formData.sexual_dynamic?.desire_structure || '' : parsedSexualDynamic?.desire_structure || ''}
                    onChange={(value) => handleNestedChange('sexual_dynamic', 'desire_structure', value)}
                    placeholder="例如：越压抑越容易失控 / 喜欢观察对方忍耐"
                    isEditing={isEditing}
                  />
                  <DetailCard
                    label="【行为惯性】"
                    value={isEditing ? formData.sexual_dynamic?.behavioral_inertia || '' : parsedSexualDynamic?.behavioral_inertia || ''}
                    onChange={(value) => handleNestedChange('sexual_dynamic', 'behavioral_inertia', value)}
                    placeholder="例如：会故意拖长临界状态 / 越沉默越危险"
                    isEditing={isEditing}
                  />
                  <DetailCard
                    label="【基础定位】"
                    value={isEditing ? formData.sexual_dynamic?.basic_positioning || '' : parsedSexualDynamic?.basic_positioning || ''}
                    onChange={(value) => handleNestedChange('sexual_dynamic', 'basic_positioning', value)}
                    placeholder="例如：通常由A主导进入 / 但控制权经常交换"
                    isEditing={isEditing}
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* 5. 关系氛围 */}
            <CollapsibleSection
              title="关系氛围"
              defaultExpanded={false}
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
                        content={cp?.relationship_atmosphere}
                        defaultExpanded={false}
                        showPreview={true}
                      />
                    ) : (
                      <span className="empty-placeholder">未填写</span>
                    )}
                  </div>
                )}
              </div>
            </CollapsibleSection>

            {/* 6. 互动细节库 */}
            <CollapsibleSection
              title="互动细节库"
              defaultExpanded={false}
            >
              <div className="field-group">
                <InteractionDetailsCard
                  details={formData.interaction_details || []}
                  onChange={(value) => handleInputChange('interaction_details', value)}
                  isEditing={isEditing}
                />
              </div>
            </CollapsibleSection>

            {/* 7. 原作信息 */}
            <CollapsibleSection
              title="原作信息"
              defaultExpanded={false}
            >
              <div className="field-group">
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
                        content={cp?.source_material}
                        defaultExpanded={false}
                        showPreview={true}
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

        {/* 高级设定 */}
        <section className="cp-section advanced-section">
          <CollapsibleSection
            title="高级设定"
            defaultExpanded={false}
          >
            <div className="section-content">
              {/* 1. 权力流动 */}
              <div className="field-group">
                <label className="field-label">权力流动</label>
                {isEditing ? (
                  <CreativeTextarea
                    value={formData.power_flow}
                    onChange={(value) => handleInputChange('power_flow', value)}
                    placeholder="描述关系中权力的流动和变化..."
                  />
                ) : (
                  <div className="field-display">
                    {cp?.power_flow ? (
                      <ReadingMode
                        content={cp?.power_flow}
                        defaultExpanded={false}
                        showPreview={true}
                      />
                    ) : (
                      <span className="empty-placeholder">未填写</span>
                    )}
                  </div>
                )}
              </div>

              {/* 2. 关系边界 */}
              <div className="field-group">
                <label className="field-label">关系边界</label>
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
                        content={cp?.relationship_boundaries}
                        defaultExpanded={false}
                        showPreview={true}
                      />
                    ) : (
                      <span className="empty-placeholder">未填写</span>
                    )}
                  </div>
                )}
              </div>

              {/* 3. OOC规则 */}
              <div className="field-group">
                <label className="field-label">OOC规则</label>
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
                        content={cp?.ooc_rules}
                        defaultExpanded={false}
                        showPreview={true}
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
                  <div className="au-main-inline">
                    <span className="au-name-inline">{au.name}</span>
                  </div>
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
      
      {isEditing && (
        <FloatingActionBar 
          onCancel={handleCancel}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </div>
  )
}

export default CpDetail
