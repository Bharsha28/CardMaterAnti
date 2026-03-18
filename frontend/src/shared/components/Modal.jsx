import { X } from 'lucide-react';

export default function Modal({ isOpen, title, onClose, onConfirm, confirmLabel = 'Confirm', confirmClass = 'btn btn-primary', children, loading = false }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18}/></button>
        </div>
        <div className="modal-body">{children}</div>
        {onConfirm && (
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={onClose} disabled={loading}>Cancel</button>
            <button className={confirmClass} onClick={onConfirm} disabled={loading}>
              {loading ? 'Processing…' : confirmLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
