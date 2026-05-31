'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

export interface CardProps {
  state?: 'Default' | 'Hover' | 'Highlight' | 'Accent' | 'Disabled' | 'Success' | 'Warning';
  type?: 'Static' | 'Dynamic';
  padding?: 'Base' | 'Medium' | 'Small';
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  state = 'Default',
  type = 'Dynamic',
  padding = 'Base',
  children,
  style: externalStyle,
}) => {
  const isDisabled = state === 'Disabled';
  const isDynamic = type === 'Dynamic';

  const getBorderColor = (): string => {
    switch (state) {
      case 'Highlight': return 'var(--orbit-color-card-border-highlight)';
      case 'Accent': return 'var(--orbit-color-card-border-accent)';
      case 'Disabled': return 'transparent';
      case 'Success': return 'var(--orbit-color-card-border-selected)';
      case 'Warning': return 'var(--orbit-color-card-border-style1)';
      default: return 'var(--orbit-color-card-border-default)';
    }
  };

  const getBgColor = (): string => {
    switch (state) {
      case 'Accent': return 'var(--orbit-color-card-bg-accent)';
      case 'Disabled': return 'var(--orbit-color-card-bg-disabled)';
      case 'Success': return 'var(--orbit-color-card-bg-selected)';
      case 'Warning': return 'var(--orbit-color-card-bg-style1)';
      default: return 'var(--orbit-color-card-bg-default)';
    }
  };

  const paddingClass = {
    Base: styles.paddingBase,
    Medium: styles.paddingMedium,
    Small: styles.paddingSmall,
  }[padding];

  return (
    <div
      className={clsx(
        styles.card,
        isDynamic ? styles.dynamic : styles.static,
        state === 'Hover' && styles.previewHover,
        isDisabled && styles.disabled,
        paddingClass,
      )}
      style={{
        '--_bg': getBgColor(),
        '--_border-color': getBorderColor(),
        ...externalStyle,
      } as React.CSSProperties}
      aria-disabled={isDisabled || undefined}
    >
      {children}
    </div>
  );
};
