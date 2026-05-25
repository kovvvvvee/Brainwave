import CreativeTextarea from './CreativeTextarea'
import ReadingMode from './ReadingMode'
import './DetailCard.css'

function DetailCard({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  disabled = false,
  isEditing = true
}) {
  return (
    <div className="detail-card">
      <span className="detail-label">{label}</span>
      {isEditing ? (
        <CreativeTextarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : (
        <div className="detail-display">
          {value ? (
            <ReadingMode 
              content={value}
              defaultExpanded={false}
              showPreview={true}
            />
          ) : (
            <span className="empty-placeholder">未填写</span>
          )}
        </div>
      )}
    </div>
  )
}

export default DetailCard
