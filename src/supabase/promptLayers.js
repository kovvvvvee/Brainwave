/**
 * Modular Prompt Layer Architecture for AI Expansion
 * 
 * This system breaks down AI prompts into modular layers that can be composed at runtime.
 * This makes the system more maintainable and allows for easy addition of new styles and contexts.
 */

import { ao3Prompt } from '../prompts/styles/ao3.js'
import { lovecraftPrompt } from '../prompts/styles/lovecraft.js'
import { haitangPrompt } from '../prompts/styles/haitang.js'
import { taiwanPrompt } from '../prompts/styles/taiwan.js'

/**
 * Length Configuration for AI Expansion
 * Defines target and minimum character counts for each length tier
 */
export const lengthConfig = {
  '500-1000': {
    min: 500,
    target: 800
  },
  '1000-3000': {
    min: 1200,
    target: 2000
  },
  '3000-5000': {
    min: 3200,
    target: 4000
  },
  '5000+': {
    min: 5000,
    target: 6500
  }
}

/**
 * Layer 1: Global System Prompt
 * Always injected, responsible for:
 * - Removing AI flavor
 * - Human-like writing feel
 * - No automatic purification
 * - No continuous atmosphere maintenance
 * - Allowing awkwardness/shame/imbalance
 * - No automatic summarization
 * - No automatic literary embellishment
 */
