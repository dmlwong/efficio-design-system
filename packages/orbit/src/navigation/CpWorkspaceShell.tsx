'use client';

import React from 'react';
import clsx from 'clsx';
import { FA, FaIcon } from '../primitives/FaIcon';
import styles from './CpWorkspaceShell.module.css';

export type CpPreviewState = 'hover';

export interface CpActionBase {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  previewState?: CpPreviewState;
  ariaLabel?: string;
}

export interface CpSideRailItem extends CpActionBase {
  icon: string;
}

export interface CpBreadcrumbItem {
  id?: string;
  label: string;
  href?: string;
  current?: boolean;
}

export interface CpNavItem extends CpActionBase {
  icon?: string;
}

export type CpTimelineStepStatus = 'complete' | 'active' | 'upcoming';

export interface CpTimelineStep extends CpActionBase {
  date: string;
  status?: CpTimelineStepStatus;
}

export interface CpWorkspaceUser {
  name: string;
  initials: string;
  ariaLabel?: string;
}

export interface CpSideRailProps {
  items?: CpSideRailItem[];
  user?: CpWorkspaceUser;
  logoLabel?: string;
  logoIcon?: string;
  compact?: boolean;
  ariaLabel?: string;
}

export interface CpBreadcrumbHeaderProps {
  items: CpBreadcrumbItem[];
  ariaLabel?: string;
}

export interface CpPrimaryNavProps {
  items: CpNavItem[];
  ariaLabel?: string;
}

export interface CpWorkspaceHeaderProps {
  workspaceTitle: string;
  primaryNavItems: CpNavItem[];
  workspaceIcon?: string;
  rightActions?: CpNavItem[];
  primaryNavAriaLabel?: string;
}

export interface CpSecondaryNavProps {
  label?: string;
  items: CpNavItem[];
  rightActions?: CpNavItem[];
  ariaLabel?: string;
}

export interface CpMilestoneTimelineNavProps {
  steps: CpTimelineStep[];
  showLabels?: boolean;
  ariaLabel?: string;
}

export interface CpWorkspaceShellProps {
  railItems: CpSideRailItem[];
  breadcrumbItems: CpBreadcrumbItem[];
  workspaceTitle: string;
  primaryNavItems: CpNavItem[];
  secondaryNavItems: CpNavItem[];
  timelineSteps: CpTimelineStep[];
  children: React.ReactNode;
  secondaryLabel?: string;
  rightActions?: CpNavItem[];
  user?: CpWorkspaceUser;
  logoLabel?: string;
  logoIcon?: string;
  railCompact?: boolean;
  timelineShowLabels?: boolean;
  workspaceIcon?: string;
  ariaLabel?: string;
}

const EMPTY_RAIL_ITEMS: CpSideRailItem[] = [];
const EMPTY_NAV_ITEMS: CpNavItem[] = [];
const EMPTY_TIMELINE_STEPS: CpTimelineStep[] = [];

interface ActionPrimitiveProps {
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className: string;
  children: React.ReactNode;
  ariaLabel?: string;
  ariaCurrent?: React.AriaAttributes['aria-current'];
  title?: string;
}

function ActionPrimitive({
  href,
  onClick,
  disabled,
  className,
  children,
  ariaLabel,
  ariaCurrent,
  title,
}: ActionPrimitiveProps) {
  if (href && !disabled) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={className}
        aria-label={ariaLabel}
        aria-current={ariaCurrent}
        title={title}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      title={title}
    >
      {children}
    </button>
  );
}

function TokenIcon({ icon, className }: { icon: string; className?: string }) {
  return (
    <FaIcon
      icon={icon}
      className={className}
      style={{ fontSize: 'var(--orbit-cp-rail-icon-size)' }}
    />
  );
}

function navItemClass(item: Pick<CpActionBase, 'active' | 'previewState'>, baseClassName: string) {
  return clsx(
    styles.navButton,
    styles.navLink,
    baseClassName,
    item.active && styles.active,
    item.previewState === 'hover' && styles.previewHover,
  );
}

