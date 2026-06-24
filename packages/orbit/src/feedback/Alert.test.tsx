import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Alert } from './Alert';

describe('Alert', () => {
  it('renders a solid status icon and an svg dismiss icon', () => {
    const { container } = render(
      <Alert
        type="Information"
        title="Contract analysis is ready"
        description="Review the summary before sharing recommendations."
        onDismiss={() => {}}
      />,
    );

    const icons = container.querySelectorAll('span[aria-hidden="true"]');
    const dismissButton = screen.getByRole('button', { name: 'Dismiss information alert' });

    expect(icons).toHaveLength(1);
    expect(icons[0]).toHaveStyle({ fontWeight: '900' });
    expect(dismissButton.querySelector('svg')).not.toBeNull();
  });

  it('calls the dismiss handler from the alert close button', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();

    render(
      <Alert
        type="Information"
        title="Contract analysis is ready"
        description="Review the summary before sharing recommendations."
        onDismiss={onDismiss}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Dismiss information alert' }));

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
