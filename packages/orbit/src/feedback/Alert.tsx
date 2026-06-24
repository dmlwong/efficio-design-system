'use client';

import React from 'react';
import { FaIcon, FA } from '../primitives/FaIcon';
import styles from './Banner.module.css';

export interface AlertProps {
  type: 'Information' | 'Success' | 'Error' | 'Warning' | 'No Status';
  title: string;
  description?: string;
  onDismiss?: () => void;
}

const DISMISS_ICON_COLOR = 'var(--orbit-color-dark-grey)';

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  description,
  onDismiss,
}) => {
  const bgMap: Record<string, string> = {
    Information: 'var(--orbit-color-status-low-bg-information)',
    Success: 'var(--orbit-color-status-low-bg-success)',
    Error: 'var(--orbit-color-status-low-bg-error)',
    Warning: 'var(--orbit-color-status-low-bg-warning)',
    'No Status': 'var(--orbit-color-status-low-bg-no-status)',
  };

  const iconColorMap: Record<string, string> = {
    Information: 'var(--orbit-color-status-low-icon-information)',
    Success: 'var(--orbit-color-status-low-icon-success)',
    Error: 'var(--orbit-color-status-low-icon-error)',
    Warning: 'var(--orbit-color-status-low-icon-warning)',
    'No Status': 'var(--orbit-color-status-low-icon-no-status)',
  };

  const fgMap: Record<string, string> = {
    Information: 'var(--orbit-color-status-low-fg-information)',
    Success: 'var(--orbit-color-status-low-fg-success)',
    Error: 'var(--orbit-color-status-low-fg-error)',
    Warning: 'var(--orbit-color-status-low-fg-warning)',
    'No Status': 'var(--orbit-color-status-low-fg-no-status)',
  };

  const iconMap: Record<string, string> = {
    Information: FA.circleInfo,
    Success: FA.circleCheck,
    Error: FA.circleExclamation,
    Warning: FA.triangleExclamation,
    'No Status': FA.circleInfo,
  };

  return (
    <div
      className={styles.banner}
      style={{ '--_bg': bgMap[type], '--_fg': fgMap[type] } as React.CSSProperties}
    >
      <div className={styles.wrapper}>
        <span className={styles.iconWrapper}>
          <FaIcon icon={iconMap[type]} size={16} color={iconColorMap[type]} fontWeight={900} />
        </span>
        <div className={styles.contentArea}>
          <span className={styles.title}>{title}</span>
          {description && <span className={styles.description}>{description}</span>}
        </div>
      </div>
      {onDismiss && (
        <button
          type="button"
          className={styles.dismissButton}
          onClick={onDismiss}
          aria-label={`Dismiss ${type.toLowerCase()} alert`}
        >
          <svg
            aria-hidden="true"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 2L10 10M10 2L2 10"
              stroke={DISMISS_ICON_COLOR}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
