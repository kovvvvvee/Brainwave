// AI Service for OpenRouter API integration

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

// Mock mode flag - set to true to use mock AI responses instead of real API calls
const USE_MOCK_MODE = true

// Model list with fallback mechanism
const MODELS = [
  'google/gemini-flash-1.5',
  'openai/gpt-4o-mini'
]

/**
 * Generate mock expansion content based on parameters
 * @param {string} originalContent - Original inspiration content
 * @param {Object} parameters - Expansion parameters (style, length, pov)
 * @returns {string} Mock expansion content
 */
function generateMockExpansion(originalContent, parameters) {
  const { style, length, pov } = parameters

  // Mock expansion templates based on style
  const styleTemplates = {
    '克制': [
      '他看着那个瞬间，{original}。空气里有一种说不清的沉重，像有什么东西压在胸口。',
      '那个念头在脑海里闪过，{original}。他没有说话，只是垂下眼帘，手指无意识地抓紧了衣角。',
      '{original}。这句话在空荡的房间里回响，像是一把钝刀，缓慢地割开那些已经结痂的伤口。',
    ],
    '清冷': [
      '月光透过窗棂洒进来，{original}。他站在阴影里，神情淡漠，仿佛这一切都与他无关。',
      '{original}。风从窗外吹进来，带着一丝凉意，他裹紧了外套，转身离开。',
      '那个瞬间很安静，{original}。他抬起头，眼神里没有什么波澜，只是静静地看着远方。',
    ],
    '暧昧': [
      '他们的距离很近，{original}。呼吸交缠在一起，空气里弥漫着一种说不清道不明的张力。',
      '{original}。他侧过头，目光在对方脸上停留，嘴角勾起一点若有若无的弧度。',
      '那个瞬间很漫长，{original}。手指不经意地触碰，像是有电流窜过，让人心跳漏了一拍。',
    ],
    '疯感': [
      '{original}。他笑了起来，笑声在空荡的房间里回荡，带着一种让人毛骨悚然的狂热。',
      '那个念头在脑子里炸开，{original}。他抓着自己的头发，指甲深深陷入头皮，却感觉不到疼痛。',
      '{original}。他盯着自己的手，那双手在颤抖，像是有什么东西要从身体里冲出来。',
    ],
    '温柔': [
      '阳光很暖，{original}。他轻轻叹了口气，伸手拂去对方发梢的灰尘，动作很轻，像是在触碰易碎的瓷器。',
      '{original}。他低下头，声音很轻，像是怕惊扰了什么，眼底却是一片柔软。',
      '那个瞬间很安静，{original}。他握住对方的手，掌心温热，传递着一种无声的安慰。',
    ]
  }

  // Length modifiers with significantly different content lengths
  const lengthModifiers = {
    '灵感延伸': (text) => text,
    '短扩写': (text) => text + '\n\n周围的一切都变得模糊，只有这个瞬间清晰得刺眼。他甚至能听见自己的呼吸声，一下一下，沉重而缓慢。这种感觉太熟悉了，熟悉到让他想要逃离，却又忍不住想要沉溺其中。时间仿佛在这里停滞，每一秒都被拉得很长很长。',
    '中篇扩写': (text) => text + '\n\n周围的一切都变得模糊，只有这个瞬间清晰得刺眼。他甚至能听见自己的呼吸声，一下一下，沉重而缓慢。这种感觉太熟悉了，熟悉到让他想要逃离，却又忍不住想要沉溺其中。时间仿佛在这里停滞，每一秒都被拉得很长很长。\n\n记忆开始倒流，那些被刻意遗忘的画面一帧一帧地浮现。他想起那个雨夜，想起那盏昏黄的路灯，想起那个人转身时决绝的背影。所有的情绪在这一刻爆发，像是积压已久的火山终于找到了出口。\n\n他闭上眼睛，试图平复内心的波澜，但那些声音、那些画面、那些触感，全都清晰得让人窒息。他知道，有些东西一旦开始，就无法停止。有些感情一旦滋生，就无法抹去。',
    '长篇扩写': (text) => text + '\n\n周围的一切都变得模糊，只有这个瞬间清晰得刺眼。他甚至能听见自己的呼吸声，一下一下，沉重而缓慢。这种感觉太熟悉了，熟悉到让他想要逃离，却又忍不住想要沉溺其中。时间仿佛在这里停滞，每一秒都被拉得很长很长。\n\n记忆开始倒流，那些被刻意遗忘的画面一帧一帧地浮现。他想起那个雨夜，想起那盏昏黄的路灯，想起那个人转身时决绝的背影。所有的情绪在这一刻爆发，像是积压已久的火山终于找到了出口。\n\n他闭上眼睛，试图平复内心的波澜，但那些声音、那些画面、那些触感，全都清晰得让人窒息。他知道，有些东西一旦开始，就无法停止。有些感情一旦滋生，就无法抹去。\n\n窗外的雨还在下，淅淅沥沥，像是要把整个世界都淹没。他走到窗前，看着玻璃上的水珠滑落，每一道痕迹都像是一个无法愈合的伤口。他想起第一次见到那个人的场景，想起那些小心翼翼的试探，想起那些欲言又止的瞬间。所有的细节都历历在目，仿佛就在昨天。\n\n他转过身，目光落在空荡的房间里。这里曾经充满了欢声笑语，曾经有过温暖的拥抱，曾经有过真挚的誓言。但现在，只剩下回忆，只剩下那些无法言说的遗憾。他知道，有些路一旦走过，就无法回头。有些人一旦错过，就再也无法相遇。\n\n但他也知道，正是这些遗憾，这些痛苦，这些无法弥补的失去，构成了他生命中最重要的部分。它们让他成长，让他学会珍惜，让他明白什么是真正重要的。或许，这就是命运给他的礼物，用痛苦换来的成长，用失去换来的领悟。'
  }

  // POV modifiers with second person support
  const povModifiers = {
    '第一人称': (text) => text.replace(/他/g, '我').replace(/他的/g, '我的'),
    '第二人称': (text) => {
      let modified = text.replace(/他/g, '你').replace(/他的/g, '你的')
      // Add letter-like feel for second person
      modified = modified + '\n\n你那时候其实已经知道，这一切都不会有结果。但你还是选择了相信，选择了坚持，选择了那个让你心碎的结局。现在回想起来，或许那就是最好的安排。'
      return modified
    },
    '第三人称': (text) => text
  }

  // Select random template for the style
  const templates = styleTemplates[style] || styleTemplates['克制']
  const baseTemplate = templates[Math.floor(Math.random() * templates.length)]

  // Insert original content
  let content = baseTemplate.replace('{original}', originalContent)

  // Apply length modifier
  content = lengthModifiers[length](content)

  // Apply POV modifier
  content = povModifiers[pov](content)

  return content
}

