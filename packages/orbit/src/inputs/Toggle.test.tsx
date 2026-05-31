import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Toggle } from './Toggle';

describe('Toggle', () => {
  it('uses native checkbox behavior with switch semantics', () => {
    render(<Toggle checked={false} label="AI suggestions" onChange={() => {}} />);

    expect(screen.getByRole('switch', { name: 'AI suggestions' })).toBeInTheDocument();
  });

  it('supports Enter activation in addition to native Space activation', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Toggle checked={false} label="AI suggestions" onChange={onChange} />);

    screen.getByRole('switch', { name: 'AI suggestions' }).focus();
    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledWith(true);
  });
});
