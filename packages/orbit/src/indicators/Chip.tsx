'use client';

import React from 'react';
import clsx from 'clsx';
import { FaIcon, FA } from '../primitives/FaIcon';
import chipStyles from './Chip.module.css';

type ChipSize = 'Default' | 'Mini' | 'Small' | 'Medium';
type ChipContrast = 'High' | 'Low';
type ChipVariant =
  | 'Information'
  | 'Success'
  | 'Warning'
  | 'Error'
  | 'Style 1'
  | 'Style 2'
  | 'Style 3'
  | 'Style 4'
  | 'Additional'
  | 'No Status'
  | 'None'
  | 'Outline'
  | 'Disabled';

export interface ChipBaseProps {
  size?: ChipSize;
  variant?: ChipVariant;
  /** Visual weight. `High` renders a solid fill; `Low` (default) renders a tinted, bordered chip. */
  contrast?: ChipContrast;
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

type ChipStyle = { bg: string; border?: string; fg: string };

const disabledStyle: ChipStyle = {
  bg: 'var(--orbit-color-chip-disabled-bg)',
  fg: 'var(--orbit-color-chip-disabled-fg)',
};

/** Low-contrast (tinted + bordered) chips — the default weight. */
const lowStyles: Record<string, ChipStyle> = {
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
  'Style 1': {
    bg: 'var(--orbit-color-chip-style-1-bg)',
    border: 'var(--orbit-color-chip-style-1-border)',
    fg: 'var(--orbit-color-chip-style-1-border)',
  },
  'Style 2': {
    bg: 'var(--orbit-color-chip-style-2-bg)',
    border: 'var(--orbit-color-chip-style-2-border)',
    fg: 'var(--orbit-color-chip-style-2-border)',
  },
  'Style 3': {
    bg: 'var(--orbit-color-chip-style-3-bg)',
    border: 'var(--orbit-color-chip-style-3-border)',
    fg: 'var(--orbit-color-chip-style-3-border)',
  },
  'Style 4': {
    bg: 'var(--orbit-color-chip-style-4-bg)',
    border: 'var(--orbit-color-chip-style-4-border)',
    fg: 'var(--orbit-color-chip-style-4-border)',
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
  None: {
    bg: 'var(--orbit-color-chip-no-status-bg)',
    fg: 'var(--orbit-color-text-primary)',
  },
  Outline: {
    bg: 'var(--orbit-color-white)',
    border: 'var(--orbit-color-chip-default-border)',
    fg: 'var(--orbit-color-text-primary)',
  },
  Disabled: disabledStyle,
};

/** High-contrast (solid fill) chips. Variants without a solid treatment fall back to low contrast. */
const highStyles: Record<string, ChipStyle> = {
  Information: { bg: 'var(--orbit-color-chip-high-bg-information)', fg: 'var(--orbit-color-chip-high-fg)' },
  Success: { bg: 'var(--orbit-color-chip-high-bg-success)', fg: 'var(--orbit-color-chip-high-fg)' },
  Warning: { bg: 'var(--orbit-color-chip-high-bg-warning)', fg: 'var(--orbit-color-chip-high-fg)' },
  Error: { bg: 'var(--orbit-color-chip-high-bg-error)', fg: 'var(--orbit-color-chip-high-fg)' },
  'Style 1': { bg: 'var(--orbit-color-chip-high-bg-style-1)', fg: 'var(--orbit-color-chip-high-fg)' },
  'No Status': { bg: 'var(--orbit-color-chip-high-bg-none)', fg: 'var(--orbit-color-chip-high-fg-none)' },
  None: { bg: 'var(--orbit-color-chip-high-bg-none)', fg: 'var(--orbit-color-chip-high-fg-none)' },
  Disabled: disabledStyle,
};

function resolveChipStyle(variant: string, contrast: ChipContrast): ChipStyle {
  if (contrast === 'High' && highStyles[variant]) {
    return highStyles[variant];
  }
  return lowStyles[variant] ?? lowStyles.Outline;
}

export const Chip: React.FC<ChipProps> = (props) => {
  const {
    size = 'Default',
    variant = 'Outline',
    contrast = 'Low',
    label,
    selected = false,
  } = props;
  const removable = props.removable === true;
  const disabled = props.disabled ?? variant === 'Disabled';
  const onClick = 'onClick' in props ? props.onClick : undefined;
  const onRemove = 'onRemove' in props ? props.onRemove : undefined;
  const vs = disabled ? disabledStyle : resolveChipStyle(variant, contrast);
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
