'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import clsx from 'clsx';
import { FaIcon, FA } from '../primitives/FaIcon';
import { type FieldNamingProps, warnIfUnnamed } from './naming';
import styles from './MultiSelectDropdown.module.css';

export interface MultiSelectDropdownOption {
  label: string;
  value: string;
}

export interface BaseMultiSelectDropdownProps {
  options: MultiSelectDropdownOption[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
}

export type MultiSelectDropdownProps = BaseMultiSelectDropdownProps & FieldNamingProps;

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  ariaLabel,
  ariaLabelledBy,
  options,
  value,
  onChange,
  placeholder = 'Please Select...',
  required = false,
  disabled = false,
  invalid = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const labelId = useId();
  const valueId = useId();
  const activeOptionId = activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined;
  const selectedOptions = options.filter((option) => value.includes(option.value));

  warnIfUnnamed('Orbit MultiSelectDropdown', label, ariaLabel, ariaLabelledBy);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleValue = (nextValue: string) => {
    if (value.includes(nextValue)) {
      onChange(value.filter((existing) => existing !== nextValue));
      return;
    }

    onChange([...value, nextValue]);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => {
        if (options.length === 0) return -1;
        return Math.min(prev < 0 ? 0 : prev + 1, options.length - 1);
      });
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => {
        if (options.length === 0) return -1;
        return Math.max(prev < 0 ? options.length - 1 : prev - 1, 0);
      });
    } else if (event.key === 'Home' && isOpen) {
      event.preventDefault();
      setActiveIndex(options.length > 0 ? 0 : -1);
    } else if (event.key === 'End' && isOpen) {
      event.preventDefault();
      setActiveIndex(options.length > 0 ? options.length - 1 : -1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (isOpen && activeIndex >= 0) toggleValue(options[activeIndex].value);
      else setIsOpen(true);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  const triggerLabelledBy = label ? `${labelId} ${valueId}` : ariaLabelledBy ? `${ariaLabelledBy} ${valueId}` : undefined;
  const triggerAriaLabel = label || ariaLabelledBy || !ariaLabel ? undefined : `${ariaLabel} ${selectedOptions.map((option) => option.label).join(', ') || placeholder}`;
  const listboxLabelledBy = label ? labelId : ariaLabelledBy;
  const listboxAriaLabel = listboxLabelledBy ? undefined : ariaLabel;

  return (
    <div ref={ref} className={styles.container}>
      {label && (
        <div className={styles.labelRow}>
          <span id={labelId} className={styles.labelText}>{label}</span>
          {required && <span className={styles.required} aria-hidden="true">*</span>}
        </div>
      )}
      <div
        ref={triggerRef}
        className={clsx(
          styles.trigger,
          isOpen && styles.triggerOpen,
          invalid && styles.triggerError,
          disabled && styles.triggerDisabled,
        )}
        role="combobox"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-labelledby={triggerLabelledBy}
        aria-label={triggerAriaLabel}
        aria-invalid={invalid || undefined}
        aria-required={required || undefined}
        aria-activedescendant={isOpen ? activeOptionId : undefined}
        aria-disabled={disabled || undefined}
        onClick={() => {
          if (!disabled) setIsOpen((open) => !open);
        }}
        onKeyDown={handleKeyDown}
      >
        <span id={valueId} className={styles.value}>
          {selectedOptions.length > 0 ? (
            selectedOptions.map((option) => (
              <span key={option.value} className={styles.chip}>
                <span>{option.label}</span>
                <button
                  type="button"
                  className={styles.chipRemove}
                  aria-label={`Remove ${option.label}`}
                  disabled={disabled}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleValue(option.value);
                  }}
                >
                  <FaIcon icon={FA.xmark} size={8} color="currentColor" />
                </button>
              </span>
            ))
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
        </span>
        <span className={styles.chevron} aria-hidden="true">
          <FaIcon icon={isOpen ? FA.angleUp : FA.angleDown} size={12} color="currentColor" />
        </span>
      </div>
      {isOpen && (
        <div
          className={styles.overlay}
          role="listbox"
          id={listboxId}
          aria-multiselectable="true"
          aria-labelledby={listboxLabelledBy}
          aria-label={listboxAriaLabel}
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              id={`${listboxId}-option-${index}`}
              role="option"
              aria-selected={value.includes(option.value)}
              className={clsx(
                styles.option,
                value.includes(option.value) && styles.optionSelected,
                activeIndex === index && styles.optionActive,
              )}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => toggleValue(option.value)}
            >
              <span>{option.label}</span>
              {value.includes(option.value) && <FaIcon icon={FA.check} size={12} color="currentColor" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
