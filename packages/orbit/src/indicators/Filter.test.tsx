import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Filter } from './Filter';

describe('Filter', () => {
  it('renders an applied filter label', () => {
    render(<Filter label="Category: Legal" />);

    expect(screen.getByText('Category: Legal')).toBeInTheDocument();
  });

  it('removes a filter', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();

    render(<Filter label="Category: Legal" onRemove={onRemove} />);
    await user.click(screen.getByRole('button', { name: 'Remove Category: Legal' }));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
