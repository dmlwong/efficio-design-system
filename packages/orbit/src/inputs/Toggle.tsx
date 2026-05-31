'use client';

import React, { useId } from 'react';
import clsx from 'clsx';
import styles from './Toggle.module.css';

export interface ToggleProps {
  checked: boolean;
  state?: 'Active' | 'Disabled';
  alignment?: 'Left' | 'Right';
  label?: string;
  ariaLabel?: string;
  onChange: (checked: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  state = 'Active',
  alignment = 'Left',
  label,
  ariaLabel = 'Toggle',
  onChange,
}) => {
  const isDisabled = state === 'Disabled';
  const inputId = useId();

  return (
    <label
      htmlFor={inputId}
      className={clsx(
        styles.container,
        alignment === 'Right' && styles.containerRight,
        isDisabled && styles.containerDisabled,
      )}
    >
      <input
        id={inputId}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={isDisabled}
        onChange={() => !isDisabled && onChange(!checked)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !isDisabled) {
            event.preventDefault();
            onChange(!checked);
          }
        }}
        className={styles.hiddenInput}
        aria-label={label ? undefined : ariaLabel}
      />
      <span
        className={clsx(
          styles.track,
          checked && styles.trackChecked,
          isDisabled && styles.trackDisabled,
        )}
        aria-hidden="true"
      >
        <span
          className={clsx(
            styles.handle,
            isDisabled && styles.handleDisabled,
          )}
        />
      </span>
      {label && (
        <span
          className={clsx(
            styles.label,
            isDisabled && styles.labelDisabled,
          )}
        >
          {label}
        </span>
      )}
    </label>
  );
};
