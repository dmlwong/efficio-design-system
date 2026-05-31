'use client';

import React from 'react';
import { FaIcon, FA } from '../primitives/FaIcon';

export interface RiskIndicatorProps {
  level?: 'Very High' | 'High' | 'Medium' | 'Low' | 'Very Low' | 'None';
  position?: 'Left' | 'Right';
  ariaLabel?: string;
}

const iconConfig: Record<string, { icon: string; color: string }> = {
  'Very High': { icon: FA.anglesUp, color: 'var(--orbit-color-status-high-bg-error)' },
  'High': { icon: FA.angleUp, color: 'var(--orbit-color-status-high-bg-warning)' },
  'Medium': { icon: FA.minus, color: 'var(--orbit-color-silver)' },
  'Low': { icon: FA.angleDown, color: 'var(--orbit-color-status-high-bg-information)' },
  'Very Low': { icon: FA.anglesDown, color: 'var(--orbit-color-status-high-bg-information)' },
  'None': { icon: FA.minus, color: 'var(--orbit-color-silver)' },
};

const labelMap: Record<string, string> = {
  'Very High': 'Very High',
  'High': 'High',
  'Medium': 'Medium',
  'Low': 'Low',
  'Very Low': 'Very Low',
  'None': 'No Change',
};

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  level = 'Very High',
  position = 'Right',
  ariaLabel,
}) => {
  const config = iconConfig[level];

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
    <span style={containerStyles} aria-label={ariaLabel || `Risk ${labelMap[level]}`}>
      <FaIcon icon={config.icon} size={14} color={config.color} />
      <span style={labelStyles}>{labelMap[level]}</span>
    </span>
  );
};
