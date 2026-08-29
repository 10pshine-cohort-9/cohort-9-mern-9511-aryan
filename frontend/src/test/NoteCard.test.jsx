import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import NoteCard from '../components/NoteCard';

describe('NoteCard Component Unit Tests', () => {
  const sampleNote = {
    _id: 'note123',
    title: 'Sprint Planning Notes',
    content: '<p>Discuss architecture and <strong>database schema</strong>.</p>',
    tags: ['work', 'sprint'],
    isPinned: true,
    color: '#6366f1',
    createdAt: '2026-08-29T20:00:00.000Z'
  };

  it('renders note title, clean content preview, and tag badges correctly', () => {
    render(
      <NoteCard
        note={sampleNote}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onTogglePin={vi.fn()}
      />
    );

    expect(screen.getByText('Sprint Planning Notes')).toBeInTheDocument();
    expect(screen.getByText(/Discuss architecture and database schema/i)).toBeInTheDocument();
    expect(screen.getByText('work')).toBeInTheDocument();
    expect(screen.getByText('sprint')).toBeInTheDocument();
  });

  it('triggers onEdit and onDelete callbacks when buttons are clicked', () => {
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();

    render(
      <NoteCard
        note={sampleNote}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onTogglePin={vi.fn()}
      />
    );

    const editBtn = screen.getByTitle('Edit note');
    const deleteBtn = screen.getByTitle('Delete note');

    fireEvent.click(editBtn);
    expect(handleEdit).toHaveBeenCalledWith(sampleNote);

    fireEvent.click(deleteBtn);
    expect(handleDelete).toHaveBeenCalledWith(sampleNote);
  });
});
