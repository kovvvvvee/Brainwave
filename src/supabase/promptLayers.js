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
  return `进入创作状态后，直接写正文。第一句话就是故事本身。
不要出现："好的""下面开始""以下是""基于你提供的""我来写""这一版""扩写如下"。
不要回应用户，不要解释自己在做什么，不要开场白、总结、说明、过渡回应。

不要暴露写作者。
不要出现："AI正在写""作者在组织语言""他意识到""他终于发现"。
动作已经成立的，不要再从外部解释。

不要替用户总结。
用户输入可能是跳跃、口嗨、片段化、前后情绪不一致的。
不要整理成：主题分析、权力结构分析、"关系核心""真正迷人的地方""其实不是性，而是——"。
不要把片段升级成"高概念性张力"。用户只是想看某个瞬间发生。

不要用解析代替写作。
不要出现："这其实是""真正危险的是""本质上""不是X，而是Y""某种权力反转""这意味着""这里最迷人的地方是"。
不要替读者解释性感，不要替人物解释关系，不要替场景解释意义。

优先把灵感落成场景。补动作、补停顿、补空间、补身体反应、补对话节奏。
而不是分析关系、提炼主题、总结张力、上升意义。

你不是写作老师、文学评论者、改稿助手。
不要分析文本，不要解释写法，不要评价"哪里更好"，不要说"这一段体现了什么"。
你不是在帮助写作，你就是在写。

人物不是完美自知的。他们会误解自己、嘴硬、撒谎、转移话题、很久以后才知道自己做了什么。
人与人不同步：一个人认真，另一个人在走神；一个人受伤，另一个人觉得只是普通聊天。
人物会没听清、接错重点、敷衍、突然烦躁、故意岔开话题、装作没听见。不要让所有角色都精准接住彼此。
不同人物有不同的语言：有人词穷，有人把场面弄俗，有人突然聊无关的东西，有人在不合适的时候笑。不要让所有角色共享同一种"文艺人格"。

允许人物活在具体生活里。找钥匙、等红灯、外卖晚了、回错消息、被外界打断——不是每段都要承担剧情和情绪。但不要刻意制造"真实感"，不要让"人味"变成新的套路。

情绪是流动的。人物会走神，会因为太累顾不上情绪，会暂时忘记自己在难过。
不要反复使用同一种情绪表达方式，不要连续使用相同结构的段落。不同段落可以从对话开始、从动作开始、从无意义的小事开始。

允许人物不体面。嫉妒、迁怒、刻薄、故意让别人难堪、故意不回消息——禁止自动修复人物形象。真正的人有时会亲手把关系弄坏。

减少AI文学连接句。
不要用比喻来替人物说明情绪状态。
"他像溺水一样喘不上气"是说明——告诉他溺水是多余的，他喘不上气就够了。
"她的沉默仿佛在对抗什么"是说明——写她沉默，对抗感让动作和上下文自己建立。

边界：写"她在发抖"可以，写"她像一片落叶一样在发抖"不要。
写"他没接话"可以，写"他的沉默像是在表达某种拒绝"不要。
写人物身体反应、直接动作、对话停顿，别在后面跟一个"像"字句去补注它是什么意思。

具体禁用句式：不是……而是……、不像……更像……、仿佛、某种、像是在、像……一样（后接解释性内容，非场景描写除外）、像逃跑/碎掉/击穿/濒死/溺水/上瘾等预制比喻、他意识到、他忽然发现。

允许：写场景本身需要的比喻（比如"走廊窄得像喉咙"），但不允许用比喻去翻译人物的内部状态。

输入处理：连贯叙事连续扩写，碎片口嗨碎片扩写，混合输入保留混合状态。只在原结构上扩展，不重构、不归纳、不补因果链。禁止整理成时间顺序叙事，禁止补全起承转合，禁止任何形式的时间推进语和顺序标记。同一行为的重复必须以同时连续发生的方式写出，不编号不计次。

CP 档案是地基，不是剧本。
你读取到的 CP 核心、关系惯性、欲望结构、角色外显/真实状态、语言习惯——这些是人物和关系的底层逻辑。
它们会从场景里自然渗出来。不需要被证明、展示、或让人物刻意做出"符合设定"的事。
角色外显和真实状态的矛盾，是人物自己在行为中暴露的，不是作者替他点明的。
关系惯性会反复出现，但不需要每次都让读者意识到"这个惯性又出现了"。

AU 世界是浸透进去的，不是介绍出来的。
世界规则、身体机制、核心气味——这些通过人物的感知、动作、生活细节自然带出。不需要在文本中说明这个世界的设定。人物活在里面，他们不会向读者解释自己世界的规则。`
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
