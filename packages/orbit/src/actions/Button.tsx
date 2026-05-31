'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  variant?: 'Primary' | 'Secondary' | 'Tertiary' | 'Positive' | 'Destructive';
  size?: 'Small' | 'Medium';
  state?: 'Default' | 'Hover' | 'Disabled';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  disabled?: boolean;
}

const variantMap: Record<string, string> = {
  Primary: styles.primary,
  Secondary: styles.secondary,
  Tertiary: styles.tertiary,
  Positive: styles.positive,
  Destructive: styles.destructive,
};

const sizeMap: Record<string, string> = {
  Medium: styles.medium,
  Small: styles.small,
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  variant = 'Primary',
  size = 'Medium',
  state = 'Default',
  children,
  onClick,
  icon,
  iconRight,
  disabled = false,
  className,
  type = 'button',
  ...buttonProps
}, ref) {
  const isDisabled = disabled || state === 'Disabled';

  return (
    <button
      {...buttonProps}
      ref={ref}
      type={type}
      className={clsx(
        styles.button,
        variantMap[variant],
        sizeMap[size],
        state === 'Hover' && styles.previewHover,
        className,
      )}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
      {iconRight && <span className={styles.icon}>{iconRight}</span>}
    </button>
  );
});
