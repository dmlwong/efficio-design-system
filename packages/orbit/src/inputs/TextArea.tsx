'use client';

import React, { useId, useState } from 'react';
import clsx from 'clsx';
import styles from './TextArea.module.css';
import { type FieldNamingProps, warnIfUnnamed } from './naming';

export interface BaseTextAreaProps {
  message?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  previewState?: 'hover' | 'focus';
  rows?: number;
}

export type TextAreaProps = BaseTextAreaProps & FieldNamingProps;

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  ariaLabel,
  ariaLabelledBy,
  message,
  placeholder = 'Enter text',
  value,
  onChange,
  maxLength = 250,
  required = false,
  disabled = false,
  invalid = false,
  previewState,
  rows = 3,
}) => {
  const inputId = useId();
  const messageId = useId();
  const [focused, setFocused] = useState(false);
  const currentState = focused && !disabled ? 'focus' : previewState;
  const isFilled = Boolean(value);

  warnIfUnnamed('Orbit TextArea', label, ariaLabel, ariaLabelledBy);

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          <span className={styles.labelText}>{label}</span>
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        aria-label={label || ariaLabelledBy ? undefined : ariaLabel}
        aria-labelledby={label ? undefined : ariaLabelledBy}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={clsx(
          styles.textarea,
          currentState === 'focus' && styles.textareaFocused,
          currentState === 'hover' && styles.textareaHover,
          invalid && styles.textareaError,
          disabled && styles.textareaDisabled,
          isFilled && styles.textareaFilled,
        )}
        aria-describedby={message ? messageId : undefined}
        aria-invalid={invalid || undefined}
        aria-required={required || undefined}
        required={required}
      />
      <div className={styles.footer}>
        {message && (
          <span id={messageId} className={clsx(styles.message, invalid && styles.messageError)}>
            {message}
          </span>
        )}
        <span className={styles.charCount}>
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
};
