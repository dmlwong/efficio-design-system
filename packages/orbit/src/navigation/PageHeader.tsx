'use client';

import React, { useEffect, useId, useState } from 'react';
import clsx from 'clsx';
import { Button, IconButton } from '../actions';
import { FaIcon } from '../primitives/FaIcon';
import { TabButton } from './TabButton';
import { Badge } from '../indicators/Badge';
import styles from './PageHeader.module.css';

/* ─── Types ─── */

export interface PageHeaderAction {
  id?: string;
  label: string;
  ariaLabel?: string;
  icon?: string;
  variant?: 'Primary' | 'Secondary' | 'IconOnly';
  onClick?: () => void;
  disabled?: boolean;
}

export interface PageHeaderTab {
  id?: string;
  label: string;
  badge?: number;
  panelId?: string;
  disabled?: boolean;
}

export interface PageHeaderPill {
  code: string;
  label: string;
}

export interface PageHeaderProps {
  /** 'main' = greeting header, 'tool' = tool/app header with icon */
  type?: 'main' | 'tool';
  title: string;
  subtitle?: string;
  /** FA icon unicode for tool headers */
  icon?: string;
  /** Gradient colors [from, to] for the icon button */
  iconGradient?: [string, string];
  /** Bottom border color (2px). Omit for no colored border */
  borderColor?: string;
  /** Right-side action buttons */
  actions?: PageHeaderAction[];
  /** Initiative pill shown on the right */
  pill?: PageHeaderPill;
  /** Tab bar below the header */
  tabs?: PageHeaderTab[];
  /** Active tab index */
  activeTab?: number;
  /** Initial tab index for uncontrolled headers */
  defaultActiveTab?: number;
  /** Callback when tab is clicked */
  onTabChange?: (index: number) => void;
  /** Whether active tab shows underline */
  showTabUnderline?: boolean;
}

/* ─── Preset gradients for common categories ─── */

export const HeaderPresets = {
  identify: { iconGradient: ['var(--orbit-color-header-identify-from)', 'var(--orbit-color-header-identify-to)'] as [string, string], borderColor: 'var(--orbit-color-header-identify-border)' },
  deliver: { iconGradient: ['var(--orbit-color-header-deliver-from)', 'var(--orbit-color-header-deliver-to)'] as [string, string], borderColor: 'var(--orbit-color-header-deliver-border)' },
  sustain: { iconGradient: ['var(--orbit-color-header-sustain-from)', 'var(--orbit-color-header-sustain-to)'] as [string, string], borderColor: 'var(--orbit-color-header-sustain-border)' },
  rfp: { iconGradient: ['var(--orbit-color-header-rfp-from)', 'var(--orbit-color-header-rfp-to)'] as [string, string], borderColor: 'var(--orbit-color-header-rfp-border)' },
};

/* ─── Sub-components ─── */

function clampIndex(index: number | undefined, count: number): number {
  if (count <= 0 || index === undefined || !Number.isFinite(index)) return 0;
  return Math.max(0, Math.min(Math.floor(index), count - 1));
}

function getSelectableIndex(tabs: PageHeaderTab[], preferredIndex: number | undefined): number {
  if (tabs.length === 0) return 0;

  const bounded = clampIndex(preferredIndex, tabs.length);
  if (!tabs[bounded]?.disabled) return bounded;

  const firstEnabled = tabs.findIndex((tab) => !tab.disabled);
  return firstEnabled >= 0 ? firstEnabled : bounded;
}

function getNextSelectableIndex(tabs: PageHeaderTab[], currentIndex: number, direction: 1 | -1): number {
  if (tabs.length === 0 || tabs.every((tab) => tab.disabled)) return currentIndex;

  for (let offset = 1; offset <= tabs.length; offset += 1) {
    const nextIndex = (currentIndex + direction * offset + tabs.length) % tabs.length;
    if (!tabs[nextIndex]?.disabled) return nextIndex;
  }

  return currentIndex;
}

function GradientIcon({ icon, gradient }: { icon: string; gradient: [string, string] }) {
  return (
    <span
      className={styles.gradientIcon}
      style={{
        '--_gradient-from': gradient[0],
        '--_gradient-to': gradient[1],
      } as React.CSSProperties}
    >
      <FaIcon icon={icon} size={16} color="var(--orbit-color-btn-primary-fg)" />
    </span>
  );
}

