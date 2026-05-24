import { useState } from 'react'
import './InteractionDetailsCard.css'

function InteractionDetailsCard({ 
  details = [], 
  onChange, 
  disabled = false,
  isEditing = true 
}) {
  const [newDetail, setNewDetail] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleAddDetail = () => {
    if (newDetail.trim()) {
      onChange([...details, newDetail.trim()])
      setNewDetail('')
      setIsAdding(false)
    }
  }

  const handleRemoveDetail = (index) => {
    onChange(details.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAddDetail()
    }
  }

  return (
    <div className="interaction-details-card">
      <div className="details-list">
        {details.length === 0 ? (
          <div className="empty-state">
            <span className="empty-text">暂无互动细节</span>
          </div>
        ) : (
          details.map((detail, index) => (
            <div key={index} className="detail-item">
              <span className="detail-content">{detail}</span>
              {isEditing && !disabled && (
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveDetail(index)}
                  title="删除"
                >
                  ×
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {isEditing && !disabled && (
        <div className="add-detail-section">
          {!isAdding ? (
            <button
              className="add-detail-btn"
              onClick={() => setIsAdding(true)}
            >
              <span className="add-icon">+</span>
              <span className="add-text">添加细节</span>
            </button>
          ) : (
            <div className="add-detail-form">
              <textarea
                className="detail-input"
                value={newDetail}
                onChange={(e) => setNewDetail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="例如：会下意识摸对方后颈"
                rows={2}
                autoFocus
              />
              <div className="add-detail-actions">
                <button
                  className="confirm-btn"
                  onClick={handleAddDetail}
                  disabled={!newDetail.trim()}
                >
                  添加
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setIsAdding(false)
                    setNewDetail('')
                  }}
                >
                  取消
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default InteractionDetailsCard
