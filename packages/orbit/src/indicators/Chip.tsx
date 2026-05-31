'use client';

import React from 'react';
import clsx from 'clsx';
import { FaIcon, FA } from '../primitives/FaIcon';
import chipStyles from './Chip.module.css';

type ChipSize = 'Default' | 'Mini' | 'Small' | 'Medium';
type ChipVariant = 'Information' | 'Success' | 'Warning' | 'Error' | 'Additional' | 'No Status' | 'Outline' | 'Disabled';

export interface ChipBaseProps {
  size?: ChipSize;
  variant?: ChipVariant;
  label: string;
  selected?: boolean;
  disabled?: boolean;
}

export type StaticChipProps = ChipBaseProps & {
  removable?: false;
  onClick?: never;
  onRemove?: never;
};

export type ToggleChipProps = ChipBaseProps & {
  removable?: false;
  onClick: () => void;
  onRemove?: never;
};

export type RemovableChipProps = ChipBaseProps & {
  removable: true;
  onRemove?: () => void;
  onClick?: never;
};

export type ChipProps = StaticChipProps | ToggleChipProps | RemovableChipProps;

const variantStyles: Record<string, { bg: string; border?: string; fg: string }> = {
  Information: {
    bg: 'var(--orbit-color-status-low-bg-information)',
    border: 'var(--orbit-color-status-low-border-information)',
    fg: 'var(--orbit-color-text-info)',
  },
  Success: {
    bg: 'var(--orbit-color-status-low-bg-success)',
    border: 'var(--orbit-color-status-low-border-success)',
    fg: 'var(--orbit-color-text-success)',
  },
  Warning: {
    bg: 'var(--orbit-color-status-low-bg-warning)',
    border: 'var(--orbit-color-status-low-border-warning)',
    fg: 'var(--orbit-color-text-warning)',
  },
  Error: {
    bg: 'var(--orbit-color-status-low-bg-error)',
    border: 'var(--orbit-color-status-low-border-error)',
    fg: 'var(--orbit-color-text-error)',
  },
  Additional: {
    bg: 'var(--orbit-color-chip-additional-bg)',
    border: 'var(--orbit-color-chip-additional-border)',
    fg: 'var(--orbit-color-chip-additional-fg)',
  },
  'No Status': {
    bg: 'var(--orbit-color-chip-no-status-bg)',
    fg: 'var(--orbit-color-text-primary)',
  },
  Outline: {
    bg: 'var(--orbit-color-white)',
    border: 'var(--orbit-color-chip-default-border)',
    fg: 'var(--orbit-color-text-primary)',
  },
  Disabled: {
    bg: 'var(--orbit-color-chip-disabled-bg)',
    fg: 'var(--orbit-color-chip-disabled-fg)',
  },
};

export const Chip: React.FC<ChipProps> = (props) => {
  const {
    size = 'Default',
    variant = 'Outline',
    label,
    selected = false,
  } = props;
  const removable = props.removable === true;
  const disabled = props.disabled ?? variant === 'Disabled';
  const onClick = 'onClick' in props ? props.onClick : undefined;
  const onRemove = 'onRemove' in props ? props.onRemove : undefined;
  const vs = variantStyles[variant];
  const isMini = size === 'Mini' || size === 'Small';
  const isInteractive = Boolean(onClick);
  const className = clsx(
    chipStyles.chip,
    isMini ? chipStyles.mini : chipStyles.default,
    isInteractive && chipStyles.interactive,
    selected && chipStyles.selected,
    disabled && chipStyles.disabled,
  );
  const style = {
    '--_bg': vs.bg,
    '--_border': vs.border ? `1px solid ${vs.border}` : 'none',
    '--_fg': vs.fg,
  } as React.CSSProperties;

  if (isInteractive) {
    return (
      <button
        type="button"
        className={className}
        style={style}
        aria-pressed={selected}
        disabled={disabled}
        onClick={disabled ? undefined : onClick}
      >
        <span>{label}</span>
      </button>
    );
  }

  return (
    <span
      className={className}
      style={style}
      aria-disabled={disabled || undefined}
    >
      <span>{label}</span>
      {removable && (
        <button
          type="button"
          className={chipStyles.closeButton}
          onClick={(event) => {
            event.stopPropagation();
            if (!disabled) onRemove?.();
          }}
          disabled={disabled}
          aria-label={`Remove ${label}`}
        >
          <FaIcon icon={FA.xmark} size={10} color="inherit" />
        </button>
      )}
    </span>
  );
};
