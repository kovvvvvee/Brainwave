// AI Service for DeepSeek API integration
import { composeExpansionPrompt } from './promptLayers'

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'

console.log(
  'ENV TEST:',
  import.meta.env.VITE_DEEPSEEK_API_KEY
)

// Mock mode flag - set to true to use mock AI responses instead of real API calls
const USE_MOCK_MODE = false

// DeepSeek model
const DEEPSEEK_MODEL = 'deepseek-chat'

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
    'AO3': [
      '他看着那个瞬间，{original}。空气里有一种说不清的沉重，像有什么东西压在胸口。',
      '那个念头在脑海里闪过，{original}。他没有说话，只是垂下眼帘，手指无意识地抓紧了衣角。',
      '{original}。这句话在空荡的房间里回响，像是一把钝刀，缓慢地割开那些已经结痂的伤口。',
    ],
    'Lovecraft': [
      '{original}。他感觉到有什么东西在黑暗中蠕动，古老的恐惧从深渊升起。',
      '那个瞬间，{original}。他听到不可名状的低语，理智在崩塌的边缘颤抖。',
      '{original}。他凝视着虚空，那里有某种超越人类理解的恐怖正在苏醒。',
    ],
    '海棠': [
      '月光如水，{original}。他轻叹一声，眼底是化不开的温柔。',
      '{original}。那个瞬间很安静，只有心跳声在耳边回响。',
      '他看着那个瞬间，{original}。时光仿佛在这里停驻，美好得让人不忍触碰。',
    ],
    '台湾': [
      '他看着那个瞬间，{original}。这种感觉很熟悉，像是生活里的小确幸。',
      '{original}。他笑了笑，这种日常的温暖让人觉得很踏实。',
      '那个瞬间，{original}。他想起小时候的回忆，心里暖暖的。',
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
  const templates = styleTemplates[style] || styleTemplates['AO3']
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
 * Call DeepSeek API
 * @param {string} systemPrompt - System prompt
 * @param {string} userPrompt - User prompt
 * @returns {string} Response content
 */
export async function callDeepSeek(systemPrompt, userPrompt) {
  try {
    console.log('DeepSeek API 请求URL:', DEEPSEEK_API_URL)
    console.log('使用模型:', DEEPSEEK_MODEL)

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
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
        temperature: 0.85,
        stream: false
      })
    })

    console.log('DeepSeek API 响应状态:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('DeepSeek API 错误:', errorText)
      throw new Error(`DeepSeek API 错误 (${response.status}): ${errorText}`)
    }

    const data = await response.json()

    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error('DeepSeek 返回数据格式异常:', data)
      throw new Error('DeepSeek 返回数据格式异常')
    }

    console.log('✓ DeepSeek API 调用成功')
    return data.choices[0].message.content
  } catch (error) {
    console.error('DeepSeek API 调用失败:', error)
    throw error
  }
}

/**
 * Classify inspiration using AI
 * @param {string} inspirationContent - The inspiration content to classify
 * @param {Array} cps - Array of all CPs with their details
 * @param {Array} aus - Array of all AUs with their details
 * @returns {Object} Classification result with cp_id, au_id, and reason
 */
export async function classifyInspiration(inspirationContent, cps, aus) {
  if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === 'your_deepseek_api_key_here') {
    throw new Error('DeepSeek API key not configured')
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
    console.log("DeepSeek API Key:", DEEPSEEK_API_KEY)

    const content = await callDeepSeek(
      systemPrompt,
      `请分类以下灵感：\n\n${inspirationContent}`
    )

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
 * @param {Object} parameters - Expansion parameters (style, length, pov, hasAU)
 * @returns {string} Expanded content
 */
export async function expandInspiration(inspirationContent, cp, au, parameters) {
  const { style = 'AO3', length = '中等', pov = '第三人称', hasAU = false } = parameters

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

  // Real AI mode
  if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === 'your_deepseek_api_key_here') {
    throw new Error('DeepSeek API key not configured')
  }

  // Use modular prompt composition system
  const systemPrompt = composeExpansionPrompt({
    style,
    length,
    pov,
    cp,
    au,
    hasAU,
    inspirationContent
  })

  try {
    console.log("DeepSeek API Key:", DEEPSEEK_API_KEY)

    let content = await callDeepSeek(
      systemPrompt,
      '请根据以上设定进行扩写。'
    )

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
