import { X } from 'lucide-react'

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null
  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>{title}</h3>
          <button type="button" className="btn-icon" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <div className="admin-modal-body">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
