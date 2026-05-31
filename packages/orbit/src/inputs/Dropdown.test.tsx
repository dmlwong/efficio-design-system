import React, { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Dropdown } from './Dropdown';

const options = [
  { label: 'Draft', value: 'draft' },
  { label: 'Approved', value: 'approved' },
  { label: 'Archived', value: 'archived' },
];

function DropdownHarness() {
  const [value, setValue] = useState('');

  return (
    <Dropdown
      label="Status"
      options={options}
      value={value}
      onChange={setValue}
    />
  );
}

describe('Dropdown', () => {
  it('links its visible label to the trigger button', () => {
    render(<DropdownHarness />);

    expect(screen.getByRole('button', { name: /Status/ })).toBeInTheDocument();
  });

  it('selects an option by keyboard and returns focus to the trigger', async () => {
    const user = userEvent.setup();

    render(<DropdownHarness />);

    const trigger = screen.getByRole('button', { name: /Status/ });
    await user.click(trigger);

    await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument());
    expect(trigger).toHaveFocus();
    await user.keyboard('{ArrowDown}{Enter}');

    expect(screen.getByRole('button', { name: /Approved/ })).toHaveFocus();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('keeps trigger focus and exposes the active option while navigating', async () => {
    const user = userEvent.setup();

    render(<DropdownHarness />);

    const trigger = screen.getByRole('button', { name: /Status/ });
    trigger.focus();
    await user.keyboard('{ArrowDown}');

    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-activedescendant');
    expect(screen.getByRole('option', { name: 'Draft' })).toHaveAttribute('aria-selected', 'false');
  });
});
