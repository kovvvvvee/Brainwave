import { useState } from 'react'
import { callDeepSeek } from '../supabase/aiService'
import ArchiveSymbol from '../components/ArchiveSymbol'
import './PromptLab.css'

function PromptLab() {
  const [originalInspiration, setOriginalInspiration] = useState('')
  const [systemPrompt, setSystemPrompt] = useState(`禁止套路化小说语言。
禁止AI味表达。
少写心理描写。
多写人物习惯和停顿。
偏中文同人文风格。
默认读者熟悉角色。
不要解释人物关系。`)
  const [generatedResult, setGeneratedResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!originalInspiration.trim()) {
      alert('请输入原始灵感')
      return
    }

    setLoading(true)
    setGeneratedResult('')

    try {
      const result = await callDeepSeek(systemPrompt, originalInspiration)
      setGeneratedResult(result)
    } catch (error) {
      console.error('生成失败:', error)
      setGeneratedResult(`生成失败: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="prompt-lab">
      <header className="prompt-lab-header">
        <ArchiveSymbol symbol="SCAN_04" position="top-right" size="small" variant="key" />
        <h1>PromptLab</h1>
        <p className="prompt-lab-subtitle">AI Prompt 调试工具</p>
      </header>

      <div className="prompt-lab-actions">
        <button 
          className="btn btn-primary" 
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? '生成中...' : '生成'}
        </button>
      </div>

      <div className="prompt-lab-columns">
        <div className="prompt-lab-column">
          <label className="column-label">原始灵感</label>
          <textarea
            className="column-textarea"
            value={originalInspiration}
            onChange={(e) => setOriginalInspiration(e.target.value)}
            placeholder="输入原始灵感内容..."
            rows={12}
          />
        </div>

        <div className="prompt-lab-column">
          <label className="column-label">System Prompt</label>
          <textarea
            className="column-textarea"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={12}
          />
        </div>

        <div className="prompt-lab-column">
          <label className="column-label">AI 生成结果</label>
          <div className="result-container receipt-paper">
            <div className="receipt-header">
              <span className="receipt-archive-code">BRAINWAVE OUTPUT_04</span>
              <span className="receipt-scan-code">SCAN FILE</span>
            </div>
            <div className="receipt-perforation-left"></div>
            <div className="receipt-perforation-right"></div>
            {loading ? (
              <div className="loading-state">生成中...</div>
            ) : generatedResult ? (
              <div className="result-content">{generatedResult}</div>
            ) : (
              <div className="empty-state">点击生成按钮查看结果</div>
            )}
            {generatedResult && (
              <div className="receipt-footer">
                <div className="receipt-dashed-line"></div>
                <div className="print-timestamp">
                  PRINTED: {new Date().toLocaleString('zh-CN')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromptLab
