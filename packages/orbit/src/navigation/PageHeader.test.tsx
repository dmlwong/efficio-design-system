import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PageHeader } from './PageHeader';

const tabs = [
  { label: 'Overview' },
  { label: 'Spend Analysis' },
  { label: 'Suppliers' },
];

describe('PageHeader', () => {
  it('supports uncontrolled tab selection from defaultActiveTab', async () => {
    const user = userEvent.setup();

    render(<PageHeader title="Procurement" tabs={tabs} defaultActiveTab={1} />);

    expect(screen.getByRole('tab', { name: 'Spend Analysis' })).toHaveAttribute('aria-selected', 'true');

    await user.click(screen.getByRole('tab', { name: 'Suppliers' }));

    expect(screen.getByRole('tab', { name: 'Suppliers' })).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onTabChange in controlled mode without mutating the selected tab itself', async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();

    render(<PageHeader title="Procurement" tabs={tabs} activeTab={0} onTabChange={onTabChange} />);

    await user.click(screen.getByRole('tab', { name: 'Suppliers' }));

    expect(onTabChange).toHaveBeenCalledWith(2);
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
  });

  it('moves between tabs with arrow keys in uncontrolled mode', async () => {
    const user = userEvent.setup();

    render(<PageHeader title="Procurement" tabs={tabs} defaultActiveTab={0} />);

    screen.getByRole('tab', { name: 'Overview' }).focus();
    await user.keyboard('{ArrowRight}');

    await waitFor(() => {
      const nextTab = screen.getByRole('tab', { name: 'Spend Analysis' });
      expect(nextTab).toHaveAttribute('aria-selected', 'true');
      expect(nextTab).toHaveFocus();
    });
  });

  it('announces badge counts in tab names', () => {
    render(<PageHeader title="Procurement" tabs={[{ label: 'My QC tasks', badge: 2 }]} />);

    expect(screen.getByRole('tab', { name: 'My QC tasks, 2 items' })).toBeInTheDocument();
  });
});
