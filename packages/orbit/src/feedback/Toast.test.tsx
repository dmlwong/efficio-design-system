import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Toast } from './Toast';

describe('Toast', () => {
  it('renders action buttons and calls handlers', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const onDiscard = vi.fn();

    render(
      <Toast
        type="Success"
        message="Unsaved changes"
        visible
        actions={[
          { label: 'Discard', onClick: onDiscard, variant: 'Secondary' },
          { label: 'Save', onClick: onSave, variant: 'Primary' },
        ]}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));
    await user.click(screen.getByRole('button', { name: 'Discard' }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onDiscard).toHaveBeenCalledTimes(1);
  });

  it('supports the NoStatus type', () => {
    render(<Toast type="NoStatus" message="Muted event" visible />);

    expect(screen.getByRole('status')).toHaveTextContent('Muted event');
  });

  it('renders an svg dismiss icon when dismissible', () => {
    render(<Toast type="Info" message="Saved filters" visible onDismiss={() => {}} />);

    const dismissButton = screen.getByRole('button', { name: 'Dismiss info toast' });

    expect(dismissButton.querySelector('svg')).not.toBeNull();
  });
});
