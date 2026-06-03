'use client';

import React from 'react';
import clsx from 'clsx';
import { FaIcon } from '../primitives/FaIcon';
import { Badge } from '../indicators/Badge';
import styles from './MultiStateButton.module.css';

/* ─── MultiStateButton (individual) ─── */

export interface MultiStateButtonProps {
  value: string;
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  leftIcon?: string;
  rightIcon?: string;
  count?: number;
  tabIndex?: number;
}

export const MultiStateButton: React.FC<MultiStateButtonProps> = ({
  label,
  selected = false,
  disabled = false,
  onClick,
  leftIcon,
  rightIcon,
  count,
  tabIndex,
}) => {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      tabIndex={disabled ? -1 : tabIndex ?? 0}
      onClick={disabled ? undefined : onClick}
      className={clsx(styles.button, selected && styles.selected)}
    >
      {leftIcon && (
        <span className={styles.iconSlot}>
          <FaIcon icon={leftIcon} size={12} color="var(--orbit-color-dove-gray)" />
        </span>
      )}
      <span className={styles.label}>
        {label}
      </span>
      {count !== undefined && <Badge label={String(count)} status="Green" />}
      {rightIcon && (
        <span className={styles.iconSlot}>
          <FaIcon icon={rightIcon} size={12} color="var(--orbit-color-dove-gray)" />
        </span>
      )}
    </button>
  );
};

/* ─── MultiStateGroup (container) ─── */

export interface MultiStateGroupProps {
  children: React.ReactNode;
  ariaLabel?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  fullWidth?: boolean;
}

export const MultiStateGroup: React.FC<MultiStateGroupProps> = ({
  children,
  ariaLabel = 'Options',
  value,
  defaultValue,
  onValueChange,
  fullWidth = false,
}) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : uncontrolledValue;

  const validChildren = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<MultiStateButtonProps> => React.isValidElement<MultiStateButtonProps>(child)
  );
  const enabledChildren = validChildren.filter((child) => !child.props.disabled);
  const selectedEnabledChild = enabledChildren.find((child) => child.props.value === selectedValue);
  const tabbableValue = selectedEnabledChild?.props.value ?? enabledChildren[0]?.props.value;

  const handleSelection = (nextValue: string, childOnClick?: () => void) => {
    if (!isControlled) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue);
    childOnClick?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;

    const buttons = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')
    );
    const currentIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (buttons.length === 0 || currentIndex === -1) return;

    event.preventDefault();

    const nextIndex =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? buttons.length - 1
          : event.key === 'ArrowRight' || event.key === 'ArrowDown'
            ? (currentIndex + 1) % buttons.length
            : (currentIndex - 1 + buttons.length) % buttons.length;

    buttons[nextIndex]?.focus();
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={clsx(styles.group, fullWidth && styles.groupFullWidth)}
      onKeyDown={handleKeyDown}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement<MultiStateButtonProps>(child)) return child;

        const childValue = child.props.value;
        const childDisabled = child.props.disabled;

        return React.cloneElement(child, {
          selected: selectedValue === childValue,
          tabIndex: !childDisabled && childValue === tabbableValue ? 0 : -1,
          onClick: childDisabled ? undefined : () => handleSelection(childValue, child.props.onClick),
        });
      })}
    </div>
  );
};
