'use client';

import React, { useEffect, useState } from 'react';
import { SideNav } from '@efficio/orbit';
import styles from './OrbitAppShell.module.css';

type OrbitNavItem = 'Notifications' | 'Home' | 'Content Search';

interface OrbitAppShellProps {
  children: React.ReactNode;
  activeItem?: OrbitNavItem;
}

const navItems = [
  { id: 'notifications', icon: '\uf0f3', label: 'Notifications' },
  { id: 'home', icon: '\uf015', label: 'Home' },
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

export const OrbitAppShell: React.FC<OrbitAppShellProps> = ({
  children,
  activeItem = 'Home',
}) => {
  const [currentActiveItem, setCurrentActiveItem] = useState<OrbitNavItem | undefined>(activeItem);

  useEffect(() => {
    setCurrentActiveItem(activeItem);
  }, [activeItem]);

  return (
    <div data-theme="orbit" className={styles.shell}>
      <SideNav
        appName="Connected Platform"
        clientName="AstraZeneca"
        navItems={navItems.map((item) => ({
          ...item,
          active: item.label === currentActiveItem,
          onClick: () => {
            setCurrentActiveItem(item.label as OrbitNavItem);
          },
        }))}
        sections={sections}
        showWorkRegion={false}
        showProfile={false}
        userName="Derek Wong"
        userInitials="DW"
      />
      <div className={styles.mainArea}>{children}</div>
    </div>
  );
};