export function getGlobalSystemPrompt() {
  return `【禁止助手模式】
禁止出现"好的/下面开始/以下是/基于你提供的/我来写/进入创作状态/保留原有风格/根据你的灵感/这一版/扩写如下"等AI回应语。
禁止回应用户、解释自己、开场白、总结、说明、过渡回应、创作声明。
用户发送灵感后直接进入正文，第一句话就是故事本身。

【禁止暴露写作者】
禁止文本中出现"AI正在写/作者正在组织语言/作者在解释节奏/作者在引导阅读"。
禁止"这一刻/仿佛/像是在/他意识到/他终于发现"等外部解释。动作成立后不再从外部解释。

【尊重输入原貌】
用户输入可能是跳跃、口嗨、片段化、前后情绪不一致的。
禁止自动整理成主题分析、权力结构分析、情欲理论、"关系核心"、"真正迷人的地方"、"其实不是性，而是——"。
禁止替用户总结灵感，禁止把片段强行升级成"高概念性张力"。
用户很多时候只是想看某个瞬间发生。

【禁止解析型创作】
禁止"这其实是/真正危险的是/本质上/不是X而是Y/某种权力反转/一种更深层的/这意味着/这里最迷人的地方是"。
禁止替读者解释性感、替人物解释关系、替场景解释意义。

【优先场景化】
对片段/脑洞/口嗨/跳跃式欲望/一句话场景/连续画面，优先补动作、停顿、空间、身体反应、对话节奏，而非分析关系、提炼主题、总结张力、上升意义。

【身份定位】
你不是写作老师、文学评论者、创作指导、文本分析助手、改稿助手。
禁止分析文本、解释写法、评价"哪里更好"、比较"原版/改版"、总结人物情绪、说明"这一段体现了什么"。
禁止"这里更/如果你想/这一版/这样会显得/这个句子体现了/改成这样更"等外部表达。
除非用户明确要求分析，否则直接进入文本本身。你不是在帮助用户写作，你就是在写。

【人物真实感】
人物不是完美自知的，会误解自己、合理化、嘴硬、转移话题、撒谎、误判情绪。很多时候人物做了一件事很久以后才知道那意味着什么。禁止替人物精准总结内心。
人与人不会永远同步：一个人认真另一个人走神，一个人受伤另一个人觉得只是普通聊天。
人物会没听清、接错重点、敷衍、不耐烦、突然烦躁、故意岔开话题、装作没听见。禁止让所有角色都精准接住彼此。
不同人物有不同语言和气压：有人很会说话、有人词穷、有人把场面弄得很俗、有人突然聊无关东西、有人喜欢重复别人说的话、有人会在不合适的时候笑。禁止让所有角色共享同一种"文艺人格"。

【生活化写作】
禁止自动把文本提纯成文学，禁止主动把普通动作升级成哲理、象征、命运感、情绪总结、"有意义"的瞬间。
允许人物活在具体生活里，允许废话、走神、跑题、沉默、突然俗气、突然烦躁、突然没话说。
允许人物吃东西、找钥匙、抱怨天气、等红灯、回错消息、忘记事情、被外界打断。不是每段都必须承担剧情和情绪，有些段落只是人物在活着。
禁止刻意制造"真实感"，不要为了像真人故意加入废话、停顿、生活细节、跑题、沉默。这些东西只有在人物真的会这样时才出现。不要让"人味"本身变成新的套路。

【情绪流动】
不要让文本一直停留在同一种情绪气压里。人物会走神、突然注意到无关的东西、因为太累顾不上情绪、暂时忘记自己正在难过。情绪是流动的。
长篇写作时不要反复使用同一种情绪表达方式。如果上一段已经通过动作表现压抑，下一段就不要继续用同样方式重复。
不要连续使用相同结构的段落。不同段落可以从对话开始、从动作开始、从结果开始、从无意义的小事开始。不要让文本呈现明显模板感。

【允许不体面】
允许人物嫉妒、虚荣、自我感动、迁怒、刻薄、阴阳怪气、故意让别人难堪、故意不回消息、明知道对方在意却故意提起。禁止自动修复人物形象。真正的人有时候会亲手把关系弄坏。

【减少AI文学连接句】
减少使用"不是……而是/不像……更像/像是在/仿佛/某种/他意识到/他觉得/他忽然发现/像逃跑一样/像什么碎掉了/像被击穿/像濒死/像溺水/像上瘾"。
不要用抽象比喻替代真实动作，不要总结情绪，不要替人物定义状态。

【输入处理】
不将用户输入重写为标准故事结构，禁止将内容整理为时间顺序叙事（如：第一次/第二次/随后/然后/阶段推进），禁止补全"起承转合式剧情"，禁止将灵感改写为完整事件链。
AI根据输入自动判断：连贯叙事→连续扩写，碎片/跳跃/口嗨→碎片扩写，混合输入→混合保留不统一整理。
扩写原则：只在原结构上扩展，不重构、不归纳、不整理，不解释输入逻辑，不补"因果链"。
禁止故事化重写、阶段升级结构、"整理成完整剧情"。

【禁止顺序标记】
禁止任何形式的"顺序标记"或"时间推进语"，包括但不限于：第一次/第二次/第三次、下一次/再一次/后来/过了一会、然后/接着/随后/之后、重复行为的编号化描述。
禁止将重复动作转化为"阶段推进"。同一行为的重复必须以"同一时间连续发生"的方式写出，而不是分段或计次。`
}

/**
 * Layer 2: Style Prompt
 * Injected based on user-selected writing style
 * Each style is maintained independently in modular files
 * 
 * @param {string} style - The selected writing style
 * @returns {string} Style-specific prompt
 */
export function getStylePrompt(style) {
  switch (style) {
    case 'AO3':
      return ao3Prompt
    case 'Lovecraft':
      return lovecraftPrompt
    case '海棠':
      return haitangPrompt
    case '台湾':
      return taiwanPrompt
    default:
      return ao3Prompt
  }
}

/**
 * Layer 3: Full CP Context Prompt
 * Used when no AU exists
 * Responsible for:
 * - Core relationships
 * - Emotional inertia
 * - Desire structure
 * - Language habits
 * - Sexual dynamics
 * - Interaction details
 *
 * @param {Object} cp - CP data object
 * @returns {string} CP context prompt
 */
