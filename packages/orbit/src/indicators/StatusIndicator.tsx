'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './StatusIndicator.module.css';

export interface StatusIndicatorProps {
  status: 'Success' | 'Warning' | 'Information' | 'Error' | 'No Status';
  size?: 'Small' | 'Default';
  label?: string;
  ariaLabel?: string;
}

const colorMap: Record<string, string> = {
  Success: 'var(--orbit-color-status-high-bg-success)',
  Information: 'var(--orbit-color-status-high-bg-information)',
  Error: 'var(--orbit-color-status-high-bg-error)',
  Warning: 'var(--orbit-color-status-high-bg-warning)',
  'No Status': 'var(--orbit-color-status-high-bg-no-status)',
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'Default',
  label,
  ariaLabel,
}) => {
  return (
    <span
      className={styles.container}
      role={label ? undefined : 'img'}
      aria-label={label ? undefined : ariaLabel || status}
    >
      <span
        className={clsx(styles.dot, size === 'Small' ? styles.dotSmall : styles.dotDefault)}
        style={{ '--_color': colorMap[status] } as React.CSSProperties}
        aria-hidden="true"
      />
      {label && <span className={styles.label}>{label}</span>}
    </span>
  );
};
