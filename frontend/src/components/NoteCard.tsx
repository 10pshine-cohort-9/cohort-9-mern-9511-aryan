import React from 'react';
import { Pin, Edit3, Trash2, Tag, Calendar } from 'lucide-react';
import { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onTogglePin: (note: Note) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete, onTogglePin }) => {
  // Helper to extract clean plain text preview from rich text HTML string
  const getPlainTextPreview = (html: string) => {
    if (!html) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    return text.length > 140 ? text.substring(0, 140) + '...' : text;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        transition: 'all 0.25s ease',
        borderLeft: `4px solid ${note.color || 'var(--primary)'}`,
        background: 'rgba(30, 41, 59, 0.75)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.4)';
        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        e.currentTarget.style.borderColor = 'var(--border-light)';
      }}
    >
      {/* Top Header: Title & Pin Toggle */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.4, margin: 0 }}>
            {note.title}
          </h3>
          <button
            onClick={() => onTogglePin(note)}
            className="btn-icon"
            style={{
              color: note.isPinned ? 'var(--accent-gold)' : 'var(--text-subtle)',
              background: note.isPinned ? 'rgba(245, 158, 11, 0.15)' : 'transparent'
            }}
            title={note.isPinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin size={16} style={{ transform: note.isPinned ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </div>

        {/* Content Preview */}
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px', wordBreak: 'break-word', whiteSpace: 'pre-line' }}>
          {getPlainTextPreview(note.content)}
        </p>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {note.tags.map((tag, idx) => (
              <span key={idx} className="tag-badge">
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Date & Action buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: 'auto' }}>
        <span style={{ fontSize: '0.775rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Calendar size={12} />
          {formatDate(note.createdAt)}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => onEdit(note)}
            className="btn-icon"
            title="Edit note"
            style={{ color: 'var(--primary)' }}
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete(note)}
            className="btn-icon"
            title="Delete note"
            style={{ color: '#ef4444' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
