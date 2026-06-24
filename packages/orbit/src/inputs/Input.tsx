'use client';

import React, { useId, useState } from 'react';
import clsx from 'clsx';
import styles from './Input.module.css';
import { type StandaloneFieldNamingProps, warnIfUnnamed } from './naming';

export interface BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  id?: string;
  autoComplete?: string;
  ariaDescribedBy?: string;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  previewState?: 'hover' | 'focus';
}

export type InputProps = BaseInputProps & StandaloneFieldNamingProps;

export const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChange,
  icon,
  style: externalStyle,
  id,
  autoComplete,
  ariaDescribedBy,
  ariaLabel,
  ariaLabelledBy,
  required = false,
  disabled = false,
  invalid = false,
  previewState,
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [isFocused, setIsFocused] = useState(false);
  const isFocusedState = (isFocused || previewState === 'focus') && !disabled;
  const isHoverState = previewState === 'hover' && !disabled;
  const isFilled = Boolean(value);
  const accessibleName = ariaLabelledBy ? undefined : ariaLabel;

  warnIfUnnamed('Orbit Input', undefined, ariaLabel, ariaLabelledBy);

  return (
    <div
      className={clsx(
        styles.container,
        isFocusedState && styles.containerFocused,
        isHoverState && styles.containerHover,
        invalid && styles.containerError,
        disabled && styles.containerDisabled,
      )}
      style={externalStyle}
    >
      {icon && (
        <span className={clsx(styles.icon, disabled && styles.iconDisabled)}>
          {icon}
        </span>
      )}
      <input
        id={inputId}
        className={clsx(styles.input, isFilled && styles.inputFilled)}
        placeholder={placeholder}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label={accessibleName}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-invalid={invalid || undefined}
        aria-required={required || undefined}
        required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};
