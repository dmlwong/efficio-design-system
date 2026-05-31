'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './TabButton.module.css';

export interface TabButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  active?: boolean;
  status?: 'Rest' | 'Hover' | 'Disabled';
  showUnderline?: boolean;
  children: React.ReactNode;
  ariaControls?: string;
  disabled?: boolean;
}

export const TabButton = React.forwardRef<HTMLButtonElement, TabButtonProps>(function TabButton({
  active = false,
  status = 'Rest',
  showUnderline = true,
  children,
  onClick,
  ariaControls,
  disabled = false,
  className,
  type = 'button',
  ...buttonProps
}, ref) {
  const isDisabled = disabled || status === 'Disabled';

  return (
    <button
      {...buttonProps}
      ref={ref}
      type={type}
      className={clsx(styles.tabButton, status === 'Hover' && styles.previewHover, className)}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      role="tab"
      aria-selected={active}
      aria-disabled={isDisabled || undefined}
      aria-controls={ariaControls}
      tabIndex={active && !isDisabled ? 0 : -1}
    >
      <div className={styles.wrapper}>
        <span className={clsx(styles.label, active && styles.labelActive)}>
          {children}
        </span>
      </div>
      {active && showUnderline ? (
        <div className={styles.underline} />
      ) : (
        <div className={styles.spacer} />
      )}
    </button>
  );
});
