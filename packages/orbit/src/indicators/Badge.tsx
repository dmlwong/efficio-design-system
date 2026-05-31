'use client';

import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps {
  label: string;
  status?: 'Green' | 'Red' | 'Gray' | 'Information' | 'Warning' | 'Success' | 'Error' | 'No Status';
  ariaLabel?: string;
}

const bgMap: Record<string, string> = {
  Green: 'var(--orbit-color-bright-green)',
  Red: 'var(--orbit-color-bright-orange)',
  Gray: 'var(--orbit-color-mid-gray)',
  Success: 'var(--orbit-color-status-high-bg-success)',
  Information: 'var(--orbit-color-status-high-bg-information)',
  Warning: 'var(--orbit-color-status-high-bg-warning)',
  Error: 'var(--orbit-color-status-high-bg-error)',
  'No Status': 'var(--orbit-color-status-high-bg-no-status)',
};

const fgMap: Record<NonNullable<BadgeProps['status']>, string> = {
  Green: 'var(--orbit-color-white)',
  Red: 'var(--orbit-color-white)',
  Gray: 'var(--orbit-color-white)',
  Success: 'var(--orbit-color-white)',
  Information: 'var(--orbit-color-white)',
  Warning: 'var(--orbit-color-text-primary)',
  Error: 'var(--orbit-color-white)',
  'No Status': 'var(--orbit-color-text-primary)',
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  status = 'Green',
  ariaLabel,
}) => {
  return (
    <span
      className={styles.badge}
      style={{ '--_bg': bgMap[status], '--_fg': fgMap[status] } as React.CSSProperties}
      aria-label={ariaLabel}
    >
      {label}
    </span>
  );
};