function ActionButton({ label, ariaLabel, icon, variant = 'Secondary', onClick, disabled }: PageHeaderAction) {
  const isIconOnly = variant === 'IconOnly';
  const accessibleName = (ariaLabel || label).trim();
  const iconNode = icon ? <FaIcon icon={icon} size={14} color="currentColor" /> : undefined;

  if (!accessibleName) return null;

  if (isIconOnly && iconNode) {
    return (
      <IconButton
        ariaLabel={accessibleName}
        icon={iconNode}
        size="Medium"
        state={disabled ? 'Disabled' : 'Default'}
        variant="Secondary"
        onClick={onClick}
      />
    );
  }

  return (
    <Button
      icon={iconNode}
      size="Medium"
      state={disabled ? 'Disabled' : 'Default'}
      variant={variant === 'Primary' ? 'Primary' : 'Secondary'}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

function InitiativePill({ code, label }: PageHeaderPill) {
  return (
    <div className={styles.pill}>
      <FaIcon icon={'\uf0c1'} size={12} color="var(--orbit-color-text-secondary)" />
      <span className={styles.pillText}>
        {code} | {label}
      </span>
    </div>
  );
}

function TabBar({ tabs, activeTab, onTabChange, showTabUnderline, tabIdBase }: {
  tabs: PageHeaderTab[];
  activeTab: number;
  onTabChange: (i: number) => void;
  showTabUnderline: boolean;
  tabIdBase: string;
}) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    if (tabs.length === 0 || tabs.every((tab) => tab.disabled)) return;

    event.preventDefault();
    const tabList = event.currentTarget;
    const nextIndex =
      event.key === 'Home'
        ? tabs.findIndex((tab) => !tab.disabled)
        : event.key === 'End'
          ? [...tabs].map((tab, index) => ({ tab, index })).reverse().find(({ tab }) => !tab.disabled)?.index ?? activeTab
          : event.key === 'ArrowRight'
            ? getNextSelectableIndex(tabs, activeTab, 1)
            : getNextSelectableIndex(tabs, activeTab, -1);

    onTabChange(nextIndex);
    requestAnimationFrame(() => {
      const tab = tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex];
      tab?.focus();
    });
  };

  return (
    <div
      role="tablist"
      aria-label="Page sections"
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
      className={styles.tabList}
    >
      {tabs.map((tab, i) => {
        const tabId = tab.id || `${tabIdBase}-tab-${i}`;

        return (
          <TabButton
            key={tab.id || `${tab.label}-${i}`}
            id={tabId}
            active={i === activeTab}
            ariaControls={tab.panelId}
            aria-label={tab.badge !== undefined ? `${tab.label}, ${tab.badge} items` : undefined}
            disabled={tab.disabled}
            onClick={() => onTabChange(i)}
            showUnderline={showTabUnderline}
            status={tab.disabled ? 'Disabled' : 'Rest'}
          >
            {tab.label}
            {tab.badge !== undefined && <Badge label={String(tab.badge)} status="Red" />}
          </TabButton>
        );
      })}
    </div>
  );
}

/* ─── Main Component ─── */

export const PageHeader: React.FC<PageHeaderProps> = ({
  type = 'tool',
  title,
  subtitle,
  icon,
  iconGradient,
  borderColor,
  actions,
  pill,
  tabs,
  activeTab,
  defaultActiveTab,
  onTabChange,
  showTabUnderline = true,
}) => {
  const tabIdBase = useId();
  const tabsLength = tabs?.length ?? 0;
  const isControlled = activeTab !== undefined && onTabChange !== undefined;
  const [uncontrolledTab, setUncontrolledTab] = useState(() => (
    getSelectableIndex(tabs || [], defaultActiveTab ?? activeTab)
  ));

  useEffect(() => {
    if (!tabsLength) {
      setUncontrolledTab(0);
      return;
    }

    setUncontrolledTab((current) => getSelectableIndex(tabs || [], current));
  }, [tabs, tabsLength]);

  useEffect(() => {
    if (!isControlled && activeTab !== undefined) {
      setUncontrolledTab(getSelectableIndex(tabs || [], activeTab));
    }
  }, [activeTab, isControlled, tabs]);

  const handleTabChange = (i: number) => {
    if (!tabs?.[i] || tabs[i].disabled) return;
    if (!isControlled) setUncontrolledTab(i);
    onTabChange?.(i);
  };

  const isMain = type === 'main';
  const currentTab = getSelectableIndex(tabs || [], isControlled ? activeTab : uncontrolledTab);

  return (
    <div
      className={styles.root}
      style={{
        '--_border-color': borderColor || 'var(--orbit-color-card-border-default)',
        '--_border-width': borderColor ? '2px' : '1px',
      } as React.CSSProperties}
    >
      <div className={styles.row}>
        {!isMain && icon && iconGradient && (
          <GradientIcon icon={icon} gradient={iconGradient} />
        )}

        <div className={styles.titleGroup}>
          {isMain ? (
            <>
              <span className={clsx(styles.title, styles.mainTitle)}>
                {title}
              </span>
              {subtitle && (
                <span className={clsx(styles.subtitle, styles.mainSubtitle)}>
                  {subtitle}
                </span>
              )}
            </>
          ) : (
            <>
              <span className={clsx(styles.title, styles.toolTitle)}>
                {title}
              </span>
              {subtitle && (
                <span className={clsx(styles.subtitle, styles.toolSubtitle)}>
                  {subtitle}
                </span>
              )}
            </>
          )}
        </div>

        {(pill || actions?.length) && (
          <div className={styles.right}>
            {pill && <InitiativePill {...pill} />}
            {actions?.length ? (
              <div className={styles.actions}>
                {actions.map((action, index) => (
                  <ActionButton key={action.id || action.label || `${action.variant || 'action'}-${index}`} {...action} />
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {tabs && tabs.length > 0 && (
        <TabBar
          tabs={tabs}
          activeTab={currentTab}
          onTabChange={handleTabChange}
          showTabUnderline={showTabUnderline}
          tabIdBase={tabIdBase}
        />
      )}
    </div>
  );
};
