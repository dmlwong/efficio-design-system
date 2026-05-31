import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MultiStateButton, MultiStateGroup } from './MultiStateButton';

describe('MultiStateGroup', () => {
  it('supports controlled selection without mutating local state', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <MultiStateGroup value="all" onValueChange={onValueChange}>
        <MultiStateButton value="all" label="All" />
        <MultiStateButton value="active" label="Active" />
      </MultiStateGroup>
    );

    await user.click(screen.getByRole('tab', { name: 'Active' }));

    expect(onValueChange).toHaveBeenCalledWith('active');
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'true');
  });

  it('supports uncontrolled default selection', async () => {
    const user = userEvent.setup();

    render(
      <MultiStateGroup defaultValue="all">
        <MultiStateButton value="all" label="All" />
        <MultiStateButton value="active" label="Active" />
      </MultiStateGroup>
    );

    await user.click(screen.getByRole('tab', { name: 'Active' }));

    expect(screen.getByRole('tab', { name: 'Active' })).toHaveAttribute('aria-selected', 'true');
  });

  it('makes the first enabled item tabbable when nothing is selected', () => {
    render(
      <MultiStateGroup>
        <MultiStateButton value="all" label="All" disabled />
        <MultiStateButton value="active" label="Active" />
        <MultiStateButton value="pending" label="Pending" />
      </MultiStateGroup>
    );

    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('tab', { name: 'Active' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Pending' })).toHaveAttribute('tabindex', '-1');
  });

  it('ignores disabled activation and supports keyboard activation', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <MultiStateGroup defaultValue="all" onValueChange={onValueChange}>
        <MultiStateButton value="all" label="All" />
        <MultiStateButton value="active" label="Active" />
        <MultiStateButton value="disabled" label="Disabled" disabled />
      </MultiStateGroup>
    );

    await user.click(screen.getByRole('tab', { name: 'Disabled' }));
    expect(onValueChange).not.toHaveBeenCalledWith('disabled');

    screen.getByRole('tab', { name: 'All' }).focus();
    await user.keyboard('{ArrowRight}{Enter}');

    expect(onValueChange).toHaveBeenCalledWith('active');
    expect(screen.getByRole('tab', { name: 'Active' })).toHaveAttribute('aria-selected', 'true');
  });
});
