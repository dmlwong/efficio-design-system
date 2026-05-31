import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ToolNextStepsCard, type ToolNextStepAction } from './ToolNextStepsCard';

const customActions: ToolNextStepAction[] = [
  {
    id: 'review',
    icon: '\uf06e',
    title: 'Review Findings',
    description: 'Open the generated summary.',
    href: '/review',
  },
  {
    id: 'assign',
    icon: '\uf007',
    title: 'Assign Owner',
    description: 'Send this to a colleague.',
  },
  {
    id: 'disabled',
    icon: '\uf05e',
    title: 'Disabled Action',
    description: 'Unavailable for this initiative.',
    disabled: true,
  },
];

describe('ToolNextStepsCard', () => {
  it('renders the default example actions', () => {
    render(<ToolNextStepsCard />);

    expect(screen.getByText('Next, you can...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Analyse Contract on Another Initiative/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Update Milestone/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Complete Initiative/ })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Milestone' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Due Date' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Action' })).toBeInTheDocument();
    expect(screen.getByText('Gate 1')).toBeInTheDocument();
    expect(screen.getByText('Gate 5')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Mark Complete' })).toHaveLength(5);
  });

  it('toggles expanded milestone content', async () => {
    const user = userEvent.setup();

    render(<ToolNextStepsCard />);

    const updateMilestone = screen.getByRole('button', { name: /Update Milestone/ });
    expect(updateMilestone).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Gate 1')).toBeInTheDocument();

    await user.click(updateMilestone);

    expect(updateMilestone).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Gate 1')).not.toBeInTheDocument();

    await user.click(updateMilestone);

    expect(updateMilestone).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Gate 1')).toBeInTheDocument();
  });

  it('supports hidden chevrons, expanded chevrons, and dividers', () => {
    const actions: ToolNextStepAction[] = [
      {
        id: 'hidden',
        icon: '\uf890',
        title: 'Hidden Chevron',
        description: 'Keeps layout space.',
        hideChevron: true,
        dividerAfter: true,
      },
      {
        id: 'expanded',
        icon: '\uf328',
        title: 'Expanded Chevron',
        description: 'Shows the row is open.',
        expanded: true,
      },
    ];

    const { container } = render(<ToolNextStepsCard actions={actions} />);

    expect(container.querySelector('hr')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Hidden Chevron/ }).querySelector('span[style*="visibility: hidden"]')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Expanded Chevron/ })).toHaveTextContent('\uf077');
  });

  it('renders custom actions with href and callback behavior', async () => {
    const user = userEvent.setup();
    const onActionSelect = vi.fn();

    render(
      <ToolNextStepsCard
        title="Recommended actions"
        actions={customActions}
        onActionSelect={onActionSelect}
      />
    );

    expect(screen.getByText('Recommended actions')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Review Findings/ })).toHaveAttribute('href', '/review');

    await user.click(screen.getByRole('button', { name: /Assign Owner/ }));
    await user.click(screen.getByRole('button', { name: /Disabled Action/ }));

    expect(onActionSelect).toHaveBeenCalledWith('assign');
    expect(onActionSelect).not.toHaveBeenCalledWith('disabled');
  });
});
