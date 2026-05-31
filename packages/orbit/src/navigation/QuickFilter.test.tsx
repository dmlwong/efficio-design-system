import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { QuickFilterGroup, QuickFilterItem } from './QuickFilter';

describe('QuickFilter', () => {
  it('uses toolbar toggle button semantics', () => {
    render(
      <QuickFilterGroup ariaLabel="Supplier filters">
        <QuickFilterItem label="Region" selected />
        <QuickFilterItem label="Risk" />
      </QuickFilterGroup>
    );

    expect(screen.getByRole('toolbar', { name: 'Supplier filters' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Region' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Risk' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('moves focus with arrow keys and skips disabled filters', async () => {
    const user = userEvent.setup();

    render(
      <QuickFilterGroup>
        <QuickFilterItem label="All" />
        <QuickFilterItem label="Active" disabled />
        <QuickFilterItem label="Archived" />
      </QuickFilterGroup>
    );

    screen.getByRole('button', { name: 'All' }).focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('button', { name: 'Archived' })).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Active' })).toBeDisabled();
  });

  it('does not call disabled filter actions', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<QuickFilterItem label="Disabled" disabled onClick={onClick} />);

    await user.click(screen.getByRole('button', { name: 'Disabled' }));

    expect(onClick).not.toHaveBeenCalled();
  });
});
