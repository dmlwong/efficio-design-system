'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import clsx from 'clsx';
import styles from './Dropdown.module.css';
import { FaIcon } from '../primitives/FaIcon';
import { type FieldNamingProps, warnIfUnnamed } from './naming';

export interface DropdownOption {
  label: string;
  value: string;
}

export interface BaseDropdownProps {
  message?: string;
  placeholder?: string;
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  previewState?: 'hover' | 'focus';
}

export type DropdownProps = BaseDropdownProps & FieldNamingProps;

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  ariaLabel,
  ariaLabelledBy,
  message,
  placeholder = 'Please Select...',
  options,
  value,
  onChange,
  required = false,
  disabled = false,
  invalid = false,
  previewState,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();
  const labelId = useId();
  const valueId = useId();
  const messageId = useId();
  const isFocusedPreview = previewState === 'focus';
  const isHoverPreview = previewState === 'hover';

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const idx = options.findIndex((o) => o.value === value);
      setActiveIndex(idx >= 0 ? idx : options.length > 0 ? 0 : -1);
    }
  }, [isOpen, options, value]);

  const selectOption = (index: number) => {
    if (index < 0 || index >= options.length) return;
    onChange(options[index].value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => {
        if (options.length === 0) return -1;
        return Math.min(prev < 0 ? 0 : prev + 1, options.length - 1);
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => {
        if (options.length === 0) return -1;
        return Math.max(prev < 0 ? options.length - 1 : prev - 1, 0);
      });
    } else if (e.key === 'Home' && isOpen) {
      e.preventDefault();
      setActiveIndex(options.length > 0 ? 0 : -1);
    } else if (e.key === 'End' && isOpen) {
      e.preventDefault();
      setActiveIndex(options.length > 0 ? options.length - 1 : -1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isOpen) selectOption(activeIndex);
      else setIsOpen(true);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  const selectedLabel = options.find((o) => o.value === value)?.label;
  const activeOptionId = activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined;
  const visibleValue = selectedLabel || placeholder;
  const triggerLabelledBy = label ? `${labelId} ${valueId}` : ariaLabelledBy ? `${ariaLabelledBy} ${valueId}` : undefined;
  const triggerAriaLabel = label || ariaLabelledBy || !ariaLabel ? undefined : `${ariaLabel} ${visibleValue}`;
  const listboxLabelledBy = label ? labelId : ariaLabelledBy;
  const listboxAriaLabel = listboxLabelledBy ? undefined : ariaLabel;
  const describedBy = message ? messageId : undefined;

  warnIfUnnamed('Orbit Dropdown', label, ariaLabel, ariaLabelledBy);

  return (
    <div ref={ref} className={styles.container}>
      {label && (
        <div className={styles.labelRow}>
          <span id={labelId} className={styles.labelText}>{label}</span>
          {required && <span className={styles.required} aria-hidden="true">*</span>}
        </div>
      )}
      <button
        type="button"
        className={clsx(
          styles.trigger,
          (isOpen || isFocusedPreview) && styles.triggerOpen,
          isHoverPreview && styles.triggerHover,
          invalid && styles.triggerError,
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-labelledby={triggerLabelledBy}
        aria-label={triggerAriaLabel}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        aria-required={required || undefined}
        aria-activedescendant={isOpen ? activeOptionId : undefined}
        onKeyDown={handleTriggerKeyDown}
        ref={triggerRef}
      >
        <span id={valueId} className={clsx(
          styles.triggerValue,
          selectedLabel ? styles.filled : disabled ? styles.disabledText : styles.placeholder,
        )}>
          {selectedLabel || placeholder}
        </span>
        <span className={styles.chevron}>
          <FaIcon
            icon={isOpen ? '\uf077' : '\uf078'}
            size={12}
            color={disabled ? 'var(--orbit-color-btn-secondary-icon-disabled)' : 'var(--orbit-color-btn-secondary-icon)'}
          />
        </span>
      </button>
      {message && (
        <span id={messageId} className={clsx(styles.message, invalid && styles.messageError)}>
          {message}
        </span>
      )}
      {isOpen && (
        <div
          className={styles.overlay}
          role="listbox"
          id={listboxId}
          aria-labelledby={listboxLabelledBy}
          aria-label={listboxAriaLabel}
          aria-activedescendant={activeOptionId}
        >
          {options.map((option, i) => (
            <div
              key={option.value}
              id={`${listboxId}-option-${i}`}
              role="option"
              aria-selected={value === option.value}
              className={clsx(
                styles.option,
                value === option.value && styles.optionSelected,
                activeIndex === i && styles.optionActive,
              )}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectOption(i)}
              onMouseEnter={() => setActiveIndex(i)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
