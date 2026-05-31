'use client';

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { FaIcon } from '../primitives/FaIcon';
import styles from './SideNav.module.css';

/* ─── Types ─── */

export interface SideNavAction {
  id: string;
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

export interface SideNavItem extends SideNavAction {
  icon: string;
  label: string;
  active?: boolean;
  badge?: number;
}

export interface SideNavSubItem extends SideNavAction {
  icon: string;
  label: string;
  active?: boolean;
  muted?: boolean;
}

export interface SideNavSection extends SideNavAction {
  label: string;
  color: string;
  expanded?: boolean;
  showChevron?: boolean;
  items?: SideNavSubItem[];
}

export interface SideNavWorkItem extends SideNavAction {
  title: string;
  subtitle: string;
  active?: boolean;
}

export interface SideNavProps {
  appName: string;
  clientName: string;
  width?: number;
  logoIcon?: string;
  clientChevronIcon?: string;
  navItems?: SideNavItem[];
  sections?: SideNavSection[];
  workItems?: SideNavWorkItem[];
  workHeading?: string;
  workSearchIcon?: string;
  workSearchAriaLabel?: string;
  onWorkSearch?: () => void;
  userName: string;
  userInitials: string;
  profileMenuIcon?: string;
  profileMenuAriaLabel?: string;
  onProfileMenu?: () => void;
  ariaLabel?: string;
}

const EMPTY_NAV_ITEMS: SideNavItem[] = [];
const EMPTY_SECTIONS: SideNavSection[] = [];
const EMPTY_WORK_ITEMS: SideNavWorkItem[] = [];

export type RowPrimitiveProps = {
  href?: string;
  onClick?: () => void;
  className: string;
  children: React.ReactNode;
  ariaLabel?: string;
  ariaCurrent?: 'page';
};

function RowPrimitive({
  href,
  onClick,
  className,
  children,
  ariaLabel,
  ariaCurrent,
}: RowPrimitiveProps) {
  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={className}
        aria-label={ariaLabel}
        aria-current={ariaCurrent}
      >
        {children}
      </a>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={className}
        aria-label={ariaLabel}
        aria-current={ariaCurrent}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={className} aria-label={ariaLabel} aria-current={ariaCurrent}>
      {children}
    </div>
  );
}

function NavItemRow({ icon, label, active, badge, href, onClick, ariaLabel }: SideNavItem) {
  return (
    <RowPrimitive
      href={href}
      onClick={onClick}
      ariaLabel={ariaLabel}
      ariaCurrent={active ? 'page' : undefined}
      className={clsx(styles.row, styles.navRow, active && styles.active, (href || onClick) && styles.interactive)}
    >
      <span className={styles.iconSlot} aria-hidden="true">
        <FaIcon icon={icon} size={12} color="currentColor" />
      </span>
      <span className={styles.rowLabel}>{label}</span>
      {badge !== undefined && <span className={styles.badge}>{badge}</span>}
    </RowPrimitive>
  );
}

function SectionRow({
  section,
  expanded,
  onToggle,
}: {
  section: SideNavSection;
  expanded: boolean;
  onToggle: () => void;
}) {
  const hasChildren = Boolean(section.items?.length);
  const showChevron = hasChildren || section.showChevron;
  const togglesSection = hasChildren || section.showChevron;
  const handleToggle = () => {
    onToggle();
    section.onClick?.();
  };
  const rowContents = (
    <>
      <span
        className={styles.sectionDot}
        style={{ '--section-color': section.color } as React.CSSProperties}
        aria-hidden="true"
      />
      <span className={styles.rowLabel}>{section.label}</span>
      {showChevron && (
        <span className={clsx(styles.chevron, expanded && styles.chevronExpanded)} aria-hidden="true">
          <FaIcon icon={'\uf078'} size={12} color="currentColor" />
        </span>
      )}
    </>
  );

  if (togglesSection) {
    return (
      <button
        type="button"
        className={clsx(styles.row, styles.sectionRow, styles.interactive)}
        aria-expanded={hasChildren ? expanded : undefined}
        aria-label={section.ariaLabel}
        onClick={handleToggle}
      >
        {rowContents}
      </button>
    );
  }

  return (
    <RowPrimitive
      href={section.href}
      onClick={section.onClick}
      ariaLabel={section.ariaLabel}
      className={clsx(styles.row, styles.sectionRow, (section.href || section.onClick) && styles.interactive)}
    >
      {rowContents}
    </RowPrimitive>
  );
}

function SubItemRow({ icon, label, active, muted, href, onClick, ariaLabel }: SideNavSubItem) {
  return (
    <RowPrimitive
      href={href}
      onClick={onClick}
      ariaLabel={ariaLabel}
      ariaCurrent={active ? 'page' : undefined}
      className={clsx(
        styles.row,
        styles.subItem,
        active && styles.active,
        muted && styles.muted,
        (href || onClick) && styles.interactive,
      )}
    >
      <span className={styles.iconSlot} aria-hidden="true">
        <FaIcon icon={icon} size={12} color="currentColor" />
      </span>
      <span className={styles.rowLabel}>{label}</span>
    </RowPrimitive>
  );
}

