import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import { X, Save, Pin, Tag, Palette, Check } from 'lucide-react';

const COLOR_PALETTE = [
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Rose', value: '#ec4899' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Purple', value: '#8b5cf6' }
];

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'clean']
  ]
};

const NoteEditorModal = ({ isOpen, onClose, onSave, noteToEdit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [color, setColor] = useState('#6366f1');
  const [isPinned, setIsPinned] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title || '');
      setContent(noteToEdit.content || '');
      setTags(noteToEdit.tags || []);
      setColor(noteToEdit.color || '#6366f1');
      setIsPinned(Boolean(noteToEdit.isPinned));
      setTagInput('');
    } else {
      setTitle('');
      setContent('');
      setTags([]);
      setColor('#6366f1');
      setIsPinned(false);
      setTagInput('');
    }
    setError('');
  }, [noteToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const cleanedTag = tagInput.trim().replace(/^#/, '');
      if (!tags.includes(cleanedTag)) {
        setTags([...tags, cleanedTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a note title.');
      return;
    }

    // Strip whitespace to check if content is empty
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    if (!plainText) {
      setError('Please provide content for your note.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSave({
        title: title.trim(),
        content,
        tags,
        color,
        isPinned
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save note.');
    } finally {
      setLoading(false);
    }
  };

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
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-modal" style={{
        width: '100%',
        maxWidth: '720px',
        maxHeight: '90vh',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.5)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            {noteToEdit ? 'Edit Note' : 'Create New Note'}
          </h2>
          <button onClick={onClose} className="btn-icon" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {error && (
            <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 'var(--radius-sm)', color: '#fca5a5', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          {/* Title & Pin row */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Note Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ fontSize: '1.1rem', fontWeight: 600, flex: 1 }}
              autoFocus
            />

            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              className="btn btn-secondary"
              style={{
                background: isPinned ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: isPinned ? 'var(--accent-gold)' : 'var(--text-muted)',
                borderColor: isPinned ? 'rgba(245, 158, 11, 0.5)' : 'var(--border-light)'
              }}
            >
              <Pin size={16} style={{ transform: isPinned ? 'rotate(45deg)' : 'none' }} />
              <span>{isPinned ? 'Pinned' : 'Pin Note'}</span>
            </button>
          </div>

          {/* Color Selector */}
          <div>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Palette size={14} /> Color Accent
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {COLOR_PALETTE.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setColor(item.value)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: item.value,
                    border: color === item.value ? '2px solid #ffffff' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: color === item.value ? `0 0 12px ${item.value}` : 'none'
                  }}
                  title={item.name}
                >
                  {color === item.value && <Check size={14} color="#ffffff" />}
                </button>
              ))}
            </div>
          </div>

          {/* Rich Text Editor */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Note Content</label>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={QUILL_MODULES}
              placeholder="Write your note here... supports rich text formatting, lists, links, code blocks."
            />
          </div>

          {/* Tags Input */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Tag size={14} /> Tags (Press Enter or comma to add)
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Add tag (e.g. work, personal, idea)..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
            />
            {tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                {tags.map((tag, index) => (
                  <span key={index} className="tag-badge" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                    #{tag}
                    <X
                      size={12}
                      style={{ cursor: 'pointer', marginLeft: '4px' }}
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} />
              <span>{loading ? 'Saving...' : 'Save Note'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default NoteEditorModal;
