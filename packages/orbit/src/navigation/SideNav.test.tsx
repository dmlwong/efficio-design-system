import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SideNav } from './SideNav';

const requiredProps = {
  appName: 'Orbit Test',
  clientName: 'Client Test',
  userName: 'Alex Taylor',
  userInitials: 'AT',
};

describe('SideNav', () => {
  it('uses the CSS token standard width by default', () => {
    render(<SideNav {...requiredProps} />);

    expect(screen.getByRole('navigation')).not.toHaveAttribute('style');
  });

  it('supports custom shell labels and action icons without changing defaults', () => {
    const onWorkSearch = vi.fn();
    const onProfileMenu = vi.fn();

    render(
      <SideNav
        {...requiredProps}
        logoIcon="\uf0ac"
        clientChevronIcon="\uf105"
        workHeading="Recent Work"
        workSearchIcon="\uf002"
        workSearchAriaLabel="Find recent work"
        onWorkSearch={onWorkSearch}
        profileMenuIcon="\uf142"
        profileMenuAriaLabel="Open account actions"
        onProfileMenu={onProfileMenu}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Find recent work' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open account actions' }));

    expect(screen.getByText('Recent Work')).toBeInTheDocument();
    expect(onWorkSearch).toHaveBeenCalledTimes(1);
    expect(onProfileMenu).toHaveBeenCalledTimes(1);
  });

  it('keys expanded state by section id when labels duplicate', () => {
    render(
      <SideNav
        {...requiredProps}
        sections={[
          {
            id: 'deliver-primary',
            label: 'Deliver',
            color: 'var(--orbit-color-header-deliver-from)',
            expanded: true,
            items: [{ id: 'route-a', icon: '\uf135', label: 'Route A' }],
          },
          {
            id: 'deliver-secondary',
            label: 'Deliver',
            color: 'var(--orbit-color-header-sustain-from)',
            items: [{ id: 'route-b', icon: '\uf135', label: 'Route B' }],
          },
        ]}
      />
    );

    expect(screen.getByText('Route A')).toBeInTheDocument();
    expect(screen.queryByText('Route B')).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: 'Deliver' })[1]);

    expect(screen.getByText('Route A')).toBeInTheDocument();
    expect(screen.getByText('Route B')).toBeInTheDocument();
  });

  it('renders interactive chevrons for collapsed sections without expanded semantics', () => {
    const { container } = render(
      <SideNav
        {...requiredProps}
        sections={[
          { id: 'identify', label: 'Identify', color: 'var(--orbit-color-header-identify-from)', showChevron: true },
        ]}
      />
    );

    const sectionButton = screen.getByRole('button', { name: 'Identify' });
    expect(sectionButton).toBeInTheDocument();
    expect(sectionButton).not.toHaveAttribute('aria-expanded');
    expect(screen.getByText('Identify').closest('[aria-expanded]')).not.toBeInTheDocument();
    expect(container.textContent).toContain('\uf078');

    fireEvent.click(sectionButton);
    expect(sectionButton).not.toHaveAttribute('aria-expanded');
  });

  it('renders href rows as links and handles long labels in constrained width', () => {
    render(
      <SideNav
        {...requiredProps}
        width={220}
        navItems={[
          { id: 'docs', icon: '\uf15b', label: 'Document Search With A Very Long Label', href: '/documents' },
        ]}
        workItems={[
          { id: 'long-work', title: 'Long Running Procurement Scenario Analysis', subtitle: 'Just now' },
        ]}
      />
    );

    expect(screen.getByRole('navigation')).toHaveStyle('--sidenav-width: 220px');
    expect(screen.getByRole('link', { name: 'Document Search With A Very Long Label' })).toHaveAttribute('href', '/documents');
    expect(screen.getByText('Long Running Procurement Scenario Analysis')).toBeInTheDocument();
  });
});
