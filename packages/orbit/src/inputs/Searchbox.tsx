'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { FaIcon } from '../primitives/FaIcon';
import styles from './Searchbox.module.css';
import { type StandaloneFieldNamingProps, warnIfUnnamed } from './naming';

export interface BaseSearchboxProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  previewState?: 'hover' | 'focus';
}

export type SearchboxProps = BaseSearchboxProps & StandaloneFieldNamingProps;

export const Searchbox: React.FC<SearchboxProps> = ({
  placeholder = 'Search...',
  value,
  onChange,
  ariaLabel,
  ariaLabelledBy,
  disabled = false,
  invalid = false,
  previewState,
}) => {
  const [focused, setFocused] = useState(false);
  const currentState = focused && !disabled ? 'focus' : previewState;
  const isFilled = Boolean(value);

  warnIfUnnamed('Orbit Searchbox', undefined, ariaLabel, ariaLabelledBy);

  const getIconColor = () => {
    if (disabled) return 'var(--orbit-color-btn-secondary-icon-disabled)';
    return 'var(--orbit-color-btn-secondary-icon)';
  };

  return (
    <div
      className={clsx(
        styles.container,
        currentState === 'focus' && styles.containerFocused,
        currentState === 'hover' && styles.containerHover,
        invalid && styles.containerError,
        disabled && styles.containerDisabled,
      )}
    >
      <input
        type="text"
        aria-label={ariaLabelledBy ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledBy}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={clsx(styles.input, isFilled && styles.inputFilled)}
      />
      <span className={styles.iconWrapper}>
        <FaIcon icon={'\uf002'} size={12} color={getIconColor()} />
      </span>
    </div>
  );
};
