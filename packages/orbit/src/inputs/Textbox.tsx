'use client';

import React, { useId, useState } from 'react';
import clsx from 'clsx';
import { FaIcon, FA } from '../primitives/FaIcon';
import styles from './Textbox.module.css';
import { type FieldNamingProps, warnIfUnnamed } from './naming';

export interface BaseTextboxProps {
  message?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  locked?: boolean;
  previewState?: 'hover' | 'focus';
}

export type TextboxProps = BaseTextboxProps & FieldNamingProps;

export const Textbox: React.FC<TextboxProps> = ({
  label,
  ariaLabel,
  ariaLabelledBy,
  message,
  placeholder = 'Enter text',
  value,
  onChange,
  required = false,
  disabled = false,
  invalid = false,
  locked = false,
  previewState,
}) => {
  const inputId = useId();
  const messageId = useId();
  const [focused, setFocused] = useState(false);
  const isDisabled = disabled || locked;
  const currentState = focused && !isDisabled ? 'focus' : previewState;
  const isFilled = Boolean(value);

  warnIfUnnamed('Orbit Textbox', label, ariaLabel, ariaLabelledBy);

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          <span className={styles.labelText}>{label}</span>
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div
        className={clsx(
          styles.inputContainer,
          currentState === 'focus' && styles.inputContainerFocused,
          currentState === 'hover' && styles.inputContainerHover,
          invalid && styles.inputContainerError,
          isDisabled && styles.inputContainerDisabled,
          locked && styles.inputContainerLocked,
        )}
      >
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={isDisabled}
          aria-label={label || ariaLabelledBy ? undefined : ariaLabel}
          aria-labelledby={label ? undefined : ariaLabelledBy}
          aria-describedby={message ? messageId : undefined}
          aria-invalid={invalid || undefined}
          aria-required={required || undefined}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={clsx(styles.input, isFilled && styles.inputFilled)}
        />
        {locked && (
          <span className={styles.lockIcon}>
            <FaIcon icon={'\uf023'} size={12} color="var(--orbit-color-btn-secondary-icon)" />
          </span>
        )}
      </div>
      {message && (
        <span id={messageId} className={clsx(styles.message, invalid && styles.messageError)}>
          {message}
        </span>
      )}
    </div>
  );
};
