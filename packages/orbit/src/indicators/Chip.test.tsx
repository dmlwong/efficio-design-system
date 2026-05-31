import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Chip, type ChipProps } from './Chip';

describe('Chip', () => {
  it('renders static chips without button semantics', () => {
    render(<Chip label="Static" />);

    expect(screen.getByText('Static')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Static' })).not.toBeInTheDocument();
  });

  it('renders toggle chips as buttons with pressed state', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Chip label="Filter" selected onClick={onClick} />);

    const chip = screen.getByRole('button', { name: 'Filter' });
    expect(chip).toHaveAttribute('aria-pressed', 'true');

    await user.click(chip);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders removable chips with a separate remove button', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();

    render(<Chip label="Contract" removable onRemove={onRemove} />);

    expect(screen.queryByRole('button', { name: 'Contract' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove Contract' }));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('does not activate disabled interactive or removable chips', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onRemove = vi.fn();

    render(
      <>
        <Chip label="Disabled filter" disabled onClick={onClick} />
        <Chip label="Disabled remove" disabled removable onRemove={onRemove} />
      </>
    );

    await user.click(screen.getByRole('button', { name: 'Disabled filter' }));
    await user.click(screen.getByRole('button', { name: 'Remove Disabled remove' }));

    expect(onClick).not.toHaveBeenCalled();
    expect(onRemove).not.toHaveBeenCalled();
  });

  it('documents the TypeScript split between toggle and removable chips', () => {
    const removableChip: ChipProps = { label: 'Remove me', removable: true, onRemove: () => {} };
    // @ts-expect-error removable chips cannot also be toggle chips
    const invalidChip: ChipProps = { label: 'Invalid', removable: true, onClick: () => {} };

    expect(removableChip.removable).toBe(true);
    expect(invalidChip.label).toBe('Invalid');
  });
});