function WorkItemRow({ title, subtitle, active, href, onClick, ariaLabel }: SideNavWorkItem) {
  return (
    <RowPrimitive
      href={href}
      onClick={onClick}
      ariaLabel={ariaLabel}
      ariaCurrent={active ? 'page' : undefined}
      className={clsx(styles.workItem, active && styles.active, (href || onClick) && styles.interactive)}
    >
      <span className={styles.workTitle}>{title}</span>
      <span className={styles.workSubtitle}>{subtitle}</span>
    </RowPrimitive>
  );
}

/* ─── Main Component ─── */

export const SideNav: React.FC<SideNavProps> = ({
  appName,
  clientName,
  width,
  logoIcon = '\uf890',
  clientChevronIcon = '\uf078',
  navItems = EMPTY_NAV_ITEMS,
  sections = EMPTY_SECTIONS,
  workItems = EMPTY_WORK_ITEMS,
  workHeading = 'My Work',
  workSearchIcon = '\uf002',
  workSearchAriaLabel = 'Search work',
  onWorkSearch,
  userName,
  userInitials,
  profileMenuIcon = '\uf141',
  profileMenuAriaLabel = 'Open profile menu',
  onProfileMenu,
  ariaLabel = 'Main navigation',
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    () => Object.fromEntries(sections.map((section) => [section.id, section.expanded ?? false]))
  );

  useEffect(() => {
    setExpandedSections((prev) => ({
      ...Object.fromEntries(sections.map((section) => [section.id, prev[section.id] ?? section.expanded ?? false])),
    }));
  }, [sections]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sideNavStyle = width === undefined
    ? undefined
    : { '--sidenav-width': `${width}px` } as React.CSSProperties;

  return (
    <aside
      role="navigation"
      aria-label={ariaLabel}
      className={styles.sideNav}
      style={sideNavStyle}
    >
      <div className={styles.topGroup}>
        <div className={styles.header}>
          <span className={styles.logo} aria-hidden="true">
            <FaIcon icon={logoIcon} size={16} color="currentColor" />
          </span>
          <div className={styles.product}>
            <span className={styles.appName}>{appName}</span>
            <span className={styles.clientName}>
              {clientName}
              <span className={styles.clientChevron} aria-hidden="true">
                <FaIcon icon={clientChevronIcon} size={8} color="currentColor" />
              </span>
            </span>
          </div>
        </div>

        <div className={styles.navList}>
          {navItems.map((item) => (
            <NavItemRow key={item.id} {...item} />
          ))}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.sectionList}>
        {sections.map((section) => {
          const expanded = expandedSections[section.id] ?? false;

          return (
            <div key={section.id} className={styles.sectionGroup}>
              <SectionRow
                section={section}
                expanded={expanded}
                onToggle={() => toggleSection(section.id)}
              />
              {expanded && section.items?.length ? (
                <div className={styles.subItemList}>
                  {section.items.map((item) => (
                    <SubItemRow key={item.id} {...item} />
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className={styles.divider} />

      <div className={styles.workRegion}>
        <div className={styles.workHeader}>
          <div className={styles.workHeading}>
            <span>{workHeading}</span>
          </div>
          {onWorkSearch ? (
            <button type="button" className={styles.workTools} aria-label={workSearchAriaLabel} onClick={onWorkSearch}>
              <span className={styles.iconSlot} aria-hidden="true">
                <FaIcon icon={workSearchIcon} size={12} color="currentColor" />
              </span>
            </button>
          ) : (
            <span className={styles.workTools} aria-hidden="true">
              <span className={styles.iconSlot}>
                <FaIcon icon={workSearchIcon} size={12} color="currentColor" />
              </span>
            </span>
          )}
        </div>

        <div className={styles.workList}>
          {workItems.map((item) => (
            <WorkItemRow key={item.id} {...item} />
          ))}
        </div>
      </div>

      <div className={styles.profile}>
        <div className={styles.profileDivider} />
        <div className={styles.profileContent}>
          <span className={styles.avatar} aria-hidden="true">{userInitials}</span>
          <span className={styles.profileName}>{userName}</span>
          {onProfileMenu ? (
            <button type="button" className={styles.profileMenu} aria-label={profileMenuAriaLabel} onClick={onProfileMenu}>
              <FaIcon icon={profileMenuIcon} size={10} color="currentColor" />
            </button>
          ) : (
            <span className={styles.profileMenu} aria-hidden="true">
              <FaIcon icon={profileMenuIcon} size={10} color="currentColor" />
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};
