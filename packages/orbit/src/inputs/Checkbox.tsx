'use client';

import React, { useId } from 'react';
import clsx from 'clsx';
import { FaIcon, FA } from '../primitives/FaIcon';
import styles from './Checkbox.module.css';

export interface CheckboxProps {
  checked: boolean;
  state?: 'Active' | 'Hover' | 'Disabled';
  alignment?: 'Left' | 'Right';
  label?: string;
  ariaLabel?: string;
  onChange: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  state = 'Active',
  alignment = 'Left',
  label,
  ariaLabel = 'Checkbox',
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
        type="checkbox"
        id={inputId}
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
          styles.box,
          checked && styles.boxChecked,
          state === 'Hover' && styles.boxHover,
          isDisabled && styles.boxDisabled,
        )}
        aria-hidden="true"
      >
        {checked && (
          <FaIcon icon={FA.check} size={10} color="var(--orbit-color-white)" />
        )}
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
