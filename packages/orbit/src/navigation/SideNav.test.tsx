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

  it('renders the My Work region by default', () => {
    const { container } = render(
      <SideNav
        {...requiredProps}
        workItems={[{ id: 'default-work', title: 'Default work item', subtitle: 'Just now' }]}
      />
    );

    expect(screen.getByText('My Work')).toBeInTheDocument();
    expect(screen.getByText('Default work item')).toBeInTheDocument();
    expect(container.querySelector('[class*="workHeaderDivided"]')).toBeInTheDocument();
  });

  it('renders the profile footer by default', () => {
    const { container } = render(<SideNav {...requiredProps} />);

    expect(screen.getByText('Alex Taylor')).toBeInTheDocument();
    expect(screen.getByText('AT')).toBeInTheDocument();
    expect(container.querySelector('[class*="profile"]')).toBeInTheDocument();
    expect(container.querySelector('[class*="profileDivider"]')).toBeInTheDocument();
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

  it('can hide the work region while preserving nav and profile content', () => {
    const { container } = render(
      <SideNav
        {...requiredProps}
        showWorkRegion={false}
        navItems={[{ id: 'home', icon: '\uf015', label: 'Home' }]}
        workItems={[{ id: 'hidden-work', title: 'Hidden work item', subtitle: 'Just now' }]}
      />
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.queryByText('My Work')).not.toBeInTheDocument();
    expect(screen.queryByText('Hidden work item')).not.toBeInTheDocument();
    expect(screen.getByText('Alex Taylor')).toBeInTheDocument();
    expect(container.querySelector('[class*="workHeaderDivided"]')).not.toBeInTheDocument();
  });

  it('can hide the profile region and all divider chrome', () => {
    const { container } = render(
      <SideNav
        {...requiredProps}
        showProfile={false}
        showDividers={false}
        navItems={[{ id: 'home', icon: '\uf015', label: 'Home' }]}
      />
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.queryByText('Alex Taylor')).not.toBeInTheDocument();
    expect(screen.queryByText('AT')).not.toBeInTheDocument();
    expect(container.querySelector('[class*="divider"]')).not.toBeInTheDocument();
    expect(container.querySelector('[class*="workHeaderDivided"]')).not.toBeInTheDocument();
    expect(container.querySelector('[class*="profileDivider"]')).not.toBeInTheDocument();
  });

  it('renders preview hover state on nav, section, subitem, and work rows without active semantics', () => {
    const { container } = render(
      <SideNav
        {...requiredProps}
        navItems={[{ id: 'hover-nav', icon: '\uf015', label: 'Hover Nav', previewState: 'hover' }]}
        sections={[
          {
            id: 'hover-section',
            label: 'Hover Section',
            color: 'var(--orbit-color-header-deliver-from)',
            expanded: true,
            previewState: 'hover',
            items: [
              { id: 'hover-subitem', icon: '\uf135', label: 'Hover Subitem', previewState: 'hover' },
            ],
          },
        ]}
        workItems={[{ id: 'hover-work', title: 'Hover Work', subtitle: 'Just now', previewState: 'hover' }]}
      />
    );

    expect(container.querySelectorAll('[class*="previewHover"]')).toHaveLength(4);
    expect(screen.getByText('Hover Nav').closest('[class*="previewHover"]')).toBeInTheDocument();
    expect(screen.getByText('Hover Section').closest('[class*="previewHover"]')).toBeInTheDocument();
    expect(screen.getByText('Hover Subitem').closest('[class*="previewHover"]')).toBeInTheDocument();
    expect(screen.getByText('Hover Work').closest('[class*="previewHover"]')).toBeInTheDocument();
    expect(screen.getByText('Hover Nav').closest('[aria-current="page"]')).not.toBeInTheDocument();
    expect(screen.getByText('Hover Subitem').closest('[aria-current="page"]')).not.toBeInTheDocument();
    expect(screen.getByText('Hover Work').closest('[aria-current="page"]')).not.toBeInTheDocument();
  });

  it('renders visual hover surfaces on static nav and work rows without clickable affordances', () => {
    render(
      <SideNav
        {...requiredProps}
        navItems={[{ id: 'static-nav', icon: '\uf015', label: 'Static Nav' }]}
        sections={[
          {
            id: 'static-section',
            label: 'Static Section',
            color: 'var(--orbit-color-header-deliver-from)',
            expanded: true,
            items: [
              { id: 'static-subitem', icon: '\uf135', label: 'Static Subitem' },
            ],
          },
        ]}
        workItems={[{ id: 'static-work', title: 'Static Work', subtitle: 'Just now' }]}
      />
    );

    expect(screen.getByText('Static Nav').closest('[class*="hoverable"]')).toBeInTheDocument();
    expect(screen.getByText('Static Subitem').closest('[class*="hoverable"]')).toBeInTheDocument();
    expect(screen.getByText('Static Work').closest('[class*="hoverable"]')).toBeInTheDocument();
    expect(screen.getByText('Static Nav').closest('[class*="interactive"]')).not.toBeInTheDocument();
    expect(screen.getByText('Static Work').closest('[class*="interactive"]')).not.toBeInTheDocument();
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

  it('marks active navigation rows as the current page', () => {
    render(
      <SideNav
        {...requiredProps}
        navItems={[{ id: 'home', icon: '\uf015', label: 'Home', active: true }]}
      />
    );

    expect(screen.getByText('Home').closest('[aria-current="page"]')).toHaveAttribute('aria-current', 'page');
  });
});
