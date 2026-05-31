'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './LegendLabel.module.css';

export interface LegendLabelProps {
  value?: string;
  color?: string;
  position?: 'Left' | 'Right';
}

export const LegendLabel: React.FC<LegendLabelProps> = ({
  value = 'Value',
  color = 'var(--orbit-color-bright-green)',
  position = 'Right',
}) => {
  return (
    <span className={clsx(styles.container, position === 'Left' ? styles.left : styles.right)}>
      <span
        className={styles.dot}
        style={{ '--_color': color } as React.CSSProperties}
      />
      <span className={styles.label}>{value}</span>
    </span>
  );
};