export function CpSideRail({
  items = EMPTY_RAIL_ITEMS,
  user,
  logoLabel = 'DEV',
  logoIcon,
  compact = true,
  ariaLabel = 'CP side navigation',
}: CpSideRailProps) {
  return (
    <nav className={clsx(styles.sideRail, compact && styles.compactRail)} aria-label={ariaLabel}>
      <div className={styles.railTop}>
        <div className={styles.railLogo} aria-label={logoLabel}>
          {logoIcon ? (
            <span className={styles.railIconBox}>
              <TokenIcon icon={logoIcon} />
            </span>
          ) : (
            <span className={styles.railLogoText}>{logoLabel}</span>
          )}
        </div>

        <ul className={styles.railList}>
          {items.map((item) => (
            <li key={item.id}>
              <ActionPrimitive
                href={item.href}
                onClick={item.onClick}
                disabled={item.disabled}
                className={clsx(
                  styles.railAction,
                  item.active && styles.active,
                  item.previewState === 'hover' && styles.previewHover,
                )}
                ariaLabel={item.ariaLabel ?? item.label}
                ariaCurrent={item.active ? 'page' : undefined}
                title={item.label}
              >
                <span className={styles.railIconBox}>
                  <TokenIcon icon={item.icon} />
                </span>
                <span className={clsx(styles.railLabel, compact && styles.visuallyHidden)}>{item.label}</span>
              </ActionPrimitive>
            </li>
          ))}
        </ul>
      </div>

      {user ? (
        <div className={styles.railBottom}>
          <div className={styles.railUser} aria-label={user.ariaLabel ?? user.name}>
            <span className={styles.railAvatar}>{user.initials}</span>
            <span className={clsx(styles.railLabel, compact && styles.visuallyHidden)}>{user.name}</span>
          </div>
        </div>
      ) : null}
    </nav>
  );
}

