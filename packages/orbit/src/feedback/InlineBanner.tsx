'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './InlineBanner.module.css';
import { FaIcon, FA } from '../primitives/FaIcon';

export interface InlineBannerProps {
  variant:
    | 'Information'
    | 'Success'
    | 'Warning'
    | 'Error'
    | 'Style 1'
    | 'None'
    | 'No Status'
    | 'Disabled';
  contrast?: 'High' | 'Low';
  label: string;
  /**
   * Optional by design: product flows may use the strip as label-only feedback.
   * The Figma reference renders a status slot, and the showcase covers that path.
   */
  status?: string;
  icon?: string;
}

const highContrastMap: Record<string, { bg: string; fg: string; iconColor: string }> = {
  Information: { bg: 'var(--orbit-color-status-high-bg-information)', fg: 'var(--orbit-color-white)', iconColor: 'var(--orbit-color-white)' },
  Success: { bg: 'var(--orbit-color-status-high-bg-success)', fg: 'var(--orbit-color-white)', iconColor: 'var(--orbit-color-white)' },
  Warning: { bg: 'var(--orbit-color-status-high-bg-warning)', fg: 'var(--orbit-color-text-primary)', iconColor: 'var(--orbit-color-white)' },
  Error: { bg: 'var(--orbit-color-status-high-bg-error)', fg: 'var(--orbit-color-white)', iconColor: 'var(--orbit-color-white)' },
  'Style 1': { bg: 'var(--orbit-color-status-high-bg-style-1)', fg: 'var(--orbit-color-white)', iconColor: 'var(--orbit-color-white)' },
  None: { bg: 'var(--orbit-color-white)', fg: 'var(--orbit-color-text-primary)', iconColor: 'var(--orbit-color-dove-gray)' },
  'No Status': { bg: 'var(--orbit-color-status-high-bg-no-status)', fg: 'var(--orbit-color-text-primary)', iconColor: 'var(--orbit-color-dove-gray)' },
  Disabled: { bg: 'var(--orbit-color-chip-disabled-bg)', fg: 'var(--orbit-color-chip-disabled-fg)', iconColor: 'var(--orbit-color-chip-disabled-fg)' },
};

const lowContrastMap: Record<string, { bg: string; fg: string; iconColor: string }> = {
  Information: { bg: 'var(--orbit-color-status-low-bg-information)', fg: 'var(--orbit-color-text-info)', iconColor: 'var(--orbit-color-status-low-icon-information)' },
  Success: { bg: 'var(--orbit-color-status-low-bg-success)', fg: 'var(--orbit-color-text-success)', iconColor: 'var(--orbit-color-status-low-icon-success)' },
  Warning: { bg: 'var(--orbit-color-status-low-bg-warning)', fg: 'var(--orbit-color-text-warning)', iconColor: 'var(--orbit-color-status-low-icon-warning)' },
  Error: { bg: 'var(--orbit-color-status-low-bg-error)', fg: 'var(--orbit-color-text-error)', iconColor: 'var(--orbit-color-status-low-icon-error)' },
  'Style 1': { bg: 'var(--orbit-color-chip-additional-bg)', fg: 'var(--orbit-color-chip-additional-fg)', iconColor: 'var(--orbit-color-chip-additional-fg)' },
  None: { bg: 'var(--orbit-color-white)', fg: 'var(--orbit-color-text-primary)', iconColor: 'var(--orbit-color-dove-gray)' },
  'No Status': { bg: 'var(--orbit-color-status-high-bg-no-status)', fg: 'var(--orbit-color-text-primary)', iconColor: 'var(--orbit-color-dove-gray)' },
  Disabled: { bg: 'var(--orbit-color-chip-disabled-bg)', fg: 'var(--orbit-color-chip-disabled-fg)', iconColor: 'var(--orbit-color-chip-disabled-fg)' },
};

const iconMap: Record<string, string> = {
  Information: FA.circleInfo,
  Success: FA.circleCheck,
  Warning: FA.triangleExclamation,
  Error: FA.circleExclamation,
  'Style 1': FA.star,
  None: FA.file,
  'No Status': FA.file,
  Disabled: FA.file,
};

export const InlineBanner: React.FC<InlineBannerProps> = ({
  variant,
  contrast = 'High',
  label,
  status,
  icon,
}) => {
  const colors = (contrast === 'High' ? highContrastMap : lowContrastMap)[variant];
  // Figma renders a border only for the high-contrast None banner.
  const isNoneOutline = variant === 'None' && contrast === 'High';

  return (
    <div
      className={clsx(styles.banner, isNoneOutline && styles.outlined)}
      style={{ '--_bg': colors.bg, '--_fg': colors.fg } as React.CSSProperties}
    >
      <div className={styles.wrapper}>
        <span className={styles.iconBox}>
          <FaIcon icon={icon || iconMap[variant]} size={12} color={colors.iconColor} />
        </span>
        <span className={styles.label}>{label}</span>
      </div>
      {status && <span className={styles.status}>{status}</span>}
    </div>
  );
};