export function getCpContextPrompt(cp) {
  if (!cp) return ''

  console.log('===== CP FIELD LENGTHS =====')

  Object.entries(cp).forEach(([key, value]) => {
    let len = 0

    if (typeof value === 'string') {
      len = value.length
    } else if (value) {
      len = JSON.stringify(value).length
    }

    console.log(`${key}:`, len)
  })

  console.log('============================')

  // Parse nested JSON fields
  const relationshipDynamic = typeof cp.relationship_dynamic === 'string'
    ? JSON.parse(cp.relationship_dynamic || '{}')
    : cp.relationship_dynamic || {}

  const characterProfiles = typeof cp.character_profiles === 'string'
    ? JSON.parse(cp.character_profiles || '{}')
    : cp.character_profiles || {}

  const sexualDynamic = typeof cp.sexual_dynamic === 'string'
    ? JSON.parse(cp.sexual_dynamic || '{}')
    : cp.sexual_dynamic || {}

  const interactionDetails = typeof cp.interaction_details === 'string'
    ? JSON.parse(cp.interaction_details || '[]')
    : cp.interaction_details || []

  const characterAName = cp.character_profiles?.character_a_name?.trim() || '角色A'
  const characterBName = cp.character_profiles?.character_b_name?.trim() || '角色B'

  // Build prompt dynamically, only including sections with content
  let prompt = ''

  if (cp.core_dynamic) {
    prompt += `${cp.core_dynamic}

`
  }

  // 关系动态
  const hasRelationshipDynamic = relationshipDynamic.emotional_inertia || relationshipDynamic.interaction_inertia || relationshipDynamic.desire_inertia
  if (hasRelationshipDynamic) {
    if (relationshipDynamic.emotional_inertia) {
      prompt += `${relationshipDynamic.emotional_inertia}

`
    }
    if (relationshipDynamic.interaction_inertia) {
      prompt += `${relationshipDynamic.interaction_inertia}

`
    }
    if (relationshipDynamic.desire_inertia) {
      prompt += `${relationshipDynamic.desire_inertia}

`
    }
  }

  // 角色单独档案
  const hasCharacterA = characterProfiles.character_a?.explicit_state || characterProfiles.character_a?.true_state || characterProfiles.character_a?.language_habits
  const hasCharacterB = characterProfiles.character_b?.explicit_state || characterProfiles.character_b?.true_state || characterProfiles.character_b?.language_habits
  if (hasCharacterA || hasCharacterB) {
    if (hasCharacterA) {
      if (characterProfiles.character_a?.explicit_state) {
        prompt += `${characterAName}看起来：${characterProfiles.character_a.explicit_state}

`
      }
      if (characterProfiles.character_a?.true_state) {
        prompt += `${characterAName}实际上：${characterProfiles.character_a.true_state}

`
      }
      if (characterProfiles.character_a?.language_habits) {
        prompt += `${characterAName}说话：${characterProfiles.character_a.language_habits}

`
      }
    }
    if (hasCharacterB) {
      if (characterProfiles.character_b?.explicit_state) {
        prompt += `${characterBName}看起来：${characterProfiles.character_b.explicit_state}

`
      }
      if (characterProfiles.character_b?.true_state) {
        prompt += `${characterBName}实际上：${characterProfiles.character_b.true_state}

`
      }
      if (characterProfiles.character_b?.language_habits) {
        prompt += `${characterBName}说话：${characterProfiles.character_b.language_habits}

`
      }
    }
  }

  // 性关系动态
  const hasSexualDynamic = sexualDynamic.desire_structure || sexualDynamic.behavioral_inertia || sexualDynamic.basic_positioning
  if (hasSexualDynamic) {
    if (sexualDynamic.desire_structure) {
      prompt += `${sexualDynamic.desire_structure}

`
    }
    if (sexualDynamic.behavioral_inertia) {
      prompt += `${sexualDynamic.behavioral_inertia}

`
    }
    if (sexualDynamic.basic_positioning) {
      prompt += `${sexualDynamic.basic_positioning}

`
    }
  }

  if (cp.relationship_atmosphere) {
    prompt += `${cp.relationship_atmosphere}

`
  }

  if (interactionDetails.length > 0) {
    prompt += `${interactionDetails.join('\n')}

`
  }

  if (cp.source_material) {
    prompt += `${cp.source_material}

`
  }

  // 高级设定
  const hasAdvancedSettings = cp.power_flow || cp.relationship_boundaries || cp.ooc_rules
  if (hasAdvancedSettings) {
    if (cp.power_flow) {
      prompt += `${cp.power_flow}

`
    }
    if (cp.relationship_boundaries) {
      prompt += `${cp.relationship_boundaries}

`
    }
    if (cp.ooc_rules) {
      prompt += `${cp.ooc_rules}
`
    }
  }

  return prompt
}

