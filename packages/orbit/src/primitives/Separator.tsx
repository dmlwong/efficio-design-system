'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './Separator.module.css';

export interface SeparatorProps {
  orientation?: 'Horizontal' | 'Vertical';
  decorative?: boolean;
}

export const Separator: React.FC<SeparatorProps> = ({
  orientation = 'Horizontal',
  decorative = false,
}) => {
  return (
    <div
      role={decorative ? 'presentation' : 'separator'}
      aria-orientation={decorative ? undefined : orientation.toLowerCase() as 'horizontal' | 'vertical'}
      className={clsx(
        styles.separator,
        orientation === 'Horizontal' ? styles.horizontal : styles.vertical,
      )}
    />
  );
};
