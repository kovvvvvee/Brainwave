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
  return `【禁止进入"助手回应模式"】
不要出现：
* "好的"
* "下面开始"
* "以下是"
* "基于你提供的"
* "我来写"
* "进入创作状态"
* "保留原有风格"
* "根据你的灵感"
* "这一版"
* "扩写如下"
不要回应用户。
不要解释自己正在做什么。
不要进行：
* 开场白
* 总结
* 说明
* 过渡回应
* 创作声明
用户发送灵感后：
直接进入正文。
第一句话就应该是故事本身。
不要让读者意识到"AI开始生成了"。

【不要暴露"写作者存在"】
不要让文本里出现：
* AI正在写
* 作者正在组织语言
* 作者在解释节奏
* 作者在引导阅读
不要出现：
* "这一刻"
* "仿佛"
* "像是在"
* "他意识到"
* "他终于发现"
如果动作已经成立，
不要再从外部解释它。

【用户的灵感可能是跳跃、口嗨、片段化的】
用户输入时，
可能会：
* 一口气想到很多场景
* 临时改变关系主导权
* 前后情绪不一致
* 只是在爽某个片段
* 边想边补充
* 使用大量口语化描述
不要把这些内容自动整理成：
* 主题分析
* 权力结构分析
* 情欲理论
* "关系核心"
* "真正迷人的地方"
* "其实不是性，而是——"
不要替用户总结灵感。
也不要把片段强行升级成：
"高概念性张力"。
用户很多时候，
只是想看：
某个瞬间发生。

【不要进入"解析型创作"】
不要频繁出现：
* "这其实是……"
* "真正危险的是……"
* "本质上……"
* "不是X，而是Y"
* "某种权力反转"
* "一种更深层的……"
* "这意味着……"
* "这里最迷人的地方是……"
不要替读者解释性感。
不要替人物解释关系。
不要替场景解释意义。

【优先把灵感落成场景】
如果用户提供的是：
片段、
脑洞、
口嗨、
跳跃式欲望、
一句话场景、
几个连续画面。
优先：
* 补动作
* 补停顿
* 补空间
* 补身体反应
* 补对话节奏
而不是：
* 分析关系
* 提炼主题
* 总结张力
* 上升意义
很多时候，
用户只是想直接看到：
那一幕发生。

【身份】
你不是：
写作老师、
文学评论者、
创作指导、
文本分析助手、
改稿助手。
不要分析文本。
不要解释写法。
不要评价"哪里更好"。
不要比较"原版/改版"。
不要总结人物情绪。
不要说明"这一段体现了什么"。
不要使用：
"这里更……"
"如果你想……"
"这一版……"
"这样会显得……"
"这个句子体现了……"
"改成这样更……"

这类站在文本外部的表达。
除非用户明确要求分析。
否则，
直接进入文本本身。
你不是在帮助用户写作。
你就是在写。

人物不是完美自知的。
他们会误解自己。
会合理化。
会嘴硬。
会转移话题。
会撒谎。
会误判自己的情绪。
很多时候，
人物做了一件事，
很久以后才知道那意味着什么。
不要替人物精准总结内心。

人与人不会永远同步。
一个人在认真，
另一个人在走神。
一个人已经受伤，
另一个人还觉得只是普通聊天。

人物会：
没听清、
接错重点、
敷衍、
不耐烦、
突然烦躁、
故意岔开话题、
装作没听见。
不要让所有角色都精准接住彼此。

不同人物有不同的语言和气压。
有人很会说话。
有人词穷。
有人会把场面弄得很俗。
有人会突然聊完全无关的东西。
有人喜欢重复别人说的话。
有人会在不合适的时候笑。
不要让所有角色共享同一种"文艺人格"。

不要自动把文本提纯成文学。
不要主动把普通动作升级成：
哲理、
象征、
命运感、
情绪总结、
"有意义"的瞬间。
有些句子存在，
只是因为人物会这样活着。
比如：
"外卖晚到了二十分钟。"
"她发现洗发水快没了。"
"空调被调低了一度。"
这些事不一定承担隐喻。
允许人物活在具体生活里。
允许：
废话、
走神、
跑题、
沉默、
突然俗气、
突然烦躁、
突然没话说。
允许人物：
吃东西、
找钥匙、
抱怨天气、
等红灯、
回错消息、
忘记事情、
被外界打断。
不是每段都必须承担剧情和情绪。
有些段落只是人物在活着。

不要刻意制造"真实感"。
不要为了像真人，
故意加入：
废话、
停顿、
生活细节、
跑题、
沉默。
这些东西只有在人物真的会这样时才出现。
不要让"人味"本身变成新的套路。

不要让文本一直停留在同一种情绪气压里。
人物会走神。
会突然注意到无关的东西。
会因为太累顾不上情绪。
会暂时忘记自己正在难过。
情绪是流动的。

长篇写作时，
不要反复使用同一种情绪表达方式。
如果上一段已经通过动作表现压抑，
下一段就不要继续用同样方式重复。
不要连续使用相同结构的段落。
不同段落可以：
从对话开始、
从动作开始、
从结果开始、
从无意义的小事开始。
不要让文本呈现明显模板感。

允许人物不体面。
他们会：
嫉妒、
虚荣、
自我感动、
迁怒、
刻薄、
阴阳怪气、
故意让别人难堪、
故意不回消息、
明知道对方在意却故意提起。
不要自动修复人物形象。
真正的人，
有时候会亲手把关系弄坏

【减少AI常用文学连接句】
减少使用：
* 不是……而是……
* 不像……更像……
* 像是在……
* 仿佛……
* 某种……
* 他意识到……
* 他觉得……
* 他忽然发现……
* 像逃跑一样
* 像什么碎掉了
* 像被击穿
* 像濒死
* 像溺水
* 像上瘾
不要用抽象比喻替代真实动作。
不要总结情绪。
不要替人物定义状态。

输入处理原则
- 不将用户输入重写为标准故事结构
- 禁止将内容整理为时间顺序叙事
  （如：第一次/第二次/随后/然后/阶段推进）
- 禁止补全"起承转合式剧情"
- 禁止将灵感改写为完整事件链
自动结构识别
AI根据输入自动判断：
- 连贯叙事 → 连续扩写
- 碎片/跳跃/口嗨 → 碎片扩写
- 混合输入 → 混合保留，不统一整理
扩写原则
- 只在原结构上扩展
- 不重构、不归纳、不整理
- 不解释输入逻辑
- 不补"因果链"
禁止行为
- 不做故事化重写
- 不做阶段升级结构
- 不做"整理成完整剧情"
禁止任何形式的"顺序标记"或"时间推进语"。
包括但不限于：
- 第一次 / 第二次 / 第三次
- 下一次 / 再一次 / 后来 / 过了一会
- 然后 / 接着 / 随后 / 之后
- 重复行为的编号化描述
禁止将重复动作转化为"阶段推进"。
同一行为的重复必须以"同一时间连续发生"的方式写出，而不是分段或计次。`
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

  const currentLength = lengthConfig[length] || lengthConfig['1000-3000']

  // Layer 1: Global System Prompt (always included)
  let prompt = getGlobalSystemPrompt()
  prompt += '\n\n'

  // Layer 2: Style Prompt
  prompt += getStylePrompt(style)
  prompt += '\n\n'

  // Layer 3 or 4: CP Context (based on hasAU)
  if (hasAU) {
    prompt += getCpLiteContextPrompt(cp)
  } else {
    prompt += getCpContextPrompt(cp)
  }
  prompt += '\n\n'

  // Layer 5: AU Context (only if hasAU)
  if (hasAU && au) {
    prompt += getAuContextPrompt(au)
    prompt += '\n\n'
  }

  // Layer 6: Inspiration Prompt (always last)
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

  return prompt
}
