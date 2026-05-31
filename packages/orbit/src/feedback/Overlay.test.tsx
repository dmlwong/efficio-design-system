import React, { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Overlay } from './Overlay';

function OverlayHarness() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setVisible(true)}>
        Open dialog
      </button>
      <Overlay visible={visible} onClose={() => setVisible(false)} ariaLabel="Supplier dialog">
        <button type="button">Cancel</button>
        <button type="button">Confirm</button>
      </Overlay>
    </>
  );
}

describe('Overlay', () => {
  it('focuses the dialog, traps tab focus, closes with Escape, and restores focus', async () => {
    const user = userEvent.setup();

    render(<OverlayHarness />);

    const trigger = screen.getByRole('button', { name: 'Open dialog' });
    await user.click(trigger);

    const dialog = screen.getByRole('dialog', { name: 'Supplier dialog' });
    expect(dialog).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');

    await user.tab();
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Confirm' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe('');
  });

  it('closes when the backdrop is clicked', async () => {
    const user = userEvent.setup();

    render(<OverlayHarness />);

    await user.click(screen.getByRole('button', { name: 'Open dialog' }));
    const dialog = screen.getByRole('dialog', { name: 'Supplier dialog' });

    await user.click(dialog.parentElement as HTMLElement);

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});