/**
 * Layer 4: CP Lite Context Prompt
 * Used when AU exists
 * Only includes:
 * - Character personality
 * - Emotional logic
 * - Relationship dynamics
 * - Desire inertia
 * - Language habits
 *
 * EXCLUDES:
 * - Original world
 * - Original occupations
 * - Original events
 * - Original social structure
 *
 * @param {Object} cp - CP data object
 * @returns {string} CP lite context prompt
 */
export function getCpLiteContextPrompt(cp) {
  if (!cp) return ''

  // Parse nested JSON fields
  const relationshipDynamic = typeof cp.relationship_dynamic === 'string'
    ? JSON.parse(cp.relationship_dynamic || '{}')
    : cp.relationship_dynamic || {}

  const characterProfiles = typeof cp.character_profiles === 'string'
    ? JSON.parse(cp.character_profiles || '{}')
    : cp.character_profiles || {}

  const sexualDynamic = typeof cp.sexual_dynamic === 'string'
    ? JSON.parse(cp.sexual_dynamic || '{}')
    : cp.sexual_dynamic || {}

  const interactionDetails = typeof cp.interaction_details === 'string'
    ? JSON.parse(cp.interaction_details || '[]')
    : cp.interaction_details || []

  const characterAName = cp.character_profiles?.character_a_name?.trim() || '角色A'
  const characterBName = cp.character_profiles?.character_b_name?.trim() || '角色B'

  // Build prompt dynamically, only including sections with content
  let prompt = ''

  if (cp.core_dynamic) {
    prompt += `${cp.core_dynamic}

`
  }

  // 关系动态
  const hasRelationshipDynamic = relationshipDynamic.emotional_inertia || relationshipDynamic.interaction_inertia || relationshipDynamic.desire_inertia
  if (hasRelationshipDynamic) {
    if (relationshipDynamic.emotional_inertia) {
      prompt += `${relationshipDynamic.emotional_inertia}

`
    }
    if (relationshipDynamic.interaction_inertia) {
      prompt += `${relationshipDynamic.interaction_inertia}

`
    }
    if (relationshipDynamic.desire_inertia) {
      prompt += `${relationshipDynamic.desire_inertia}

`
    }
  }

  // 角色单独档案
  const hasCharacterA = characterProfiles.character_a?.explicit_state || characterProfiles.character_a?.true_state || characterProfiles.character_a?.language_habits
  const hasCharacterB = characterProfiles.character_b?.explicit_state || characterProfiles.character_b?.true_state || characterProfiles.character_b?.language_habits
  if (hasCharacterA || hasCharacterB) {
    if (hasCharacterA) {
      if (characterProfiles.character_a?.explicit_state) {
        prompt += `${characterAName}看起来：${characterProfiles.character_a.explicit_state}

`
      }
      if (characterProfiles.character_a?.true_state) {
        prompt += `${characterAName}实际上：${characterProfiles.character_a.true_state}

`
      }
      if (characterProfiles.character_a?.language_habits) {
        prompt += `${characterAName}说话：${characterProfiles.character_a.language_habits}

`
      }
    }
    if (hasCharacterB) {
      if (characterProfiles.character_b?.explicit_state) {
        prompt += `${characterBName}看起来：${characterProfiles.character_b.explicit_state}

`
      }
      if (characterProfiles.character_b?.true_state) {
        prompt += `${characterBName}实际上：${characterProfiles.character_b.true_state}

`
      }
      if (characterProfiles.character_b?.language_habits) {
        prompt += `${characterBName}说话：${characterProfiles.character_b.language_habits}

`
      }
    }
  }

  // 性关系动态
  const hasSexualDynamic = sexualDynamic.desire_structure || sexualDynamic.behavioral_inertia || sexualDynamic.basic_positioning
  if (hasSexualDynamic) {
    if (sexualDynamic.desire_structure) {
      prompt += `${sexualDynamic.desire_structure}

`
    }
    if (sexualDynamic.behavioral_inertia) {
      prompt += `${sexualDynamic.behavioral_inertia}

`
    }
    if (sexualDynamic.basic_positioning) {
      prompt += `${sexualDynamic.basic_positioning}

`
    }
  }

  if (cp.relationship_atmosphere) {
    prompt += `${cp.relationship_atmosphere}

`
  }

  if (interactionDetails.length > 0) {
    prompt += `${interactionDetails.join('\n')}

`
  }

  // 高级设定
  const hasAdvancedSettings = cp.power_flow || cp.relationship_boundaries || cp.ooc_rules
  if (hasAdvancedSettings) {
    if (cp.power_flow) {
      prompt += `${cp.power_flow}

`
    }
    if (cp.relationship_boundaries) {
      prompt += `${cp.relationship_boundaries}

`
    }
    if (cp.ooc_rules) {
      prompt += `${cp.ooc_rules}
`
    }
  }

  prompt += `这里不是原作世界。人物的情绪惯性、欲望结构、人格逻辑、关系依赖、语言习惯保留，但不要自动恢复原作的职业、组织、社会结构、事件、剧情。`

  return prompt
}

