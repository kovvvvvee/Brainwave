import './FloatingActionBar.css'

function FloatingActionBar({ onCancel, onSave, saving, saveText = '保存档案' }) {
  return (
    <div className="floating-action-bar">
      <button 
        className="btn" 
        onClick={onCancel} 
        disabled={saving}
      >
        取消
      </button>
      <button 
        className="btn btn-primary" 
        onClick={onSave} 
        disabled={saving}
      >
        {saving ? '保存中...' : saveText}
      </button>
    </div>
  )
}

export default FloatingActionBar
