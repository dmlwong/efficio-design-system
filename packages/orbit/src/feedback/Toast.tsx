'use client';

import React, { useEffect } from 'react';
import { FaIcon, FA } from '../primitives/FaIcon';
import styles from './Toast.module.css';

export interface ToastAction {
  label: string;
  onClick: () => void;
  variant?: 'Primary' | 'Secondary';
}

export interface ToastProps {
  type: 'Success' | 'Error' | 'Info' | 'Warning' | 'Mute' | 'NoStatus';
  message: string;
  visible: boolean;
  onDismiss?: () => void;
  actions?: ToastAction[];
}

export const Toast: React.FC<ToastProps> = ({ type, message, visible, onDismiss, actions }) => {
  useEffect(() => {
    if (visible && onDismiss) {
      const timer = setTimeout(onDismiss, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onDismiss]);

  if (!visible) return null;

  const bgMap: Record<string, string> = {
    Success: 'var(--orbit-color-status-high-bg-success)',
    Error: 'var(--orbit-color-status-high-bg-error)',
    Info: 'var(--orbit-color-status-high-bg-information)',
    Warning: 'var(--orbit-color-status-high-bg-warning)',
    Mute: 'var(--orbit-color-status-high-bg-no-status)',
    NoStatus: 'var(--orbit-color-status-high-bg-no-status)',
  };

  const fgMap: Record<string, string> = {
    Success: 'var(--orbit-color-white)',
    Error: 'var(--orbit-color-white)',
    Info: 'var(--orbit-color-white)',
    Warning: 'var(--orbit-color-black)',
    Mute: 'var(--orbit-color-text-primary)',
    NoStatus: 'var(--orbit-color-text-primary)',
  };

  const iconMap: Record<string, string> = {
    Success: FA.circleCheck,
    Error: FA.circleExclamation,
    Info: FA.circleInfo,
    Warning: FA.triangleExclamation,
    Mute: FA.minus,
    NoStatus: FA.minus,
  };

  return (
    <div
      className={styles.toast}
      style={{ '--_bg': bgMap[type], '--_fg': fgMap[type] } as React.CSSProperties}
      role={type === 'Error' ? 'alert' : 'status'}
      aria-live={type === 'Error' ? 'assertive' : 'polite'}
    >
      <div className={styles.content}>
        <span className={styles.iconWrapper}>
          <FaIcon icon={iconMap[type]} size={12} color="inherit" />
        </span>
        <span>{message}</span>
      </div>
      {actions?.length ? (
        <div className={styles.actions}>
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className={action.variant === 'Primary' ? styles.actionPrimary : styles.actionSecondary}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
      {onDismiss && (
        <button
          type="button"
          className={styles.dismissButton}
          onClick={onDismiss}
          aria-label={`Dismiss ${type.toLowerCase()} toast`}
        >
          <FaIcon icon={FA.xmarkLarge} size={12} color="inherit" />
        </button>
      )}
    </div>
  );
};
