'use client';

import React from 'react';
import clsx from 'clsx';
import { FaIcon, FA } from '../primitives/FaIcon';
import styles from './StepCircle.module.css';

export interface StepCircleProps {
  status: 'Checked' | 'Active' | 'To Do' | 'Numbered' | 'Disabled';
  size?: 'Large' | 'Medium' | 'Small';
  label?: string | number;
  ariaLabel?: string;
}

const sizeClassMap: Record<NonNullable<StepCircleProps['size']>, string> = {
  Large: styles.large,
  Medium: styles.medium,
  Small: styles.small,
};

const statusClassMap: Record<StepCircleProps['status'], string> = {
  Checked: styles.checked,
  Active: styles.active,
  'To Do': styles.toDo,
  Numbered: styles.numbered,
  Disabled: styles.disabled,
};

const iconSizeMap: Record<NonNullable<StepCircleProps['size']>, number> = {
  Large: 16,
  Medium: 10,
  Small: 8,
};

export const StepCircle: React.FC<StepCircleProps> = ({
  status,
  size = 'Large',
  label,
  ariaLabel,
}) => {
  return (
    <span
      className={clsx(styles.circle, sizeClassMap[size], statusClassMap[status])}
      role="img"
      aria-label={ariaLabel || `Step ${status}${label ? ` ${label}` : ''}`}
    >
      {status === 'Checked' && (
        <FaIcon icon={FA.check} size={iconSizeMap[size]} color="var(--orbit-color-white)" />
      )}
      {status === 'Numbered' && <span className={styles.digit}>{label}</span>}
      {status === 'Active' && <span className={styles.marker} aria-hidden="true" />}
    </span>
  );
};
