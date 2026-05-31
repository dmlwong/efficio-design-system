'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { FaIcon } from '../primitives/FaIcon';
import styles from './DateInput.module.css';
import { type StandaloneFieldNamingProps, warnIfUnnamed } from './naming';

export interface BaseDateInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  previewState?: 'hover' | 'focus';
}

export type DateInputProps = BaseDateInputProps & StandaloneFieldNamingProps;

export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  placeholder = 'yy-mm-dd',
  ariaLabel,
  ariaLabelledBy,
  disabled = false,
  invalid = false,
  previewState,
}) => {
  const [focused, setFocused] = useState(false);
  const currentState = focused && !disabled ? 'focus' : previewState;
  const isFilled = Boolean(value);

  warnIfUnnamed('Orbit DateInput', undefined, ariaLabel, ariaLabelledBy);

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
      {/* Text input area */}
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
      {/* Icon button -- separate bordered section */}
      <span
        className={clsx(
          styles.iconButton,
          currentState === 'focus' && styles.iconButtonFocused,
          invalid && styles.iconButtonError,
          disabled && styles.iconButtonDisabled,
        )}
      >
        <span className={styles.iconInner}>
          <FaIcon icon={'\uf073'} size={12} color={getIconColor()} />
        </span>
      </span>
    </div>
  );
};
