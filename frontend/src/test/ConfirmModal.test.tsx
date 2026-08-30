import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import ConfirmModal from '../components/ConfirmModal';

describe('ConfirmModal Component Unit Tests', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <ConfirmModal
        isOpen={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Delete Note"
        message="Are you sure?"
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders title, message, and triggers onConfirm when delete button is clicked', () => {
    const handleConfirm = vi.fn();
    const handleClose = vi.fn();

    render(
      <ConfirmModal
        isOpen={true}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title="Delete Note"
        message="Are you sure you want to delete this note?"
      />
    );

    expect(screen.getByRole('heading', { name: 'Delete Note' })).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this note?')).toBeInTheDocument();

    const deleteBtn = screen.getByRole('button', { name: /Delete Note/i });
    fireEvent.click(deleteBtn);

    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });
});
