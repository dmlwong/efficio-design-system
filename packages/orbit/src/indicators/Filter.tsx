'use client';

import React from 'react';
import clsx from 'clsx';
import { FaIcon, FA } from '../primitives/FaIcon';
import styles from './Filter.module.css';

export interface FilterProps {
  label: string;
  onRemove?: () => void;
  state?: 'Default' | 'Hover';
}

export const Filter: React.FC<FilterProps> = ({
  label,
  onRemove,
  state = 'Default',
}) => {
  return (
    <span className={clsx(styles.filter, state === 'Hover' && styles.previewHover)}>
      <span className={styles.label}>{label}</span>
      {onRemove && (
        <button
          type="button"
          className={styles.remove}
          onClick={onRemove}
          aria-label={`Remove ${label}`}
        >
          <FaIcon icon={FA.xmark} size={8} color="currentColor" />
        </button>
      )}
    </span>
  );
};
