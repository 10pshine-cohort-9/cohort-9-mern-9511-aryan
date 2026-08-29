import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import NoteCard from '../components/NoteCard';
import NoteEditorModal from '../components/NoteEditorModal';
import ConfirmModal from '../components/ConfirmModal';
import { Plus, BookOpen, Pin, Tag, Filter, SearchX, RefreshCw } from 'lucide-react';

const DashboardPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');

  // Modal States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/notes');
      if (res.data.success) {
        setNotes(res.data.data);
      }
    } catch (err) {
      console.error('Fetch notes error:', err);
      setError('Failed to load notes. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Compute unique list of tags across all notes
  const allTags = useMemo(() => {
    const tagSet = new Set();
    notes.forEach((note) => {
      if (Array.isArray(note.tags)) {
        note.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet);
  }, [notes]);

  // Filter notes by search query and selected tag
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        !searchQuery ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.tags && note.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesTag =
        selectedTag === 'ALL' ||
        (selectedTag === 'PINNED' && note.isPinned) ||
        (note.tags && note.tags.includes(selectedTag));

      return matchesSearch && matchesTag;
    });
  }, [notes, searchQuery, selectedTag]);

  // Handlers
  const handleOpenCreateModal = () => {
    setNoteToEdit(null);
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = (note) => {
    setNoteToEdit(note);
    setIsEditorOpen(true);
  };

  const handleSaveNote = async (noteData) => {
    if (noteToEdit) {
      const res = await api.put(`/notes/${noteToEdit._id}`, noteData);
      if (res.data.success) {
        setNotes(notes.map((n) => (n._id === noteToEdit._id ? res.data.data : n)));
      }
    } else {
      const res = await api.post('/notes', noteData);
      if (res.data.success) {
        setNotes([res.data.data, ...notes]);
      }
    }
  };

  const handleTogglePin = async (note) => {
    try {
      const updatedPinState = !note.isPinned;
      const res = await api.put(`/notes/${note._id}`, { isPinned: updatedPinState });
      if (res.data.success) {
        setNotes(notes.map((n) => (n._id === note._id ? res.data.data : n)));
      }
    } catch (err) {
      console.error('Toggle pin error:', err);
    }
  };

  const handleOpenDeleteModal = (note) => {
    setNoteToDelete(note);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;
    try {
      setDeleteLoading(true);
      const res = await api.delete(`/notes/${noteToDelete._id}`);
      if (res.data.success) {
        setNotes(notes.filter((n) => n._id !== noteToDelete._id));
        setIsConfirmOpen(false);
        setNoteToDelete(null);
      }
    } catch (err) {
      console.error('Delete note error:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const pinnedCount = notes.filter((n) => n.isPinned).length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '32px 24px', flex: 1 }}>
        
        {/* Top Header & Actions Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px', marginBottom: '28px' }}>
          
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
              My Notes Workspace
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <span>Total Notes: <strong>{notes.length}</strong></span>
              <span>•</span>
              <span style={{ color: 'var(--accent-gold)' }}>Pinned: <strong>{pinnedCount}</strong></span>
            </div>
          </div>

          <button onClick={handleOpenCreateModal} className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1rem' }}>
            <Plus size={20} />
            <span>Create Note</span>
          </button>
        </div>

        {/* Filter Pills Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '6px' }}>
            <Filter size={14} /> Filter:
          </span>

          <button
            onClick={() => setSelectedTag('ALL')}
            className={`btn ${selectedTag === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '20px' }}
          >
            All ({notes.length})
          </button>

          <button
            onClick={() => setSelectedTag('PINNED')}
            className={`btn ${selectedTag === 'PINNED' ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              padding: '6px 14px',
              fontSize: '0.8rem',
              borderRadius: '20px',
              color: selectedTag === 'PINNED' ? '#fff' : 'var(--accent-gold)'
            }}
          >
            <Pin size={12} /> Pinned ({pinnedCount})
          </button>

          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`btn ${selectedTag === tag ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '20px' }}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div style={{ padding: '16px 20px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 'var(--radius-md)', color: '#fca5a5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <span>{error}</span>
            <button onClick={fetchNotes} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <RefreshCw size={36} className="spin" style={{ animation: 'spin 1.5s linear infinite', marginBottom: '16px', color: 'var(--primary)' }} />
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>Loading notes...</p>
          </div>
        ) : filteredNotes.length > 0 ? (
          /* Notes Grid */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 24px', borderRadius: 'var(--radius-lg)' }}>
            {searchQuery || selectedTag !== 'ALL' ? (
              <>
                <SearchX size={48} color="var(--text-subtle)" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 8px 0' }}>No matching notes found</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Try clearing your search query or tag filter to view all notes.
                </p>
                <button onClick={() => { setSearchQuery(''); setSelectedTag('ALL'); }} className="btn btn-secondary">
                  Reset Filters
                </button>
              </>
            ) : (
              <>
                <BookOpen size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 8px 0' }}>No notes yet</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Click the button below to create your first rich text note!
                </p>
                <button onClick={handleOpenCreateModal} className="btn btn-primary">
                  <Plus size={18} />
                  <span>Create Your First Note</span>
                </button>
              </>
            )}
          </div>
        )}

      </main>

      {/* Note Editor Modal */}
      <NoteEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveNote}
        noteToEdit={noteToEdit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Note"
        message={`Are you sure you want to delete "${noteToDelete?.title || 'this note'}"? This action cannot be undone.`}
        loading={deleteLoading}
      />
    </div>
  );
};

export default DashboardPage;
