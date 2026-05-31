import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('requires and applies an accessible name', () => {
    render(<IconButton ariaLabel="Open filters" icon={<span aria-hidden="true">F</span>} />);

    expect(screen.getByRole('button', { name: 'Open filters' })).toBeInTheDocument();
  });

  it('blocks activation when disabled by state', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <IconButton
        ariaLabel="Open filters"
        icon={<span aria-hidden="true">F</span>}
        state="Disabled"
        onClick={onClick}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Open filters' }));

    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Open filters' })).toBeDisabled();
  });
});
