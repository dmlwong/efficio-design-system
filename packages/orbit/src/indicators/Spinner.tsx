'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './Spinner.module.css';

export interface SpinnerProps {
  size?: 'Inline' | 'Medium' | 'Large';
  label?: string;
  decorative?: boolean;
}

const sizeMap = {
  Inline: styles.inline,
  Medium: styles.medium,
  Large: styles.large,
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'Inline',
  label = 'Loading',
  decorative = false,
}) => {
  return (
    <span
      className={clsx(styles.spinner, sizeMap[size])}
      role={decorative ? undefined : 'status'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
    />
  );
};
