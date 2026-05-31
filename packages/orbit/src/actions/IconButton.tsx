'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './IconButton.module.css';

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'disabled' | 'aria-label'> {
  variant?: 'Primary' | 'Secondary' | 'Tertiary' | 'Positive' | 'Destructive';
  size?: 'Small' | 'Medium' | 'Large';
  state?: 'Default' | 'Hover' | 'Disabled';
  icon: React.ReactNode;
  ariaLabel: string;
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
  Small: styles.small,
  Medium: styles.medium,
  Large: styles.large,
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton({
  variant = 'Secondary',
  size = 'Medium',
  state = 'Default',
  icon,
  onClick,
  ariaLabel,
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
        styles.iconButton,
        variantMap[variant],
        sizeMap[size],
        state === 'Hover' && styles.previewHover,
        className,
      )}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
});
