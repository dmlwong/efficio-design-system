import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MultiSelectDropdown } from './MultiSelectDropdown';

const options = [
  { label: 'Draft', value: 'draft' },
  { label: 'Approved', value: 'approved' },
  { label: 'Archived', value: 'archived' },
];

function MultiSelectHarness() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <MultiSelectDropdown
      label="Statuses"
      options={options}
      value={value}
      onChange={setValue}
    />
  );
}

describe('MultiSelectDropdown', () => {
  it('selects multiple values and removes selected chips', async () => {
    const user = userEvent.setup();

    render(<MultiSelectHarness />);

    await user.click(screen.getByRole('combobox', { name: /Statuses/ }));
    expect(screen.getByRole('listbox', { name: 'Statuses' })).toBeInTheDocument();

    await user.click(screen.getByRole('option', { name: 'Draft' }));
    await user.click(screen.getByRole('option', { name: 'Approved' }));

    expect(screen.getByRole('option', { name: /Draft/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('button', { name: 'Remove Draft' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove Draft' }));

    expect(screen.queryByRole('button', { name: 'Remove Draft' })).not.toBeInTheDocument();
  });

  it('toggles options by keyboard', async () => {
    const user = userEvent.setup();

    render(<MultiSelectHarness />);

    const trigger = screen.getByRole('combobox', { name: /Statuses/ });
    trigger.focus();
    await user.keyboard('{ArrowDown} ');

    expect(screen.getByRole('button', { name: 'Remove Draft' })).toBeInTheDocument();
  });
});
