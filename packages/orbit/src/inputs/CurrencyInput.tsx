'use client';

import React, { useId, useState } from 'react';
import clsx from 'clsx';
import styles from './CurrencyInput.module.css';
import { type FieldNamingProps, warnIfUnnamed } from './naming';

export interface BaseCurrencyInputProps {
  message?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  currency?: string;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  previewState?: 'hover' | 'focus';
}

export type CurrencyInputProps = BaseCurrencyInputProps & FieldNamingProps;

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  ariaLabel,
  ariaLabelledBy,
  message,
  placeholder = 'Enter text',
  value,
  onChange,
  currency = 'GBP',
  required = false,
  disabled = false,
  invalid = false,
  previewState,
}) => {
  const inputId = useId();
  const messageId = useId();
  const [focused, setFocused] = useState(false);
  const currentState = focused && !disabled ? 'focus' : previewState;
  const isFocused = currentState === 'focus' && !disabled;
  const isFilled = Boolean(value);

  warnIfUnnamed('Orbit CurrencyInput', label, ariaLabel, ariaLabelledBy);

  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={inputId} className={styles.labelRow}>
          <span className={clsx(
            styles.labelText,
            isFocused && styles.labelFocused,
            invalid && styles.labelError,
          )}>
            {label}
          </span>
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={clsx(
        styles.box,
        isFocused && styles.boxFocused,
        currentState === 'hover' && styles.boxHover,
        invalid && styles.boxError,
        disabled && styles.boxDisabled,
      )}>
        <input
          id={inputId}
          type="text"
          className={clsx(styles.input, isFilled && styles.inputFilled)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={label || ariaLabelledBy ? undefined : ariaLabel}
          aria-labelledby={label ? undefined : ariaLabelledBy}
          aria-describedby={message ? messageId : undefined}
          aria-invalid={invalid || undefined}
          aria-required={required || undefined}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <span className={clsx(styles.currency, disabled && styles.currencyDisabled)}>
          {currency}
        </span>
      </div>
      {message && (
        <span id={messageId} className={clsx(styles.message, invalid && styles.messageError)}>
          {message}
        </span>
      )}
    </div>
  );
};
