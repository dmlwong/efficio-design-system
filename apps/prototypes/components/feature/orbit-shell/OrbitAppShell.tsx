'use client';

import React, { useEffect, useState } from 'react';
import { SideNav } from '@efficio/orbit';
import styles from './OrbitAppShell.module.css';

type OrbitNavItem = 'Notifications' | 'Data Tracker & Insights' | 'Home' | 'Content Search';

interface OrbitAppShellProps {
  children: React.ReactNode;
  activeItem?: OrbitNavItem;
}

const navItems = [
  { id: 'notifications', icon: '\uf0f3', label: 'Notifications', badge: 5 },
  { id: 'home', icon: '\uf015', label: 'Home' },
  { id: 'data-tracker-insights', icon: '\uf1c0', label: 'Data Tracker & Insights' },
  { id: 'content-search', icon: '\uf15b', label: 'Content Search' },
];

const sections = [
  {
    id: 'identify',
    label: 'Identify',
    color: 'var(--orbit-color-status-high-bg-information)',
    expanded: false,
    showChevron: true,
  },
  {
    id: 'deliver',
    label: 'Deliver',
    color: 'var(--orbit-color-status-high-bg-success)',
    expanded: false,
    showChevron: true,
  },
  {
    id: 'sustain',
    label: 'Sustain',
    color: 'var(--orbit-color-status-high-bg-warning)',
    expanded: false,
    showChevron: true,
  },
];

const workItems = [
  { id: 'clauseiq-latest', title: 'ClauseIQ', subtitle: '5d ago | TestClientTaxonomyCreatedBy' },
  { id: 'marketiq', title: 'MarketIQ', subtitle: '1w ago' },
  { id: 'clauseiq-previous', title: 'ClauseIQ', subtitle: '1w ago | dfgdfgsdfg' },
];

export const OrbitAppShell: React.FC<OrbitAppShellProps> = ({
  children,
  activeItem = 'Home',
}) => {
  const [currentActiveItem, setCurrentActiveItem] = useState<OrbitNavItem | undefined>(activeItem);
  const [currentWorkItem, setCurrentWorkItem] = useState<string | undefined>();

  useEffect(() => {
    setCurrentActiveItem(activeItem);
    setCurrentWorkItem(undefined);
  }, [activeItem]);

  return (
    <div data-theme="orbit" className={styles.shell}>
      <SideNav
        appName="Connected Platform"
        clientName="Yorkshire Water"
        navItems={navItems.map((item) => ({
          ...item,
          active: item.label === currentActiveItem,
          onClick: () => {
            setCurrentActiveItem(item.label as OrbitNavItem);
            setCurrentWorkItem(undefined);
          },
        }))}
        sections={sections}
        workItems={workItems.map((item) => ({
          ...item,
          active: item.id === currentWorkItem,
          onClick: () => {
            setCurrentWorkItem(item.id);
            setCurrentActiveItem(undefined);
          },
        }))}
        userName="Derek Wong"
        userInitials="DW"
      />
      <div className={styles.mainArea}>{children}</div>
    </div>
  );
};
