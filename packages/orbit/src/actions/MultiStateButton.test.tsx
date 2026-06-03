import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MultiStateButton, MultiStateGroup } from './MultiStateButton';
import styles from './MultiStateButton.module.css';

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

    await user.click(screen.getByRole('button', { name: 'Active' }));

    expect(onValueChange).toHaveBeenCalledWith('active');
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'All' })).toHaveClass(styles.selected);
    expect(screen.getByRole('button', { name: 'Active' })).not.toHaveClass(styles.selected);
  });

  it('supports uncontrolled default selection', async () => {
    const user = userEvent.setup();

    render(
      <MultiStateGroup defaultValue="all">
        <MultiStateButton value="all" label="All" />
        <MultiStateButton value="active" label="Active" />
      </MultiStateGroup>
    );

    await user.click(screen.getByRole('button', { name: 'Active' }));

    expect(screen.getByRole('button', { name: 'Active' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('makes the first enabled item tabbable when nothing is selected', () => {
    render(
      <MultiStateGroup>
        <MultiStateButton value="all" label="All" disabled />
        <MultiStateButton value="active" label="Active" />
        <MultiStateButton value="pending" label="Pending" />
      </MultiStateGroup>
    );

    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('button', { name: 'Active' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('button', { name: 'Pending' })).toHaveAttribute('tabindex', '-1');
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

    await user.click(screen.getByRole('button', { name: 'Disabled' }));
    expect(onValueChange).not.toHaveBeenCalledWith('disabled');

    screen.getByRole('button', { name: 'All' }).focus();
    await user.keyboard('{ArrowRight}{Enter}');

    expect(onValueChange).toHaveBeenCalledWith('active');
    expect(screen.getByRole('button', { name: 'Active' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders as a button group rather than tabs', () => {
    render(
      <MultiStateGroup value="all">
        <MultiStateButton value="all" label="All" />
        <MultiStateButton value="active" label="Active" />
      </MultiStateGroup>
    );

    expect(screen.getByRole('group', { name: 'Options' })).toBeInTheDocument();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'All' })).not.toHaveAttribute('aria-selected');
  });

  it('supports full-width grouped button layout', () => {
    render(
      <MultiStateGroup value="mine" ariaLabel="Initiative ownership" fullWidth>
        <MultiStateButton value="mine" label="Mine" />
        <MultiStateButton value="team" label="Team" />
      </MultiStateGroup>
    );

    expect(screen.getByRole('group', { name: 'Initiative ownership' })).toHaveClass(styles.groupFullWidth);
  });
});
