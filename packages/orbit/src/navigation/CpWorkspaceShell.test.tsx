import React from 'react';
import { readFileSync } from 'node:fs';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  CpMilestoneTimelineNav,
  CpPrimaryNav,
  CpSecondaryNav,
  CpSideRail,
  CpWorkspaceShell,
} from './CpWorkspaceShell';
import { FA } from '../primitives/FaIcon';

const railItems = [
  { id: 'home', icon: FA.grip, label: 'Home', active: true },
  { id: 'team', icon: FA.user, label: 'Team' },
];

const breadcrumbItems = [
  { id: 'projects', label: 'Projects & Initiatives', href: '#' },
  { id: 'workspace', label: 'Connected Platform - Development Workstreams', href: '#' },
  { id: 'current', label: 'CP001-1014 | sdasd', current: true },
];

const primaryNavItems = [
  { id: 'gantt', label: 'Gantt Chart' },
  { id: 'initiatives', label: 'Initiatives', active: true },
  { id: 'deliverables', label: 'Deliverables' },
];

const secondaryNavItems = [
  { id: 'workspace', label: 'Workspace', active: true },
  { id: 'methodology', label: 'Methodology' },
  { id: 'suppliers', label: 'Suppliers' },
];

const timelineSteps = [
  { id: 'start', label: 'Kickoff', date: '2026-01-07', status: 'complete' as const },
  { id: 'milestone', label: 'Milestone', date: '2026-01-29', active: true },
  { id: 'finish', label: 'Finish', date: '2026-02-12' },
];

describe('CP workspace shell components', () => {
  it('renders all shell layers from data', () => {
    const { container } = render(
      <CpWorkspaceShell
        railItems={railItems}
        breadcrumbItems={breadcrumbItems}
        workspaceTitle="Connected Platform - Development Workstreams"
        primaryNavItems={primaryNavItems}
        secondaryLabel="CP001-1014 | sdasd"
        secondaryNavItems={secondaryNavItems}
        timelineSteps={timelineSteps}
        user={{ name: 'Derek Wong', initials: 'DW' }}
      >
        Workspace content
      </CpWorkspaceShell>,
    );

    expect(screen.getByRole('group', { name: 'CP workspace shell' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'CP side navigation' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Workspace primary navigation' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Workspace secondary navigation' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Milestone timeline' })).toBeInTheDocument();
    expect(screen.getAllByText('Connected Platform - Development Workstreams')).toHaveLength(2);
    expect(screen.getByText('Workspace content')).toBeInTheDocument();
    expect(container.querySelector('[aria-label="Derek Wong"]')).toBeInTheDocument();
    expect(screen.getByText('Derek Wong').className).toContain('visuallyHidden');
  });

  it('keeps compact rail labels accessible without rendering them visibly', () => {
    const { container } = render(
      <CpSideRail
        items={railItems}
        user={{ name: 'Derek Wong', initials: 'DW' }}
        logoLabel="DEV"
      />,
    );

    expect(screen.getByRole('button', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('Home').className).toContain('visuallyHidden');
    expect(container.querySelector('[aria-label="Derek Wong"]')).toBeInTheDocument();
    expect(screen.getByText('Derek Wong').className).toContain('visuallyHidden');
    expect(screen.getByText('DEV')).toBeVisible();
    expect(screen.getByText('DW')).toBeVisible();
  });

  it('exposes active rail, nav, breadcrumb, and timeline states semantically', () => {
    render(
      <CpWorkspaceShell
        railItems={railItems}
        breadcrumbItems={breadcrumbItems}
        workspaceTitle="Connected Platform - Development Workstreams"
        primaryNavItems={primaryNavItems}
        secondaryLabel="CP001-1014 | sdasd"
        secondaryNavItems={secondaryNavItems}
        timelineSteps={timelineSteps}
      >
        Workspace content
      </CpWorkspaceShell>,
    );

    expect(screen.getByRole('button', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Initiatives' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Workspace' })).toHaveAttribute('aria-current', 'page');
    const currentBreadcrumb = screen
      .getAllByText('CP001-1014 | sdasd')
      .find((element) => element.getAttribute('aria-current') === 'page');
    expect(currentBreadcrumb).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Milestone, 2026-01-29' })).toHaveAttribute('aria-current', 'step');
  });

  it('does not call disabled item handlers', () => {
    const onDisabled = vi.fn();
    const onEnabled = vi.fn();

    render(
      <CpPrimaryNav
        items={[
          { id: 'enabled', label: 'Enabled', onClick: onEnabled },
          { id: 'disabled', label: 'Disabled', onClick: onDisabled, disabled: true },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Enabled' }));
    fireEvent.click(screen.getByRole('button', { name: 'Disabled' }));

    expect(onEnabled).toHaveBeenCalledTimes(1);
    expect(onDisabled).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled();
  });

  it('renders preview hover classes without active semantics', () => {
    const { container } = render(
      <CpSecondaryNav
        label="CP001-1014 | sdasd"
        items={[{ id: 'hover', label: 'Hover Preview', previewState: 'hover' }]}
      />,
    );

    expect(container.querySelector('[class*="previewHover"]')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hover Preview' })).not.toHaveAttribute('aria-current');
  });

  it('uses step statuses without requiring handlers', () => {
    render(<CpMilestoneTimelineNav steps={timelineSteps} />);

    expect(screen.getByText('Kickoff').className).toContain('visuallyHidden');
    expect(screen.getByText('2026-01-07')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Finish, 2026-02-12' })).toBeInTheDocument();
  });

  it('can show timeline labels when documentation needs the fuller state', () => {
    render(<CpMilestoneTimelineNav steps={timelineSteps} showLabels />);

    expect(screen.getByText('Kickoff')).toBeVisible();
  });

  it('declares type button on every rendered button', () => {
    const { container } = render(
      <CpWorkspaceShell
        railItems={railItems}
        breadcrumbItems={breadcrumbItems}
        workspaceTitle="Connected Platform - Development Workstreams"
        primaryNavItems={primaryNavItems}
        secondaryLabel="CP001-1014 | sdasd"
        secondaryNavItems={secondaryNavItems}
        timelineSteps={timelineSteps}
        rightActions={[{ id: 'action', label: 'Action' }]}
      >
        Workspace content
      </CpWorkspaceShell>,
    );

    const buttons = Array.from(container.querySelectorAll('button'));
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  it('keeps component CSS free from raw hex colours', () => {
    const css = readFileSync('packages/orbit/src/navigation/CpWorkspaceShell.module.css', 'utf8');

    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
  });
});
