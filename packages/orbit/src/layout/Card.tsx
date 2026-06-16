'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

export type CardState =
  | 'Default'
  | 'Hover'
  | 'Accent'
  | 'Highlight'
  | 'Feature'
  | 'Information'
  | 'Success'
  | 'Warning'
  | 'Error'
  | 'Disabled';

export interface CardProps {
  state?: CardState;
  /**
   * Figma `HasShadow` variant. When omitted, legacy `type` is used for backwards
   * compatibility; otherwise the Figma default is no shadow.
   */
  hasShadow?: boolean;
  /** @deprecated Prefer `hasShadow`. `Dynamic` maps to `hasShadow={true}`. */
  type?: 'Static' | 'Dynamic';
  padding?: 'Base' | 'Medium' | 'Small';
  /**
   * Show the 4px status rail on the left edge ("Has Highlight" in Figma).
   * Defaults to hidden to match the Figma Card component.
   */
  indicator?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export interface CardContentProps {
  padding?: 'Base' | 'Medium' | 'Small';
  orientation?: 'Vertical' | 'Horizontal';
  children: React.ReactNode;
}

/** Maps each state to the token suffix used for its background, border and indicator colours. */
const STATE_TOKEN: Record<CardState, string> = {
  Default: 'default',
  Hover: 'default',
  Accent: 'accent',
  Highlight: 'highlight',
  Feature: 'feature',
  Information: 'information',
  Success: 'success',
  Warning: 'warning',
  Error: 'error',
  Disabled: 'disabled',
};

export const CardContent: React.FC<CardContentProps> = ({
  padding = 'Base',
  orientation = 'Vertical',
  children,
}) => {
  const paddingClass = {
    Base: styles.paddingBase,
    Medium: styles.paddingMedium,
    Small: styles.paddingSmall,
  }[padding];

  return (
    <div
      className={clsx(
        styles.contentPlaceholder,
        orientation === 'Horizontal' ? styles.contentHorizontal : styles.contentVertical,
        paddingClass,
      )}
    >
      {children}
    </div>
  );
};

CardContent.displayName = 'CardContent';

export const Card: React.FC<CardProps> = ({
  state = 'Default',
  hasShadow,
  type,
  padding = 'Base',
  indicator = false,
  children,
  style: externalStyle,
}) => {
  const isDisabled = state === 'Disabled';
  const isDynamic = state === 'Hover' ? true : hasShadow ?? (type === 'Dynamic');
  const token = STATE_TOKEN[state];
  const showRail = indicator;
  const usesContentPlaceholder = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === CardContent,
  );

  const paddingClass = {
    Base: styles.paddingBase,
    Medium: styles.paddingMedium,
    Small: styles.paddingSmall,
  }[padding];

  return (
    <div
      className={clsx(
        styles.card,
        isDynamic ? styles.dynamic : styles.static,
        state === 'Hover' && styles.previewHover,
        isDisabled && styles.disabled,
        !usesContentPlaceholder && paddingClass,
      )}
      style={{
        '--_bg': `var(--orbit-color-card-bg-${token})`,
        '--_border-color': `var(--orbit-color-card-border-${token})`,
        ...externalStyle,
      } as React.CSSProperties}
      aria-disabled={isDisabled || undefined}
    >
      {showRail && (
        <span
          aria-hidden="true"
          className={styles.indicator}
          style={{ '--_indicator': `var(--orbit-color-card-indicator-${token})` } as React.CSSProperties}
        />
      )}
      {children}
    </div>
  );
};
