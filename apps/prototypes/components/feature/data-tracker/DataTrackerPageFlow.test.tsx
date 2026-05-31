import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import DataTrackerPage from '@/app/data-tracker/page';

describe('DataTrackerPage playbook flow', () => {
  it('opens the playbook library from View Playbooks and returns to the overview', async () => {
    const user = userEvent.setup();

    render(<DataTrackerPage />);

    await user.click(screen.getByRole('button', { name: 'View Playbooks' }));

    expect(screen.getByRole('heading', { name: 'Best Practice Library' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back to Data Overview' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Back to Data Overview' }));

    expect(screen.getByRole('heading', { name: 'Contracts' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Upload Contracts' })).toBeInTheDocument();
  });
});
