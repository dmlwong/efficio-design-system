import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('uses a native checkbox with the visible label as its name', () => {
    render(<Checkbox checked={false} label="Include archived" onChange={() => {}} />);

    expect(screen.getByRole('checkbox', { name: 'Include archived' })).toBeInTheDocument();
  });

  it('supports Enter activation in addition to native Space activation', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Checkbox checked={false} label="Include archived" onChange={onChange} />);

    screen.getByRole('checkbox', { name: 'Include archived' }).focus();
    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledWith(true);
  });
});
