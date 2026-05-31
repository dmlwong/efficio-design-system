'use client';

import React from 'react';
import { FaIcon, FA } from '../primitives/FaIcon';

export interface PriceIndicatorProps {
  value?: string;
  movement?: 'Positive' | 'Negative' | 'None';
  position?: 'Left' | 'Right';
  ariaLabel?: string;
}

const movementConfig: Record<string, { icon: string; color: string }> = {
  Positive: { icon: FA.angleUp, color: 'var(--orbit-color-status-high-bg-success)' },
  Negative: { icon: FA.angleDown, color: 'var(--orbit-color-status-high-bg-error)' },
  None: { icon: FA.minus, color: 'var(--orbit-color-silver)' },
};

export const PriceIndicator: React.FC<PriceIndicatorProps> = ({
  value = 'Value',
  movement = 'Positive',
  position = 'Right',
  ariaLabel,
}) => {
  const config = movementConfig[movement];

  const containerStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--orbit-space-xs)',
    padding: 'var(--orbit-space-xs)',
    flexDirection: position === 'Left' ? 'row-reverse' : 'row',
  };

  const labelStyles: React.CSSProperties = {
    fontFamily: 'var(--orbit-font-family-sans)',
    fontSize: 'var(--orbit-text-sm)',
    fontWeight: 'var(--orbit-font-weight-regular)',
    lineHeight: 'var(--orbit-text-body-leading)',
    color: 'var(--orbit-color-text-primary)',
  };

  return (
    <span style={containerStyles} aria-label={ariaLabel || `${value}, ${movement.toLowerCase()} price movement`}>
      <FaIcon icon={config.icon} size={14} color={config.color} />
      <span style={labelStyles}>{value}</span>
    </span>
  );
};