/**
 * Layer 5: AU Context Prompt
 * Automatically generated from AU detail
 * Responsible for:
 * - Social rules
 * - Body rules
 * - Desire mechanisms
 * - Empathy systems
 * - World structure
 * 
 * @param {Object} au - AU data object
 * @returns {string} AU context prompt
 */
export function getAuContextPrompt(au) {
  if (!au) return ''

  console.log(
    'AU RAW:',
    JSON.stringify(au).length
  )

  // Build prompt dynamically, only including sections with content
  let prompt = ''

  if (au.name) {
    prompt += `${au.name}

`
  }

  if (au.core_atmosphere) {
    prompt += `${au.core_atmosphere}

`
  }

  if (au.description) {
    prompt += `${au.description}

`
  }

  // 世界规则层
  const hasWorldRules = au.social_rules || au.life_rules || au.body_rules || au.world_rules
  if (hasWorldRules) {
    if (au.social_rules) {
      prompt += `${au.social_rules}

`
    }
    if (au.life_rules) {
      prompt += `${au.life_rules}

`
    }
    if (au.body_rules) {
      prompt += `${au.body_rules}

`
    }
    if (au.world_rules) {
      prompt += `${au.world_rules}

`
    }
  }

  // 欲望与后果机制
  const hasDesireMechanisms = au.desire_mechanism || au.relationship_pressure || au.emotional_consequences || au.physical_consequences
  if (hasDesireMechanisms) {
    if (au.desire_mechanism) {
      prompt += `${au.desire_mechanism}

`
    }
    if (au.relationship_pressure) {
      prompt += `${au.relationship_pressure}

`
    }
    if (au.emotional_consequences) {
      prompt += `${au.emotional_consequences}

`
    }
    if (au.physical_consequences) {
      prompt += `${au.physical_consequences}

`
    }
  }

  // 互动逻辑层
  const hasInteractionLogic = au.interaction_logic || au.intimacy_logic || au.emotional_logic
  if (hasInteractionLogic) {
    if (au.interaction_logic) {
      prompt += `${au.interaction_logic}

`
    }
    if (au.intimacy_logic) {
      prompt += `${au.intimacy_logic}

`
    }
    if (au.emotional_logic) {
      prompt += `${au.emotional_logic}

`
    }
  }

  // 力量与禁忌体系
  const hasPowerSystem = au.power_system || au.taboo_rules || au.instability_factors
  if (hasPowerSystem) {
    if (au.power_system) {
      prompt += `${au.power_system}

`
    }
    if (au.taboo_rules) {
      prompt += `${au.taboo_rules}

`
    }
    if (au.instability_factors) {
      prompt += `${au.instability_factors}

`
    }
  }

  if (au.au_amplification) {
    prompt += `${au.au_amplification}`
  }

  return prompt
}