/**
 * Try to call OpenRouter API with fallback models
 * @param {string} systemPrompt - System prompt
 * @param {string} userPrompt - User prompt
 * @param {Object} options - Additional options (temperature, max_tokens)
 * @returns {Object} Response data with content and model used
 */
async function callOpenRouterWithFallback(systemPrompt, userPrompt, options = {}) {
  const { temperature = 0.3, max_tokens = 500 } = options

  for (const model of MODELS) {
    try {
      console.log(`尝试使用模型: ${model}`)

      let response
      try {
        response = await fetch(OPENROUTER_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              {
                role: 'user',
                content: userPrompt
              }
            ],
            temperature: temperature,
            max_tokens: max_tokens,
          })
        })
      } catch (fetchError) {
        console.error(`模型 ${model} 请求失败:`, fetchError)
        continue
      }

      console.log(`模型 ${model} 响应状态:`, response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`模型 ${model} API错误 (${response.status}):`, errorText)
        continue
      }

      const data = await response.json()

      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        console.error(`模型 ${model} 返回数据格式异常`)
        continue
      }

      console.log(`✓ 成功使用模型: ${model}`)
      return {
        content: data.choices[0].message.content,
        model: model
      }
    } catch (error) {
      console.error(`模型 ${model} 调用失败:`, error.message)
      continue
    }
  }

  throw new Error('所有模型均不可用，请检查API配置或网络连接')
}

/**
 * Classify inspiration using AI
 * @param {string} inspirationContent - The inspiration content to classify
 * @param {Array} cps - Array of all CPs with their details
 * @param {Array} aus - Array of all AUs with their details
 * @returns {Object} Classification result with cp_id, au_id, and reason
 */
