'use client';

import React, { useId } from 'react';
import clsx from 'clsx';
import styles from './Radio.module.css';

export interface RadioProps {
  checked: boolean;
  state?: 'Active' | 'Hover' | 'Disabled' | 'Error';
  alignment?: 'Left' | 'Right';
  label?: string;
  ariaLabel?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

export const Radio: React.FC<RadioProps> = ({
  checked,
  state = 'Active',
  alignment = 'Left',
  label,
  ariaLabel = 'Radio',
  name,
  value,
  onChange,
  onKeyDown,
}) => {
  const inputId = useId();
  const isDisabled = state === 'Disabled';
  const isError = state === 'Error';

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
        type="radio"
        id={inputId}
        name={name}
        value={value}
        checked={checked}
        disabled={isDisabled}
        onChange={() => {
          if (!isDisabled) onChange(value);
        }}
        onKeyDown={onKeyDown}
        className={styles.hiddenInput}
        aria-label={label ? undefined : ariaLabel}
        aria-invalid={isError || undefined}
      />
      <span
        className={clsx(
          styles.dot,
          checked && styles.dotChecked,
          state === 'Hover' && styles.dotHover,
          isError && styles.dotError,
          isDisabled && styles.dotDisabled,
        )}
        aria-hidden="true"
      />
      {label && (
        <span className={clsx(styles.label, isDisabled && styles.labelDisabled)}>
          {label}
        </span>
      )}
    </label>
  );
};

export interface RadioGroupProps {
  value: string;
  name: string;
  ariaLabel?: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  name,
  ariaLabel,
  onChange,
  children,
}) => {
  const radios = React.Children.toArray(children).filter(React.isValidElement<RadioProps>);
  const enabledValues = radios
    .filter((child) => child.props.state !== 'Disabled')
    .map((child) => child.props.value);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return;
    if (enabledValues.length === 0) return;

    event.preventDefault();

    const currentIndex = Math.max(enabledValues.indexOf(value), 0);
    const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
    const nextIndex = (currentIndex + direction + enabledValues.length) % enabledValues.length;
    const nextValue = enabledValues[nextIndex];

    if (nextValue) onChange(nextValue);
  };

  return (
    <div role="radiogroup" aria-label={ariaLabel} className={styles.group}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement<RadioProps>(child)) return child;

        return React.cloneElement(child, {
          name,
          checked: child.props.value === value,
          onChange,
          onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
            child.props.onKeyDown?.(event);
            if (!event.defaultPrevented) handleKeyDown(event);
          },
        });
      })}
    </div>
  );
};