export function CpBreadcrumbHeader({
  items,
  ariaLabel = 'Breadcrumb',
}: CpBreadcrumbHeaderProps) {
  return (
    <header className={styles.breadcrumbHeader}>
      <nav className={styles.breadcrumbNav} aria-label={ariaLabel}>
        <ol className={styles.breadcrumbList}>
          {items.map((item, index) => {
            const isCurrent = item.current || index === items.length - 1;
            const key = item.id ?? `${item.label}-${index}`;

            return (
              <li key={key} className={styles.breadcrumbItem}>
                {item.href && !isCurrent ? (
                  <a className={styles.breadcrumbLink} href={item.href}>
                    {item.label}
                  </a>
                ) : (
                  <span className={styles.breadcrumbCurrent} aria-current={isCurrent ? 'page' : undefined}>
                    {item.label}
                  </span>
                )}
                {index < items.length - 1 ? <span aria-hidden="true">/</span> : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </header>
  );
}

export function CpPrimaryNav({
  items = EMPTY_NAV_ITEMS,
  ariaLabel = 'Workspace primary navigation',
}: CpPrimaryNavProps) {
  return (
    <nav className={styles.primaryNav} aria-label={ariaLabel}>
      <ul className={styles.primaryNavList}>
        {items.map((item) => (
          <li key={item.id}>
            <ActionPrimitive
              href={item.href}
              onClick={item.onClick}
              disabled={item.disabled}
              className={navItemClass(item, styles.primaryNavItem)}
              ariaLabel={item.ariaLabel}
              ariaCurrent={item.active ? 'page' : undefined}
            >
              {item.icon ? <TokenIcon icon={item.icon} /> : null}
              <span>{item.label}</span>
            </ActionPrimitive>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function CpWorkspaceHeader({
  workspaceTitle,
  primaryNavItems,
  workspaceIcon = FA.grip,
  rightActions = EMPTY_NAV_ITEMS,
  primaryNavAriaLabel,
}: CpWorkspaceHeaderProps) {
  return (
    <header className={styles.workspaceHeader}>
      <div className={styles.workspaceTitle}>
        <span className={styles.workspaceIcon}>
          <TokenIcon icon={workspaceIcon} />
        </span>
        <span className={styles.workspaceTitleText}>{workspaceTitle}</span>
      </div>

      <CpPrimaryNav items={primaryNavItems} ariaLabel={primaryNavAriaLabel} />

      <div className={styles.workspaceHeaderActions}>
        {rightActions.map((action) => (
          <ActionPrimitive
            key={action.id}
            href={action.href}
            onClick={action.onClick}
            disabled={action.disabled}
            className={clsx(
              styles.navButton,
              styles.navLink,
              styles.headerAction,
              action.previewState === 'hover' && styles.previewHover,
            )}
            ariaLabel={action.ariaLabel ?? action.label}
          >
            {action.icon ? <TokenIcon icon={action.icon} /> : null}
            <span>{action.label}</span>
          </ActionPrimitive>
        ))}
      </div>
    </header>
  );
}

export function CpSecondaryNav({
  label,
  items = EMPTY_NAV_ITEMS,
  rightActions = EMPTY_NAV_ITEMS,
  ariaLabel = 'Workspace secondary navigation',
}: CpSecondaryNavProps) {
  return (
    <div className={styles.secondaryNav}>
      <div className={styles.secondaryLabel}>{label}</div>

      <nav className={styles.secondaryTabs} aria-label={ariaLabel}>
        <ul className={styles.secondaryTabList}>
          {items.map((item) => (
            <li key={item.id}>
              <ActionPrimitive
                href={item.href}
                onClick={item.onClick}
                disabled={item.disabled}
                className={navItemClass(item, styles.secondaryNavItem)}
                ariaLabel={item.ariaLabel}
                ariaCurrent={item.active ? 'page' : undefined}
              >
                {item.icon ? <TokenIcon icon={item.icon} /> : null}
                <span>{item.label}</span>
              </ActionPrimitive>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.secondaryActions}>
        {rightActions.map((action) => (
          <ActionPrimitive
            key={action.id}
            href={action.href}
            onClick={action.onClick}
            disabled={action.disabled}
            className={clsx(
              styles.navButton,
              styles.navLink,
              styles.secondaryAction,
              action.previewState === 'hover' && styles.previewHover,
            )}
            ariaLabel={action.ariaLabel ?? action.label}
          >
            {action.icon ? <TokenIcon icon={action.icon} /> : null}
            <span>{action.label}</span>
          </ActionPrimitive>
        ))}
      </div>
    </div>
  );
}

export function CpMilestoneTimelineNav({
  steps = EMPTY_TIMELINE_STEPS,
  showLabels = false,
  ariaLabel = 'Milestone timeline',
}: CpMilestoneTimelineNavProps) {
  return (
    <nav className={styles.timelineNav} aria-label={ariaLabel}>
      <div className={styles.timelineViewport}>
        <div className={styles.timelineTrack} aria-hidden="true">
          <span className={styles.timelineHighlight} />
          <span className={styles.timelineLine} />
        </div>

        <ol className={styles.timelineList}>
          {steps.map((step) => {
            const status = step.active ? 'active' : step.status ?? 'upcoming';

            return (
              <li key={step.id} className={styles.timelineStep}>
                <ActionPrimitive
                  href={step.href}
                  onClick={step.onClick}
                  disabled={step.disabled}
                  className={clsx(
                    styles.timelineButton,
                    styles.timelineLink,
                    styles.timelineItem,
                    styles[status],
                    step.previewState === 'hover' && styles.previewHover,
                  )}
                  ariaLabel={step.ariaLabel ?? `${step.label}, ${step.date}`}
                  ariaCurrent={step.active ? 'step' : undefined}
                >
                  <span className={styles.timelineSymbol}>
                    {status === 'complete' ? (
                      <FaIcon icon={FA.check} style={{ fontSize: 'var(--orbit-text-xs)' }} />
                    ) : null}
                  </span>
                  <span className={clsx(styles.timelineLabel, !showLabels && styles.visuallyHidden)}>{step.label}</span>
                  <span className={styles.timelineDate}>{step.date}</span>
                </ActionPrimitive>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

export function CpWorkspaceShell({
  railItems,
  breadcrumbItems,
  workspaceTitle,
  primaryNavItems,
  secondaryNavItems,
  timelineSteps,
  children,
  secondaryLabel,
  rightActions,
  user,
  logoLabel,
  logoIcon,
  railCompact,
  timelineShowLabels,
  workspaceIcon,
  ariaLabel = 'CP workspace shell',
}: CpWorkspaceShellProps) {
  return (
    <div className={styles.shell} role="group" aria-label={ariaLabel}>
      <CpSideRail
        items={railItems}
        user={user}
        logoLabel={logoLabel}
        logoIcon={logoIcon}
        compact={railCompact}
      />
      <main className={styles.main}>
        <CpBreadcrumbHeader items={breadcrumbItems} />
        <CpWorkspaceHeader
          workspaceTitle={workspaceTitle}
          primaryNavItems={primaryNavItems}
          workspaceIcon={workspaceIcon}
        />
        <CpSecondaryNav label={secondaryLabel} items={secondaryNavItems} rightActions={rightActions} />
        <CpMilestoneTimelineNav steps={timelineSteps} showLabels={timelineShowLabels} />
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
