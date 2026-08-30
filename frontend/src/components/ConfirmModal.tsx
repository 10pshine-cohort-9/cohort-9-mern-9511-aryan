import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  loading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '20px'
    }}>
      <div className="glass-modal" style={{
        width: '100%',
        maxWidth: '440px',
        borderRadius: 'var(--radius-md)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444' }}>
            <AlertTriangle size={24} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
              {title || 'Confirm Action'}
            </h3>
          </div>
          <button onClick={onClose} className="btn-icon" title="Cancel">
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
          {message || 'Are you sure you want to perform this action?'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
          <button onClick={onClose} className="btn btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-danger" disabled={loading}>
            {loading ? 'Deleting...' : 'Delete Note'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