export async function classifyInspiration(inspirationContent, cps, aus) {
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
    throw new Error('OpenRouter API key not configured')
  }

  // Build context from CPs and AUs
  const cpContext = cps.map(cp => ({
    id: cp.id,
    name: cp.name,
    description: cp.description,
    characters: cp.characters,
    keywords: cp.keywords,
    emotional_tone: cp.emotional_tone,
    relationship_core: cp.relationship_core,
    interaction_style: cp.interaction_style,
  })).filter(cp => cp.name || cp.description || cp.keywords)

  const auContext = aus.map(au => ({
    id: au.id,
    cp_id: au.cp_id,
    name: au.name,
    description: au.description,
    world_setting: au.world_setting,
    era_background: au.era_background,
    occupation_setting: au.occupation_setting,
    atmosphere: au.atmosphere,
    behavior_pattern: au.behavior_pattern,
  })).filter(au => au.name || au.description)

  const systemPrompt = `你是一个专业的同人创作助手，负责将灵感分类到合适的CP和AU。

你的任务：
1. 分析灵感内容
2. 从提供的CP列表中选择最匹配的CP
3. 从提供的AU列表中选择最匹配的AU（如果灵感没有明确的世界观设定，可以不选择AU）
4. 如果无法确定CP归属，返回uncategorized

CP列表：
${JSON.stringify(cpContext, null, 2)}

AU列表：
${JSON.stringify(auContext, null, 2)}

请以JSON格式返回结果，格式如下：
{
  "cp_id": "cp的UUID或null（如果无法确定）",
  "au_id": "au的UUID或null（如果无法确定或不适用）",
  "reason": "分类理由简述"
}

重要规则：
- 如果灵感内容与任何CP都不匹配，cp_id返回null
- 如果灵感内容没有明确的世界观设定，au_id返回null
- AU必须属于选中的CP，不能跨CP选择AU
- reason字段用中文简述分类理由
- 只返回JSON，不要包含任何其他文字或markdown标记`

  try {
    console.log("OpenRouter API Key:", OPENROUTER_API_KEY)
    console.log('OpenRouter API 请求URL:', OPENROUTER_API_URL)

    const result = await callOpenRouterWithFallback(
      systemPrompt,
      `请分类以下灵感：\n\n${inspirationContent}`,
      { temperature: 0.3, max_tokens: 500 }
    )

    const content = result.content

    // Check if AI returned valid content
    if (!content || content.trim() === '') {
      console.error('AI未返回有效内容')
      return {
        cp_id: null,
        au_id: null,
        reason: 'AI未返回有效结果'
      }
    }

    // Parse JSON response
    let parsedResult
    try {
      // Remove markdown code blocks if present
      let jsonContent = content.trim()
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/^```json\n/, '').replace(/\n```$/, '')
      } else if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.replace(/^```\n/, '').replace(/\n```$/, '')
      }

      parsedResult = JSON.parse(jsonContent)
    } catch (parseError) {
      console.error('JSON解析失败，原始内容:', content)
      throw new Error(`AI返回的JSON格式无法解析: ${parseError.message}`)
    }

    return {
      cp_id: parsedResult.cp_id || null,
      au_id: parsedResult.au_id || null,
      reason: parsedResult.reason || '',
    }
  } catch (error) {
    console.error('AI分类失败:', error.message)
    throw error
  }
}

/**
 * Expand inspiration using AI
 * @param {string} inspirationContent - The inspiration content to expand
 * @param {Object} cp - CP data with settings
 * @param {Object} au - AU data with settings (optional)
 * @param {Object} parameters - Expansion parameters (style, length, pov)
 * @returns {string} Expanded content
 */
export async function expandInspiration(inspirationContent, cp, au, parameters) {
  const { style = '克制', length = '中等', pov = '第三人称' } = parameters

  // Use mock mode if enabled
  if (USE_MOCK_MODE) {
    console.log('使用 Mock 模式进行 AI 扩写')
    console.log('扩写参数:', { style, length, pov })
    console.log('原始内容:', inspirationContent)

    // Simulate loading delay (1-2 seconds)
    const delay = 1000 + Math.random() * 1000
    await new Promise(resolve => setTimeout(resolve, delay))

    console.log('Mock 模式：生成扩写内容')
    const mockContent = generateMockExpansion(inspirationContent, { style, length, pov })
    console.log('Mock 扩写完成')

    return mockContent
  }

  // Real AI mode (currently disabled)
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
    throw new Error('OpenRouter API key not configured')
  }

  // Build context from CP and AU
  let contextPrompt = ''
  if (cp) {
    contextPrompt += `CP设定：
- 名称：${cp.name}
- 描述：${cp.description || '无'}
- 角色：${cp.characters || '无'}
- 标签：${cp.keywords || '无'}
- 情感基调：${cp.emotional_tone || '无'}
- 关系核心：${cp.relationship_core || '无'}
- 互动风格：${cp.interaction_style || '无'}
- 写作风格：${cp.writing_style || '无'}
`
  }

  if (au) {
    contextPrompt += `AU设定：
- 名称：${au.name}
- 描述：${au.description || '无'}
- 世界观设定：${au.world_setting || '无'}
- 时代背景：${au.era_background || '无'}
- 职业设定：${au.occupation_setting || '无'}
- 氛围：${au.atmosphere || '无'}
- 行为模式：${au.behavior_pattern || '无'}
- 写作风格：${au.writing_style || '无'}
`
  }

  const systemPrompt = `你是一个专业的同人创作助手，负责根据灵感和设定进行扩写创作。

你的任务：
根据提供的灵感内容和CP/AU设定，进行创意扩写。

扩写要求：
- 文风：${style}
- 扩写长度：${length}
- 叙事视角：${pov}

${contextPrompt}

请直接输出扩写内容，不要包含任何解释性文字或markdown标记。`

  try {
    console.log("OpenRouter API Key:", OPENROUTER_API_KEY)
    console.log('OpenRouter API 请求URL:', OPENROUTER_API_URL)

    const result = await callOpenRouterWithFallback(
      systemPrompt,
      `请扩写以下灵感：\n\n${inspirationContent}`,
      { temperature: 0.7, max_tokens: 2000 }
    )

    let content = result.content

    // Check if AI returned valid content
    if (!content || content.trim() === '') {
      console.error('AI未返回有效内容')
      throw new Error('AI未返回有效结果')
    }

    // Remove markdown code blocks if present
    if (content.startsWith('```')) {
      content = content.replace(/^```\w*\n/, '').replace(/\n```$/, '')
    }

    return content
  } catch (error) {
    console.error('AI扩写失败:', error.message)
    throw error
  }
}
