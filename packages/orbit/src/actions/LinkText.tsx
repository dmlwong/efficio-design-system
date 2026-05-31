'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './LinkText.module.css';

export interface LinkTextProps {
  label: string;
  href?: string;
  variant?: 'Primary' | 'Secondary' | 'Heading';
  disabled?: boolean;
  current?: boolean;
  external?: boolean;
  onClick?: () => void;
}

export const LinkText: React.FC<LinkTextProps> = ({
  label,
  href = '#',
  variant = 'Primary',
  disabled = false,
  current = false,
  external = false,
  onClick,
}) => {
  const variantClass =
    variant === 'Heading'
      ? styles.heading
      : variant === 'Secondary'
        ? styles.secondary
        : styles.primary;

  return (
    <a
      href={disabled ? undefined : href}
      className={clsx(styles.link, variantClass, disabled && styles.disabled)}
      onClick={disabled ? (event) => event.preventDefault() : onClick}
      aria-disabled={disabled || undefined}
      aria-current={current ? 'page' : undefined}
      tabIndex={disabled ? -1 : undefined}
      target={external && !disabled ? '_blank' : undefined}
      rel={external && !disabled ? 'noopener noreferrer' : undefined}
    >
      {label}
    </a>
  );
};