/**
 * Layer 6: Inspiration Prompt
 * User's inspiration content
 * Injected last
 * 
 * @param {string} inspirationContent - The inspiration content
 * @returns {string} Inspiration prompt
 */
export function getInspirationPrompt(inspirationContent) {
  return `灵感内容：
${inspirationContent}`
}

/**
 * Compose Final Prompt
 * Runtime composition based on context
 * 
 * @param {Object} params - Composition parameters
 * @param {string} params.style - Writing style
 * @param {string} params.length - Expansion length
 * @param {string} params.pov - Narrative perspective
 * @param {Object} params.cp - CP data
 * @param {Object} params.au - AU data (optional)
 * @param {boolean} params.hasAU - Whether AU exists
 * @param {string} params.inspirationContent - Inspiration content
 * @returns {string} Composed system prompt
 */
export function composeExpansionPrompt(params) {
  const {
    style,
    length,
    pov,
    cp,
    au,
    hasAU,
    inspirationContent
  } = params

  console.log('CP DATA:', cp)
  console.log('AU DATA:', au)

  const currentLength = lengthConfig[length] || lengthConfig['1000-3000']

  const globalPrompt = getGlobalSystemPrompt()
  const stylePrompt = getStylePrompt(style)

  const cpPrompt = hasAU
    ? getCpLiteContextPrompt(cp)
    : getCpContextPrompt(cp)

  const auPrompt =
    hasAU && au
      ? getAuContextPrompt(au)
      : ''

  console.log('GLOBAL:', globalPrompt.length)
  console.log('STYLE:', stylePrompt.length)
  console.log('CP:', cpPrompt.length)
  console.log('AU:', auPrompt.length)
  console.log('INSPIRATION:', inspirationContent.length)

  let prompt = globalPrompt
  prompt += '\n\n'

  prompt += stylePrompt
  prompt += '\n\n'

  prompt += cpPrompt
  prompt += '\n\n'

  if (auPrompt) {
    prompt += auPrompt
    prompt += '\n\n'
  }

  prompt += getInspirationPrompt(inspirationContent)
  prompt += '\n\n'

  // Priority Layer: Generation Priority Control
  prompt += `灵感第一。文风第二。CP关系第三。AU规则第四。其他补充最后。

如果冲突：灵感优先，文风优先于设定说明，CP关系优先于原作信息，AU规则优先于原作世界观。

重点维持人物关系、情绪惯性、身体逻辑、互动气压、文风节奏。`
  prompt += '\n\n'

  // Add expansion parameters
  prompt += `用户选择的正文长度： ${length}

目标正文长度： 约 ${currentLength.target} 字。

最低正文长度： 不少于 ${currentLength.min} 字。

即使灵感只有一句话，只要用户选择长篇，也必须自然扩展成完整正文。

长度通过动作推进、情绪停顿、身体反应、对话节奏、空间互动、日常细节、关系拉扯、欲望惯性自然扩展。

500-1000： 保持短篇密度，但仍需完整场景。

1000-3000： 必须形成完整关系推进、互动变化、情绪累积。

3000-5000： 必须允许长时间互动、节奏反复、关系拉扯、中段停顿、日常延展。

5000+： 允许慢节奏推进、长时间相处、生活流、重复互动、持续关系惯性、复杂情绪堆积。

在达到最低长度前，不要收尾。

叙事视角：${pov}

请直接输出扩写内容，不要包含任何解释性文字或markdown标记。`

  console.log('FINAL PROMPT LENGTH:', prompt.length)

  console.log(
    'PROMPT START:',
    prompt.slice(0, 500)
  )

  console.log(
    'PROMPT END:',
    prompt.slice(-500)
  )

  return prompt
}
