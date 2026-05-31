'use client';

import React from 'react';
import clsx from 'clsx';
import { FaIcon } from '../primitives/FaIcon';
import styles from './QuickFilter.module.css';

/* ─── QuickFilterItem ─── */

export interface QuickFilterItemProps {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  leftIcon?: string;
  rightIcon?: string;
}

export const QuickFilterItem: React.FC<QuickFilterItemProps> = ({
  label,
  selected = false,
  disabled = false,
  onClick,
  leftIcon,
  rightIcon,
}) => {
  const iconColor = selected
    ? 'var(--orbit-color-efficio-blue)'
    : 'var(--orbit-color-dove-gray)';

  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={clsx(styles.item, selected && styles.selected)}
    >
      {leftIcon && <FaIcon icon={leftIcon} size={12} color={iconColor} />}
      <span className={styles.itemLabel}>{label}</span>
      {rightIcon && <FaIcon icon={rightIcon} size={12} color={iconColor} />}
    </button>
  );
};

/* ─── QuickFilterGroup ─── */

export interface QuickFilterGroupProps {
  children: React.ReactNode;
  ariaLabel?: string;
}

export const QuickFilterGroup: React.FC<QuickFilterGroupProps> = ({
  children,
  ariaLabel = 'Quick filters',
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;

    const options = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')
    );
    const currentIndex = options.indexOf(document.activeElement as HTMLButtonElement);
    if (options.length === 0 || currentIndex === -1) return;

    event.preventDefault();
    const nextIndex =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? options.length - 1
          : event.key === 'ArrowRight' || event.key === 'ArrowDown'
            ? (currentIndex + 1) % options.length
            : (currentIndex - 1 + options.length) % options.length;

    options[nextIndex]?.focus();
  };

  return (
    <div
      role="toolbar"
      aria-label={ariaLabel}
      className={styles.group}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
};
